const Possession = require("./Possession");
const C = require('../constants/GameConstants');

class Utility extends Possession {
  constructor(config) {
    super(config);
    this.baseAlquiler = config.baseAlquiler ?? C.BASE_ALQUILER_DEFAULT;
    this.id = this.id + "U";
  }
  calcularAlquiler(squares, valorDado) {
    let alquilerPorNum = 0;
    let nUtilidades = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] instanceof Utility && this.idPlayer == squares[i].idPlayer && squares[i].hipotecado == false) {
        nUtilidades++;
      }
    }
    //Se calcula el alquiler por numero de dado en base a la cantidad de possesiones de utilidades.
    nUtilidades === 1 ? alquilerPorNum = this.baseAlquiler
    : nUtilidades >= 2 ? alquilerPorNum = this.baseAlquiler * (2.5**(nUtilidades-1)) : alquilerPorNum = 0;

    return alquilerPorNum * valorDado;
  }
  updateState() {
    //Obtiene el estado de Utility
    return {
      nombre: this.nombre,
      precio: this.precio,
      baseAlquiler: this.baseAlquiler,
      hipotecado: this.hipotecado,
      idPlayer: this.idPlayer
    };
  }
}
module.exports = Utility;