const DBManager = require('./DBManager');
const Property = require('../entities/Property');
const Railroad = require('../entities/Railroad');
const Utility = require('../entities/Utility');
const Empty = require('../entities/Empty');
const FindObjects = require('./FindObjects');
const CreateObjects = require('./CreateObjects');
const C = require('../constants/GameConstants');

class GameManager {

    static games = [];
    constructor(orm) {
        this.dbm = new DBManager(orm);
        this.find = new FindObjects(orm);
        this.create = new CreateObjects(orm);
    }

    static addGame(game) {
        GameManager.games.push(game);
    }
    static removeGame(game) {
        const index = GameManager.games.indexOf(game);
        if (index !== -1) {
            GameManager.games.splice(index, 1);
        }
    }

    async saveChanges(idGame) {
        let game = await this.find.findGame(idGame, GameManager);
        await this.dbm.updateModelById('Game', idGame, game.updateState());

        for (const player of game.players) {
            await this.dbm.updateModelById('Player', player.id, player.updateState());
        }

        for (const square of game.board.squares) {
            if (square instanceof Property) {
                await this.dbm.updateModelById('Property', square.idUpdate, square.updateState());
            }
            else if (square instanceof Railroad) {
                await this.dbm.updateModelById('RailRoad', square.idUpdate, square.updateState());
            }
            else if (square instanceof Utility) {
                await this.dbm.updateModelById('Utility', square.idUpdate, square.updateState());
            }
            else if (square instanceof Empty) {
                await this.dbm.updateModelById('Empty', square.idUpdate, square.updateState());
            }
        }
        await this.dbm.updateModelById('Board', game.board.id, game.board.updateState());

        return game;
    }
    async joinGame(idGame, nombrePlayer, userID) {
        let game = await this.find.findGame(idGame, GameManager);
        let playerEnPartida = false;
        let nickRepetido = false;
        let nombreMuyLargo = false;
        let cupoDisponible = false;

        if (nombrePlayer.length > C.LEN_NICKNAME_MAX) {
            nombreMuyLargo = true;
        }
        if (!game.error && game.players) {
            game.players.forEach(player => {
                if (player.idUser == userID) {
                    //El jugador ya se encuentra en la partida
                    playerEnPartida = true;
                }
                if (player.nombre == nombrePlayer) {
                    //El nickname ya se encuentra en la partida
                    nickRepetido = true;
                }
            });
            cupoDisponible = game.players.length < C.MAX_PLAYER_PER_GAME;
            if (game && !game.gameComenzado && !playerEnPartida && cupoDisponible
                && !nickRepetido && !nombreMuyLargo) {
                //Se crea un nuevo jugador para ese juego
                let player = await this.create.newPlayer(idGame, nombrePlayer, userID);
                game.joinGame(player);
                await this.saveChanges(idGame);
                return { game };
            }
        }
        return !game
            ? { error: "Juego no encontrado", game }
            : game.gameComenzado
                ? { error: "Juego ya ha sido inicializado", game }
                : playerEnPartida
                    ? { error: "Jugador ya se encuentra en la partida", game }
                    : !cupoDisponible
                        ? { error: "La sala se encuentra llena", game }
                        : nickRepetido
                            ? { error: "El nickname ya se encuentra en la sala", game }
                            : nombreMuyLargo
                                ? { error: "El nickname tiene una longitud mayor a 12 caracteres", game }
                                : { error: "Ha ocurrido un error", game };
    }

    async voteGame(idGame, voteStart, userID) {
        let game = await this.find.findGame(idGame, GameManager);

        if (!game.error) {
            game.players.forEach(player => {
                if (player.idUser == userID) {
                    player.votarComenzarPartida(voteStart);
                }
            })
        }
        //No se guardan cambios porque no es importante en este caso.
        return { game }
    }

    async leaveGame(idGame, userID) {
        let game = await this.find.findGame(idGame, GameManager);
        let idPlayer = null;
        if (!game.error) {
            game.players.forEach(player => {
                if (player.idUser == userID) {
                    idPlayer = player.id;
                }
            });
            let result = false;
            if (idPlayer && !game.gameComenzado && !game.gameFinalizado) {
                result = game.leaveGame(idPlayer);
                this.dbm.deleteData('Player', { id: idPlayer, idGame: idGame });
                await this.saveChanges(idGame);
            }
            if (result) return { game }
            else if (game.gameComenzado) return { error: "La sala ya ha sido inicializada", game }
            else if (game.gameFinalizado) return { error: "El juego ya ha terminado", game }
            else return { error: "No se ha encontrado al jugador", game }
        }
        else {
            return { error: game.error }
        }

    }

    async startGame(idGame, userID) {
        let game = await this.find.findGame(idGame, GameManager);
        let playerEnPartida = false;
        let todosDeAcuerdo = true;
        let nPlayers = 0;
        let cumpleMinPlayers = false;
        if (!game.error) {
            game.players.forEach(player => {
                nPlayers++;
                if (player.idUser == userID) {
                    //El jugador ya se encuentra en la partida
                    //Entonces puede iniciar el juego porque le pertenece
                    playerEnPartida = true;
                }
                if (!player.votoComienzo) {
                    todosDeAcuerdo = false;
                }
            });
        }
        if (nPlayers >= C.MIN_PLAYER_PER_GAME) cumpleMinPlayers = true;
        if (!game.error && !game.gameComenzado && playerEnPartida && todosDeAcuerdo && cumpleMinPlayers) {
            game.inicializarGame();
            await this.saveChanges(idGame);
            return { game };
        }
        return game.error
            ? { error: "Juego no encontrado", game }
            : !playerEnPartida
                ? { error: "Jugador no pertenece a ese juego", game }
                : game.gameComenzado
                    ? { error: "Juego ya ha sido inicializado", game }
                    : !todosDeAcuerdo
                        ? { error: "Faltan votaciones para iniciar el juego", game }
                        : !cumpleMinPlayers
                            ? { error: "Se necesitan al menos 2 jugadores para poder iniciar el juego", game }
                            : { error: "Ha ocurrido un error", game };
    }
}

module.exports = GameManager;