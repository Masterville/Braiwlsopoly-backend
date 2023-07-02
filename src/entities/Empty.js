const Square = require("./Square");
const C = require('../constants/GameConstants');

class Empty extends Square{
  constructor(config) {
    super(config);
    this.id = this.id + "E";
  }
  realizarAccion() {
    //No hace nada.
  }

  updateState() {
    //Obtiene el estado de Empty
    return {
      nombre: this.nombre,
      posicionBoard: this.posicionBoard,
    };
  }  
}

module.exports = Empty;