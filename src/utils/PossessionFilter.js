const Property = require('../entities/Property');
const C = require('../constants/GameConstants');

class PossessionFilter {

  static hipotecados(pos, possessions) {
    return pos.hipotecado ? true : false;
  }
  static noHipotecados(pos, possessions) {
    return pos.hipotecado ? false : true;
  }
  static conEstructuras(pos, possessions) {
    return pos.nivelEstructura > 0 ? true : false;
  }
  static conEstructurasHipotecables(pos, possessions) {
    let allowMortgage = true;
    for (let i = 0; i < possessions.length; i++) {
      if (possessions[i] instanceof Property && possessions[i].color === pos.color && possessions[i].id != pos.id) {
        if(pos.nivelEstructura < possessions[i].nivelEstructura) {
          allowMortgage = false;
        }
      }
    }
    return pos instanceof Property && pos.nivelEstructura > 0 && allowMortgage ? true : false;
  }
  static hipotecables(pos, possessions) {
    let allowMortgage = true;
    for (let i = 0; i < possessions.length; i++) {
      if(possessions[i] instanceof Property && possessions[i].color === pos.color && possessions[i].id != pos.id) {
        if(possessions[i].nivelEstructura != 0) {
          allowMortgage = false;
        }
      }
    }
    if(pos instanceof Property && pos.nivelEstructura != 0) {
      allowMortgage = false;
    }
    return !pos.hipotecado && allowMortgage ? true : false;
  }
  static construibles(pos, possessions) {
    let allowBuild = true;
    for (let i = 0; i < possessions.length; i++) {
      if (possessions[i] instanceof Property && possessions[i].color === pos.color && possessions[i].id != pos.id) {
        if(pos.nivelEstructura > possessions[i].nivelEstructura) {
          allowBuild = false;
        }
      }
    }
    return pos instanceof Property && !pos.hipotecado && pos.nivelEstructura < C.NIVEL_MAX_ESTRUCTURA
      && pos.verificarColores(possessions) && allowBuild ? true : false;
  }
}

module.exports = PossessionFilter;