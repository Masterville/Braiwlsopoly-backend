class Board {
  constructor(config) {
    this.squares = config.squares ?? null;
    this.id = config.id ?? -1;
  }
  agregarSquare(square) {
    this.squares.push(square);
  }
  asignarSquares(squares) {
    this.squares = squares;
  }
  eliminarSquare(square) {
    let index = this.squares.indexOf(square);
    index !== -1 ? this.casillas.splice(index, 1) : "";
  }

  moverPlayer(player, players) {
    let valorMov = player.lanzarDado();
    console.log("El jugador " + player.nombre + " ha obtenido el valor: " + valorMov + " en el dado");
    player.moverEnBoard(valorMov, this.squares.length);
    this.squares[player.squareActual].realizarAccion(player, players, this.squares, valorMov)
  }

  recargarBoard() {
    this.squares.sort((a, b) => {
      return a.posicionBoard - b.posicionBoard;
    })
  }

  updateState() {
    //Obtiene el estado del game
    return {
      id: this.id,
    };
  }
}
module.exports = Board;