const Possession = require("./Possession");
const C = require('../constants/GameConstants');

class Railroad extends Possession {
  constructor(config) {
    super(config);
    this.baseAlquiler = config.baseAlquiler ?? C.BASE_ALQUILER_DEFAULT;
    this.id = this.id + "R";
  }
  calcularAlquiler(squares, valorDado) {
    let multiplicador = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] instanceof Railroad && this.idPlayer == squares[i].idPlayer && squares[i].hipotecado == false) {
        multiplicador++;
      }
    }
    return this.baseAlquiler * (2 ** (multiplicador - 1));
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
module.exports = Railroad;