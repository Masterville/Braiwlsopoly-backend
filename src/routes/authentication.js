const Router = require('koa-router');
const UsersManager = require('../utils/UsersManager');

const router = new Router();

//Endpoint encargado de registrarse como usuario
//Recibe en el body el username, el mail y la password
router.post('authentication.signup', "/signup", async (ctx) => {
  const um = new UsersManager(ctx.orm);
  try {
    const authInfo = ctx.request.body;
    // Verificar que los parametros necesarios estén presentes
    if (!authInfo.username || !authInfo.mail || !authInfo.password) {
      ctx.body = "Faltan parámetros para poder crear el usuario";
      ctx.status = 400;
      return;
    }
    const answer = await um.signupUser(authInfo.username, authInfo.mail, authInfo.password);
    ctx.body = answer.body;
    ctx.status = answer.status;
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }

});

//Endpoint encargado de hacer login como usuario
//Recibe en el body el mail y la password
router.post('authentication.login', "/login", async (ctx) => {

  const um = new UsersManager(ctx.orm);
  try {
    const authInfo = ctx.request.body;
    // Verificar que los parametros necesarios estén presentes
    if (!authInfo.mail || !authInfo.password) {
      ctx.body = "Faltan parámetros para poder crear el usuario";
      ctx.status = 400;
      return;
    }
    const answer = await um.loginUser(authInfo.mail, authInfo.password);
    ctx.body = answer.body;
    ctx.status = answer.status;
  } catch (error) {
    console.log(error);
    ctx.body = error;
    ctx.status = 400;
  }

});

module.exports = router;