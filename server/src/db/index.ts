import { Sequelize } from "sequelize-typescript"
import logger from "./util/logger"
import configJson from "./config/config"

const env = process.env.NODE_ENV || "development"
const config = configJson[env as keyof typeof configJson]
import { User } from "../models/user"
import { Score } from "../models/score"
import { Map } from "../models/map"
import { Sandtrap } from "../models/sandtrap"
import { Water } from "../models/water"
import { Barrier } from "../models/barrier"

/**
 * Database class
 * @class
 * @classdesc Database class to connect to the database.
 * @constructor
 * @public
 * @property {Sequelize} sequelize - The sequelize instance
 * @method connectToDatabase - Connects to the database
 * TODO: Add env vars
 */

class Database {
  public sequelize = new Sequelize(config.database, config.username, config.password, {
    repositoryMode: true,
    host: config.host,
    dialect: config.dialect,
    port: 5432,
    pool: {
      max: 15,
      min: 1,
      acquire: 30000,
      idle: 10000,
    },
    logging: (msg) => logger.debug(msg),
    models: [User, Score, Map, Sandtrap, Water, Barrier],
  })

  public User = this.sequelize.getRepository(User)
  public Score = this.sequelize.getRepository(Score)
  public Map = this.sequelize.getRepository(Map)
  public Sandtrap = this.sequelize.getRepository(Sandtrap)
  public Water = this.sequelize.getRepository(Water)
  public Barrier = this.sequelize.getRepository(Barrier)

  constructor() {
    this.connectToDatabase()
  }

  private async connectToDatabase() {
    await this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.")
      })
      .catch((err) => {
        console.error("Unable to connect to the Database:", err)
      })

    await this.sequelize
      .sync()
      .then(() => {
        console.log("All models were synchronized successfully.")
      })
      .catch((err) => {
        console.error("Unable to sync models", err)
      })
  }
}

const index = new Database()

export default index
