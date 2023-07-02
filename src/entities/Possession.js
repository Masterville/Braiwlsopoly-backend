const C = require('../constants/GameConstants');
const Square = require('./Square');

class Possession extends Square {
  constructor(config) {
    super(config);
    this.precio = config.precio ?? C.PRECIO_DEFAULT;
    this.hipotecado = config.hipotecado ?? false;
    this.idPlayer = config.idPlayer ?? null;
  }
  calcularAlquiler(squares) {
    //Los hijos implementan la accion a su manera
  }

  realizarAccion(player, players, squares, valorDado) {
    console.log("\n Has caido en la casilla: " + this.nombre + " en la posicion " + this.posicionBoard + "\n");

    let propietario = this.revisarPropietario(players, squares);
    console.log(propietario);

    if (propietario && propietario.id === player.id) {
      //Caso 1: Si la propiedad tiene propietario y es del jugador de turno
      console.log("\nEl jugador " + player.nombre + " ha caido en su propiedad\n");
    }
    else if (propietario && propietario.id !== player.id) {
      //Caso 2: Si la propiedad tiene propietario y es de otro jugador
      console.log("El jugador " + player.nombre + " ha caido en la propiedad de " + propietario.nombre);

      if (!this.hipotecado) {
        let monto = this.calcularAlquiler(squares, valorDado);
        player.pagarRenta(propietario, squares, monto);
      }
      else {
        console.log("La propiedad se encuentra hipotecada");
      }
    }
    else if (!propietario) {
      //Caso 3: Si la propiedad no tiene propietario, se puede comprar
      console.log("El jugador " + player.nombre + " ha caido en una propiedad del banco");
      player.seccionActual = C.SECCIONES.MENU_COMPRAR_APROPIABLE;
    }
  }

  revisarPropietario(players, squares) {
    //Revisamos si la possession tiene un propietario
    let prop = null;

    for (let i = 0; i < players.length; i++) {
      let pos = players[i].obtenerPossessions(squares);
      for (let j = 0; j < pos.length; j++) {
        if (pos[j].id === this.id) {
          prop = players[i];
        }

      }
    }
    return prop
  }

  calcularHipoteca() {
    return this.precio * C.FACTOR_HIPOTECA;
  }
  calcularDeshipoteca() {
    return this.precio * C.FACTOR_DESHIPOTECA;
  }

  hipotecar(player) {
    if(!this.hipotecado && this.idPlayer == player.id) {
      let valorHipoteca = this.calcularHipoteca();
      player.dinero += valorHipoteca;
      this.hipotecado = true;
      return true;
    }
    return false;
  }

  deshipotecar(player) {
    if(this.hipotecado && player.dinero > this.calcularDeshipoteca() && this.idPlayer == player.id) {
      let valorDeshipoteca = this.calcularDeshipoteca();
      player.dinero -= valorDeshipoteca;
      this.hipotecado = false;
      console.log("\nSe ha deshipotecado " + this.nombre + " con un costo de $" + valorDeshipoteca + "\n");
      return true;
    }
    return false;
  }

  updateState() {
    //Obtiene el estado de Property
    return {
      nombre: this.nombre,
      precio: this.precio,
      hipotecado: this.hipotecado,
      idPlayer: this.idPlayer
    };
  }
}

module.exports = Possession;