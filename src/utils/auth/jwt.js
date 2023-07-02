var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function getJWTScope(token) {
  const secret = process.env.JWT_SECRET;
  var payload = jwt.verify(token, secret);
  return payload.scope;
}
function getUserID(token) {
  const secret = process.env.JWT_SECRET;
  var payload = jwt.verify(token, secret);
  return parseInt(payload.sub);
}

async function isUser(ctx, next) {
  var token = ctx.request.header.authorization.split(' ')[1];
  var scope = getJWTScope(token);
  ctx.assert(scope.includes('user') || scope.includes('admin'), 403, 'No eres el usuario');
  ctx.userID = getUserID(token);
  await next();
}
async function isAdmin(ctx, next) {
  var token = ctx.request.header.authorization.split(' ')[1];
  var scope = getJWTScope(token);
  ctx.assert(scope.includes('admin'), 403, 'No eres admin');
  console.log(getUserID(token));
  ctx.userID = getUserID(token);
  await next();
}


module.exports = {
  isUser, isAdmin
}