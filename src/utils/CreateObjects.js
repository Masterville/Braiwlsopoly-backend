const DBManager = require('./DBManager');
const Board = require('../entities/Board');
const Game = require('../entities/Game');
const Player = require('../entities/Player');
const Property = require('../entities/Property');
const Railroad = require('../entities/Railroad');
const Utility = require('../entities/Utility');
const Empty = require('../entities/Empty');
const C = require('../constants/GameConstants');

class CreateObjects {
  constructor(orm) {
    this.dbm = new DBManager(orm);
  }

  async newPlayer(idGame, nombrePlayer, userID) {
    //Se crea un nuevo jugador para ese juego
    let playerBBDD = await this.dbm.createPlayer(nombrePlayer, idGame, userID);
    if (playerBBDD.error) return null;
    let player = new Player({ ...playerBBDD.dataValues });
    return player;
  }

  async newSquares(idBoard) {
    //--- GENERACION DE SQUARES
    let squaresBBDD = await this.dbm.generateSquares();
    if (squaresBBDD.error) return null;
    let squares = await Promise.all(squaresBBDD.map(async square => {
      if (square.tipo === C.TIPOS_SQUARE.PROPERTY) {
        const propertyBBDD = await this.dbm.createProperty({ ...square.dataValues, idBoard });
        if (propertyBBDD.error) return null;
        return new Property({ ...propertyBBDD.dataValues });
      } else if (square.tipo === C.TIPOS_SQUARE.RAILROAD) {
        const railroadBBDD = await this.dbm.createRailroad({ ...square.dataValues, idBoard });
        if (railroadBBDD.error) return null;
        return new Railroad({ ...railroadBBDD.dataValues });
      } else if (square.tipo === C.TIPOS_SQUARE.UTILITY) {
        const utilityBBDD = await this.dbm.createUtility({ ...square.dataValues, idBoard });
        if (utilityBBDD.error) return null;
        return new Utility({ ...utilityBBDD.dataValues });
      } else if (square.tipo === C.TIPOS_SQUARE.EMPTY) {
        const emptyBBDD = await this.dbm.createEmpty({ ...square.dataValues, idBoard });
        if (emptyBBDD.error) return null;
        return new Empty({ ...emptyBBDD.dataValues });
      }
    }));
    return squares;
  }

  async newBoard(idGame) {
    let boardBBDD = await this.dbm.createBoard(idGame);
    if (boardBBDD.error) return null;
    let board = new Board({ ...boardBBDD.dataValues });
    return board;
  }

  async newGame(GameManager, createdBy) {
    let gameBBDD = await this.dbm.createGame(createdBy);
    if (gameBBDD.error) return null;
    let board = await this.newBoard(gameBBDD.id);
    let squares = await this.newSquares(board.id);
    board.asignarSquares(squares);

    let game = new Game({ ...gameBBDD.dataValues, board });
    GameManager.addGame(game);
    return game;
  }
}

module.exports = CreateObjects;