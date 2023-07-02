const Router = require('koa-router');
const games = require('./routes/games');
const authRoutes = require('./routes/authentication.js');
const users = require('./routes/users.js');
const dotenv = require('dotenv');
const jwtMiddleware = require('koa-jwt'); 

dotenv.config();

const router = new Router();

router.use(authRoutes.routes());
router.use(jwtMiddleware ({ secret: process.env.JWT_SECRET }))
router.use('/games', games.routes());
router.use('/users', users.routes());

module.exports = router;