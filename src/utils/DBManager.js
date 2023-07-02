const C = require('../constants/GameConstants');

class DBManager {
    constructor(orm) {
        this.orm = orm;
    }

    async deleteData(model, conditions) {
        try {
            const deletedCount = await this.orm[model].destroy({
                where: conditions
            });
            return deletedCount;
        } catch (error) {
            return { deletedCount: 0, error };
        }
    }

    async findOneData(model, conditions) {
        try {
            let modelBBDD = await this.orm[model].findOne({
                where: conditions
            });
            return modelBBDD;
        } catch (error) {
            return { modelBBDD: null, error };
        }
    }
    async findAllData(model, conditions) {
        try {
            let modelBBDD = await this.orm[model].findAll({
                where: conditions
            });
            return modelBBDD;
        } catch (error) {
            return { modelBBDD: null, error };
        }
    }

    async generateSquares() {
        try {
            let squaresBBDD = await this.orm.MoldSquare.findAll();
            return squaresBBDD;
        } catch (error) {
            return { squaresBBDD: null, error };
        }

    }

    async createUser(username, mail, password, role) {
        try {
            let userBBDD = await this.orm.User.create({
                username, mail, password, role
            });
            return userBBDD;
        } catch (error) {
            return { userBBDD: null, error };
        }

    }

    async createGame(createdBy) {
        try {
            let gameBBDD = await this.orm.Game.create({
                'turno': C.TURNO_INICIAL,
                'gameFinalizado': false,
                'gameComenzado': false,
                'creadoPor': createdBy,
            });
            return gameBBDD;
        } catch (error) {
            return { gameBBDD: null, status: error };
        }

    }

    async createPlayer(nombre, idGame, userID) {
        try {
            let playerBBDD = await this.orm.Player.create({
                'nombre': nombre,
                'dinero': C.DINERO_INICIAL,
                'bancarrota': false,
                'squareActual': C.SQUARE_INICIAL,
                'numTurno': -1,
                'isMovBoard': false,
                'seccionActual': C.SECCIONES.MENU_PRINCIPAL,
                'idGame': idGame,
                'idUser': userID,
            });
            return playerBBDD;
        } catch (error) {
            return { playerBBDD: null, error };
        }

    }
    async createBoard(idGame) {
        try {
            let boardBBDD = await this.orm.Board.create({
                'idGame': idGame,
            });
            return boardBBDD;
        } catch (error) {
            return { boardBBDD: null, error };
        }

    }
    async createProperty(paramsReceived) {
        try {
            const params = {
                nombre: C.NOMBRE_DEFAULT,
                precio: C.PRECIO_DEFAULT,
                baseAlquiler: C.BASE_ALQUILER_DEFAULT,
                nivelEstructura: C.NIVEL_ESTRUCTURA_DEFAULT,
                color: C.COLOR_DEFAULT,
                hipotecado: false,
                posicionBoard: -1,
                idPlayer: null,
                idBoard: null,
                ...paramsReceived
            }
            delete params.id;
            let propertyBBDD = await this.orm.Property.create(params);
            return propertyBBDD;
        } catch (error) {
            return { propertyBBDD: null, error };
        }

    }
    async createRailroad(paramsReceived) {
        try {
            const params = {
                nombre: C.NOMBRE_DEFAULT,
                precio: C.PRECIO_DEFAULT,
                baseAlquiler: C.BASE_ALQUILER_DEFAULT,
                hipotecado: false,
                posicionBoard: -1,
                idPlayer: null,
                idBoard: null,
                ...paramsReceived
            }
            delete params.id;
            let railroadBBDD = await this.orm.RailRoad.create(params);
            return railroadBBDD;
        } catch (error) {
            return { railroadBBDD: null, error };
        }

    }
    async createUtility(paramsReceived) {
        try {
            const params = {
                nombre: C.NOMBRE_DEFAULT,
                precio: C.PRECIO_DEFAULT,
                baseAlquiler: C.BASE_ALQUILER_DEFAULT,
                hipotecado: false,
                posicionBoard: -1,
                idPlayer: null,
                idBoard: null,
                ...paramsReceived
            }
            delete params.id;
            let utilityBBDD = await this.orm.Utility.create(params);
            return utilityBBDD;
        } catch (error) {
            return { utilityBBDD: null, error };
        }
    }
    async createEmpty(paramsReceived) {
        try {
            const params = {
                nombre: C.NOMBRE_DEFAULT,
                posicionBoard: -1,
                idBoard: null,
                ...paramsReceived
            }
            delete params.id;
            let emptyBBDD = await this.orm.Empty.create(params);
            return emptyBBDD;
        } catch (error) {
            return { emptyBBDD: null, error };
        }

    }

    async updateModelById(modelName, id, updatedData) {
        try {
            const model = await this.orm[modelName].findByPk(id);
            Object.assign(model, updatedData);
            await model.save();
            return model;
        } catch (error) {
            return { model: null, error };
        }

    }
}

module.exports = DBManager;