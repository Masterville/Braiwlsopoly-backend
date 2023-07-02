const C = require('../constants/GameConstants');
const PossessionFilter = require('../utils/PossessionFilter');

class Game {
  constructor(config) {
    this.players = config.players ?? [];
    this.board = config.board ?? null;
    this.turno = config.turno ?? C.TURNO_INICIAL;
    this.gameFinalizado = config.gameFinalizado ?? false;
    this.gameComenzado = config.gameComenzado ?? false;
    this.creadoPor = config.creadoPor ?? "desconocido";
    this.id = config.id ?? -1;
    this.statusPropiedades = null;
    this.status = "";
  }


  isPlaying(idUser) {
    if (this.gameComenzado && !this.gameFinalizado) {
      const encontrado = this.players.some(function(player) {
        return player.idUser === idUser;
      });
      if (encontrado) {
        return true;
      }
    }
    return false;
  }

  leaveGame(idPlayer) {
    if (!this.gameComenzado && !this.gameFinalizado) {
      const playerIndex = this.players.findIndex(player => player.id === idPlayer);
      if (playerIndex !== -1) {
        this.players.splice(playerIndex, 1);
        return true;
      }
    }
    console.log("")
    return false;
  }

  joinGame(player) {
    let playerEnPartida = false;
    this.players.forEach(p => {
      if (p.idUser == player.idUser) {
        //El jugador ya se encuentra en la partida
        playerEnPartida = true;
      }
    });
    let cupoDisponible = this.players.length < C.MAX_PLAYER_PER_GAME;
    if (!this.gameComenzado && !playerEnPartida && cupoDisponible && !this.gameFinalizado) {
      this.players.push(player);
      this.status = "Se ha unido el jugador: " + player.nombre;
      console.log("Se ha unido el jugador: " + player.nombre);
      return true;
    }
    this.status = player.nombre + " no cumple los requisitos para unirse a la partida";
    console.log(player.nombre + " no cumple los requisitos para unirse a la partida");
    return false;
  }

  inicializarGame() {
    this.definirTurnos();
    this.gameComenzado = true;
    this.status = "Se ha inicializado el juego";
  }

