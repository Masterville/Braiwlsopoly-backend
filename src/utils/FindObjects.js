const DBManager = require('./DBManager');
const Board = require('../entities/Board');
const Game = require('../entities/Game');
const Player = require('../entities/Player');
const Property = require('../entities/Property');
const Railroad = require('../entities/Railroad');
const Utility = require('../entities/Utility');
const Empty = require('../entities/Empty');

class FindObjects {
    constructor(orm) {
        this.dbm = new DBManager(orm);
    }

    async findProperties(idBoard) {
        //Buscamos todas las properties que pertenecen al board
        let propertiesBBDD = await this.dbm.findAllData('Property', { idBoard: idBoard });
        if (propertiesBBDD) {
            return propertiesBBDD.map(property => new Property(property));
        }
        return [];
    }
    async findRailroads(idBoard) {
        //Buscamos todos los railroads que pertenecen al board
        let railroadsBBDD = await this.dbm.findAllData('RailRoad', { idBoard: idBoard });
        if (railroadsBBDD) {
            return railroadsBBDD.map(railroad => new Railroad(railroad));
        }
        return [];
    }
    async findUtilities(idBoard) {
        //Buscamos todos los utilities que pertenecen al board
        let utilitiesBBDD = await this.dbm.findAllData('Utility', { idBoard: idBoard });
        if (utilitiesBBDD) {
            return utilitiesBBDD.map(utility => new Utility(utility));
        }
        return [];
    }
    async findEmpties(idBoard) {
        //Buscamos todos los empties que pertenecen al board
        let emptiesBBDD = await this.dbm.findAllData('Empty', { idBoard: idBoard });
        if (emptiesBBDD) {
            return emptiesBBDD.map(empty => new Empty(empty));
        }
        return [];
    }
    async findBoard(idGame) {
        let boardBBDD = await this.dbm.findOneData('Board', { idGame: idGame });
        if (!boardBBDD) {
            boardBBDD = await this.dbm.createBoard(idGame);
        }
        const board = new Board({ ...boardBBDD.dataValues });
        return board;
    }
    async findPlayers(idGame) {
        const playersBBDD = await this.dbm.findAllData('Player', { idGame: idGame, bancarrota: false });
        console.log(playersBBDD);
        if (playersBBDD) {
            return playersBBDD.map(player => new Player(player));
        }
        return [];
    }
    async findGame(idGame, GameManager) {
        // Se revisa si se encuentra en el GameManager
        const gameEncontrado = GameManager.games.find(game => game.id === idGame);
        if (gameEncontrado) {
            return gameEncontrado;
        }
        // En caso contrario, se busca en la base de datos
        const gameBBDD = await this.dbm.findOneData('Game', { id: idGame });
        if (gameBBDD) {
            const board = await this.findBoard(idGame);
            const [properties, railroads, utilities, empties] = await Promise.all([
                this.findProperties(board.id),
                this.findRailroads(board.id),
                this.findUtilities(board.id),
                this.findEmpties(board.id),
            ]);
            board.asignarSquares([...properties, ...railroads, ...utilities, ...empties]);
            const players = await this.findPlayers(gameBBDD.id);
            const game = new Game({ ...gameBBDD.dataValues, players, board });

            GameManager.addGame(game);
            return game;
        }
        return { error: "Juego no encontrado" };
    }

    async findGamesFinished(GameManager, finished) {
        //Se buscan los juegos
        const gamesBBDD = await this.dbm.findAllData('Game', {gameFinalizado: finished});
        const games = [];
        if (gamesBBDD) {
            for (const gameBBDD of gamesBBDD) {
                let gameEncontrado = await this.findGame(gameBBDD.dataValues.id, GameManager);
                if (!gameEncontrado.error) {
                    games.push(gameEncontrado);
                }
            }
        }
        return games;
    }
}

module.exports = FindObjects;