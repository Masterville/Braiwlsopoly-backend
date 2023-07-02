const koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const router = require('./routes');
const orm = require('./models');
const cors2 = require('koa-cors2');

const app = new koa();

app.context.orm = orm;

// Configuración de Sequelize para desactivar los logs de consultas
orm.sequelize.options.logging = false;

app.use(cors2());
app.use(KoaLogger());
app.use(koaBody());

app.use(router.routes());

app.use((ctx, next) => {
    ctx.body = "Hola mundo! Saludos desde IIC2513";
})

module.exports = app;

// const Board = require('./entities/Board');
// const Game = require('./entities/Game');
// const Player = require('./entities/Player');

// const board = new Board({
    
// });
// const player = new Player({
//     nombre: 'Juan'
// });
// const game = new Game({
//     players: [player],
// });

// game.inicializarGame();