  procesarAccion(idPlayerSolicitando, accion) {
    this.cleanStatus();
    this.recargarTurnos();
    this.board.recargarBoard();
    let playerTurno = this.players[this.turno];

    if (this.gameComenzado && playerTurno.id === idPlayerSolicitando && !this.gameFinalizado) {
      switch (playerTurno.seccionActual) {
        case C.SECCIONES.MENU_PRINCIPAL:
          if (accion == C.MPOPTIONS.MOVER_MAPA && !playerTurno.isMovBoard) {
            this.status = playerTurno.nombre + " ha decidido lanzar los dados";
            console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido lanzar los dados\n");
            this.board?.moverPlayer(playerTurno, this.players);
            playerTurno.isMovBoard = true;
          } else if (accion == C.MPOPTIONS.CONSTRUIR_CASA) {
            let opciones = playerTurno.obtenerPossessions(this.board.squares, PossessionFilter.construibles);
            if (opciones.length != 0) {
              //Si el len es distinto de cero, quiere decir que existen elementos que cumplen la condicion
              this.status = playerTurno.nombre + " ha decidido construir una casa";
              console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido construir una casa\n");
              playerTurno.seccionActual = C.SECCIONES.MENU_ACCION_CONSTRUIR_CASA;
              this.statusPropiedades = opciones;
            }
          } else if (accion == C.MPOPTIONS.HIPOTECAR_CASA) {
            let opciones = playerTurno.obtenerPossessions(this.board.squares, PossessionFilter.conEstructurasHipotecables);
            if (opciones.length != 0) {
              this.status = playerTurno.nombre + " ha decidido hipotecar una casa";
              console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido hipotecar una casa\n");
              playerTurno.seccionActual = C.SECCIONES.MENU_ACCION_HIPOTECAR_CASA;
              this.statusPropiedades = opciones;
            }
          } else if (accion == C.MPOPTIONS.HIPOTECAR_POSESION) {
            let opciones = playerTurno.obtenerPossessions(this.board.squares, PossessionFilter.hipotecables);
            if (opciones.length != 0) {
              this.status = playerTurno.nombre + " ha decidido hipotecar una posesion";
              console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido hipotecar una posesion\n");
              playerTurno.seccionActual = C.SECCIONES.MENU_ACCION_HIPOTECAR_POSESION;
              this.statusPropiedades = opciones;
            }
          } else if (accion == C.MPOPTIONS.DESHIPOTECAR_POSESION) {
            let opciones = playerTurno.obtenerPossessions(this.board.squares, PossessionFilter.hipotecados);
            if (opciones.length != 0) {
              this.status = playerTurno.nombre + " ha decidido deshipotecar una posesion";
              console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido deshipotecar una posesion\n");
              playerTurno.seccionActual = C.SECCIONES.MENU_ACCION_DESHIPOTECAR_POSESION;
              this.statusPropiedades = opciones;
            }
          } else if (accion == C.MPOPTIONS.TERMINAR_TURNO && playerTurno.isMovBoard) {
            this.status = playerTurno.nombre + " ha decidido terminar su turno";
            console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido terminar su turno\n");
            this.turno += 1;
            playerTurno.isMovBoard = false;
            this.recargarTurnos();
          }
          break;
        case C.SECCIONES.MENU_COMPRAR_APROPIABLE:
          if (accion == C.MCOPTIONS.COMPRAR) {
            console.log("\nComprar propiedad\n");
            let possessionComprar = this.board.squares[playerTurno.squareActual];
            playerTurno.comprarPossession(possessionComprar);
            playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
            this.statusPropiedades = null;
          } else if (accion == C.MCOPTIONS.NOCOMPRAR) {
            this.status = playerTurno.nombre + " ha decidido no comprar la posesion";
            console.log("\nEl jugador: " + playerTurno.nombre + " ha decidido no comprar la posesion\n");
            playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
            this.statusPropiedades = null;
          }
          break;
        case C.SECCIONES.MENU_ACCION_CONSTRUIR_CASA:
          console.log("\nEl jugador ha decidido construir una casa\n");
          playerTurno.construirEstructuraPorID(accion, this.board.squares);
          playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
          this.statusPropiedades = null;
          break;
        case C.SECCIONES.MENU_ACCION_HIPOTECAR_CASA:
          console.log("\nEl jugador ha decidido hipotecar una casa\n");
          playerTurno.hipotecarEstructuraPorID(accion, this.board.squares);
          playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
          this.statusPropiedades = null;
          break;
        case C.SECCIONES.MENU_ACCION_HIPOTECAR_POSESION:
          console.log("\nEl jugador ha decidido hipotecar una posesion\n");
          playerTurno.hipotecarPosesionPorID(accion, this.board.squares);
          playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
          this.statusPropiedades = null;
          break;
        case C.SECCIONES.MENU_ACCION_DESHIPOTECAR_POSESION:
          console.log("\nEl jugador ha decidido deshipotecar una posesion\n");
          playerTurno.deshipotecarPosesionPorID(accion, this.board.squares);
          playerTurno.seccionActual = C.SECCIONES.MENU_PRINCIPAL;
          this.statusPropiedades = null;
          break;
      }

    }
  }

  cleanStatus() {
    this.status = "";
    for (let i = 0; i < this.players.length; i++) {
      //Limpiamos todos los status de los jugadores
      this.players[i].status = "";
    }
  }


  recargarTurnos() {
    let alivePlayers = [];
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].bancarrota) {
        alivePlayers.push(this.players[i]);
      }
    }

    if (alivePlayers.length <= 1) {
      //Quiere decir que hay un ganador
      this.gameFinalizado = true;
    }

    this.players = alivePlayers;
    this.players.sort((a, b) => {
      return a.numTurno - b.numTurno;
    })
    while (this.turno >= this.players.length) {
      this.turno -= this.players.length;
    }
  }

  definirTurnos() {
    const listaNum = [];
    for (let i = 0; i < this.players.length; i++) {
      let num = this.players[i].lanzarDado();
      listaNum.push({ player: this.players[i], num: num })
    }
    listaNum.sort((a, b) => {
      return b.num - a.num;
    });
    let ordenados = [];
    for (let i = 0; i < listaNum.length; i++) {
      listaNum[i].player.numTurno = i;
      ordenados.push(listaNum[i].player);
    }
    this.players = ordenados;
    this.recargarTurnos();
  }
  updateState() {
    //Obtiene el estado del game
    return {
      turno: this.turno,
      gameFinalizado: this.gameFinalizado,
      gameComenzado: this.gameComenzado,
    };
  }
}
module.exports = Game;