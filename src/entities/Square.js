class Square {
  constructor(config) {
    this.nombre = config.nombre ?? 'sin nombre';
    this.id = config.id ?? -1;
    this.idUpdate = config.id ?? -1;
    this.posicionBoard = config.posicionBoard ?? -1; 
  }
  realizarAccion() {
    //Los hijos implementan la accion a su manera
  }

  updateState() {
    //Obtiene el estado de Property
    return {
      nombre: this.nombre,
      posicionBoard: this.posicionBoard,
    };
  }  
}

module.exports = Square;