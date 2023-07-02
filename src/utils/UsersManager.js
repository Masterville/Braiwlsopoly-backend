const DBManager = require('./DBManager');
const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
const crypto = require('bcrypt');

class UsersManager {

  constructor(orm) {
    this.dbm = new DBManager(orm);
  }

  async signupUser(username, mail, password) {
    let body = {
      username, mail
    };
    let status = 201;
    const userBBDD = await this.dbm.findOneData('User', { mail: mail });

    if (userBBDD) {
      body = `El usuario con el correo '${mail}' ya existe`;
      status = 400;
    } else {
      //Se crea un usuario
      const saltRounds = 10;
      const hashPassword = await crypto.hash(password, saltRounds);
      const role = "user";
      const userBBDD = await this.dbm.createUser(username, mail, hashPassword, role);
      if (userBBDD.error) {
        body = userBBDD.error;
        status = 400;
      }
    }
    //Se hace login del usuario
    const data = await this.loginUser(mail,password)
    return { body: data.body, status: data.status }
  }

  async loginUser(mail, password) {
    let status = 201;
    let body = "";
    const userBBDD = await this.dbm.findOneData('User', { mail: mail });

    if (!userBBDD) {
      body = `El usuario con el correo '${mail}' no ha sido encontrado`;
      status = 400;
    } else if (await crypto.compare(password, userBBDD.password)) {
      //Se crea el JWT
      const tokenData = await UsersManager.createNewToken(userBBDD.id, userBBDD.role, 1);
      body = {
        username: userBBDD.username,
        mail: userBBDD.mail,
        ...tokenData
      }
    } else {
      body = "Incorrect password",
        status = 400;
    }
    return { body, status }
  }

  static async createNewToken(userID, role, expirationDays) {
    const expirationSeconds = expirationDays * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    var token = jwt.sign(
      { scope: [role] },
      JWT_PRIVATE_KEY,
      { subject: userID.toString() },
      { expiresIn: expirationSeconds }
    );
    return {
      "access_token": token,
      "token_type": "Bearer",
      "expires_in": expirationSeconds
    };
  }

  async findUsers() {
    const usersBBDD = await this.dbm.findAllData('User');
    if (usersBBDD.error) return null;

    return usersBBDD;
  }
  async findUser(idUser) {
    const userBBDD = await this.dbm.findOneData('User',{id: idUser });
    if (userBBDD.error) return null;

    return userBBDD;
  }
}

module.exports = UsersManager;