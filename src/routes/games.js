const Router = require('koa-router');
const GameManager = require('../utils/GameManager');
const UsersManager = require('../utils/UsersManager');
const authUtils = require('../utils/auth/jwt.js');

const router = new Router();

//Endpoint encargado de crear un juego (Solo el admin puede) 
//No recibe parametros en el body
router.post('games.create', '/create', authUtils.isAdmin, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    const um = new UsersManager(ctx.orm);
    try {
        //Crear un nuevo juego
        const user = await um.findUser(ctx.userID);
        const newGame = await gm.create.newGame(GameManager, user.username);
        ctx.body = newGame;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }
})

//Endpoint encargado de obtener todos los juegos no finalizados (Todos pueden) 
//No recibe parametros en el body
router.get('games.unfinished', '/unfinished', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const gamesFound = await gm.find.findGamesFinished(GameManager, false);
        ctx.body = gamesFound;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }

})

//Endpoint encargado de encontrar un game (Todos pueden) 
//Recibe en la url el id del Game
router.get('games.find', '/:idGame', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const gameFound = await gm.find.findGame(parseInt(ctx.params.idGame), GameManager);
        if(gameFound.error) {
            ctx.body = "Juego no encontrado";
            ctx.status = 404;
            return;
        }
        ctx.body = gameFound;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = error;
        ctx.status = 400;
    }
})
//Endpoint encargado de unirse a un game (Todos pueden)
//Recibe en el body el id del game y su nick para el juego
router.post('games.join', '/join', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const data = ctx.request.body;
        if(!data.idGame || !data.nombrePlayer) {
            ctx.body = "Faltan parámetros para poder unirse a la partida";
            ctx.status = 400;
            return;
        }
        const gameJoined = await gm.joinGame(data.idGame, data.nombrePlayer, ctx.userID);
        ctx.body = gameJoined;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
});

//Endpoint encargado de votar por empezar un juego
//Recibe en el body el id del game y un booleano indicando si quiere iniciar la partida
router.post('games.vote', '/vote', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const data = ctx.request.body;
        if(!data.idGame || !data.voteStart) {
            ctx.body = "Faltan parámetros para poder votar la partida";
            ctx.status = 400;
            return;
        }
        const gameVoted = await gm.voteGame(data.idGame, data.voteStart, ctx.userID);
        ctx.body = gameVoted;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
})

//Endpoint encargado de comenzar un game (Todos pueden)
//Recibe en el body unicamente el id del juego que se quiere inicializar
router.post('games.start', '/start', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const data = ctx.request.body;
        if(!data.idGame) {
            ctx.body = "Faltan parámetros para poder unirse a la partida";
            ctx.status = 400;
            return;
        }
        const gameStarted = await gm.startGame(data.idGame, ctx.userID);
        ctx.body = gameStarted;
        ctx.status = 201;

    } catch (error) {
        console.log(error);
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
})

//Endpoint encargado de abandonar una sala no inicializada
//Recibe por parámetro unicamente el id de la sala que desea abandonar
router.post('games.leave', '/leave', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const data = ctx.request.body;
        if(!data.idGame) {
            ctx.body = "Faltan parámetros para poder abandonar una sala";
            ctx.status = 400;
            return;
        }
        const gameLeft = await gm.leaveGame(data.idGame, ctx.userID);
        ctx.body = gameLeft;
        ctx.status = 201;
    } catch (error) {
        console.log(error);
        ctx.body = {error: error.message };
        ctx.status = 400;
    }
})

//Endpoint encargado de generar una accion
//Recibe en el body el id del game y la accion
router.post('games.action', '/action', authUtils.isUser, async (ctx) => {
    const gm = new GameManager(ctx.orm);
    try {
        const data = ctx.request.body;
        if(!data.idGame || !data.action) {
            ctx.body = "Faltan parámetros para poder realizar una acción";
            ctx.status = 400;
            return;
        }
        const game = await gm.find.findGame(data.idGame, GameManager);
        let players = game.players;
        players.forEach(player => {
            if(player.idUser == ctx.userID) {
                game.procesarAccion(player.id, data.action);
            }
        })
        await gm.saveChanges(data.idGame);
        ctx.body = game;
        ctx.status = 201;

    } catch (error) {
        console.log(error);
        ctx.body = { error: error.message };
        ctx.status = 400;
    }
})

module.exports = router;