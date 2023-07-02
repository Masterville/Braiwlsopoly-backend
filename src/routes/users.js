const Router = require('koa-router');
const UsersManager = require('../utils/UsersManager');
const GameManager = require('../utils/GameManager');
const authUtils = require('../utils/auth/jwt.js');
const Game = require('../entities/Game');
const router = new Router();

//Endpoint encargado de obtener todos los usuarios
router.get('users.all', '/all', authUtils.isAdmin, async (ctx) => {
  const um = new UsersManager(ctx.orm);
  try {
    const usersFound = await um.findUsers();
    ctx.body = usersFound;
    ctx.status = 201;

  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }
})

//Endpoint encargado de obtener todos los players que pertenecen al token de la sesion
router.get('user.player', '/player/:idGame', authUtils.isUser, async (ctx) => {
  const gm = new GameManager(ctx.orm);
  try {
    const data = ctx.params;
    console.log(data.idGame);
    if (!data.idGame) {
      ctx.body = "Faltan parámetros para poder unirse a la partida";
      ctx.status = 400;
      return;
    }
    const gameFound = await gm.find.findGame(parseInt(data.idGame), GameManager);
    if(gameFound.error) {
      ctx.body = "Juego no encontrado";
      ctx.status = 404;
      return;
    }

    const players = gameFound.players;
    let player = null;
    players.forEach(p => {
      if(p.idUser == ctx.userID) {
        player = p;
      }
    });

    if(player) {
      //En este caso, ha encontrado al jugador
      ctx.body = player;
      ctx.status = 201;
    } else {
      ctx.body = "El jugador no ha sido encontrado";
      ctx.status = 400;
      return;
    }
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }
})

//Endpoint encargado de obtener todos los juegos que pertenecen al token de la sesion
//TERMINAR LUEGO ...
router.get('user.games', '/games', authUtils.isUser, async (ctx) => {
  const gm = new GameManager(ctx.orm);
  try {
    const games = await gm.find.findGamesFinished(GameManager, false);
    const gamesEncontrados = [];
    games.forEach(game => {
      if(game.isPlaying(ctx.userID)) {
        //En ese caso, el jugador esta jugando en ese juego
        gamesEncontrados.push(game);
      }
    })
    if(gamesEncontrados.error) {
      ctx.body = "Juego no encontrado";
      ctx.status = 404;
      return;
    }
    if(gamesEncontrados) {
      //En este caso, ha encontrado el juego
      ctx.body = gamesEncontrados;
      ctx.status = 201;
    } else {
      ctx.body = "El jugador no tiene juegos asociados";
      ctx.status = 400;
      return;
    }
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }
})

module.exports = router;