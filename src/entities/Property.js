const C = require('../constants/GameConstants');
const Possession = require('./Possession');

class Property extends Possession {
  constructor(config) {
    super(config);
    this.baseAlquiler = config.baseAlquiler ?? C.BASE_ALQUILER_DEFAULT;
    this.nivelEstructura = config.nivelEstructura ?? C.NIVEL_ESTRUCTURA_DEFAULT;
    this.color = config.color ?? C.COLOR_DEFAULT;
    this.id = this.id + "P";
  }

  verificarColores(squares) {
    let countAllInstances = 0;
    let countPlayerInstances = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] instanceof Property && squares[i].color === this.color) {
        countAllInstances++;
        if (this.idPlayer === squares[i].idPlayer) {
          countPlayerInstances++;
        }
      }
    }
    return countAllInstances == countPlayerInstances
  }

  hipotecarEstructura(player) {
    if (this.nivelEstructura > 0 && this.idPlayer == player.id) {
      let montoHipoteca = this.calcularHipotecaEstructura();
      this.nivelEstructura -= 1;
      player.dinero += montoHipoteca;
      return true;
    }
    return false;
  }

  precioEstructura() {
    return this.precio <= C.PRECIOS_CONSTRUIR.B1.MENORA ? C.PRECIOS_CONSTRUIR.B1.PRECIO :
      this.precio <= C.PRECIOS_CONSTRUIR.B2.MENORA ? C.PRECIOS_CONSTRUIR.B2.PRECIO :
        this.precio <= C.PRECIOS_CONSTRUIR.B3.MENORA ? C.PRECIOS_CONSTRUIR.B3.PRECIO :
          this.precio <= C.PRECIOS_CONSTRUIR.B4.MENORA ? C.PRECIOS_CONSTRUIR.B4.PRECIO :
            C.PRECIOS_CONSTRUIR.DEFAULT.PRECIO;
  }

  construirEstructura(player) {
    if (player.dinero >= this.precioEstructura() && this.idPlayer == player.id &&
      this.nivelEstructura <= C.NIVEL_MAX_ESTRUCTURA) {
      player.dinero -= this.precioEstructura();
      this.nivelEstructura += 1;
      console.log("El jugador " + player.nombre + " ha subido al nivel " + this.nivelEstructura + " la propiedad " + this.nombre + ", saldo: $" + player.dinero);
      return true;
    }
    return false;
  }

  calcularAlquiler(squares, valorDado) {
    let allColors = this.verificarColores(squares)
    let alquiler = this.baseAlquiler;
    if (allColors && this.nivelEstructura == 0) return Math.floor(alquiler * 2);
    if (this.nivelEstructura >= 1) alquiler *= (4 + 1 / this.baseAlquiler);
    if (this.nivelEstructura >= 2) alquiler *= (3 + 1 / this.baseAlquiler);
    if (this.nivelEstructura >= 3) alquiler *= (2.5 + 1 / this.baseAlquiler);
    if (this.nivelEstructura >= 4) alquiler *= (1.4 + 1 / this.baseAlquiler);
    if (this.nivelEstructura >= 5) alquiler *= (1.2 + 1 / this.baseAlquiler);


    return Math.floor(alquiler);
  }

  calcularHipotecaEstructura() {
    return this.precioEstructura() * C.FACTOR_HIPOTECA;
  }

  updateState() {
    //Obtiene el estado de Property
    return {
      nombre: this.nombre,
      precio: this.precio,
      baseAlquiler: this.baseAlquiler,
      nivelEstructura: this.nivelEstructura,
      color: this.color,
      hipotecado: this.hipotecado,
      idPlayer: this.idPlayer
    };
  }
}

module.exports = Property;