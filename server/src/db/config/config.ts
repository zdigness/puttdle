import { Dialect } from "sequelize"
interface Config {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
  use_env_variable?: string
}

interface DatabaseConfig {
  development: Config
  test: Config
  production: Config
}

const config: DatabaseConfig = {
  development: {
    username: "postgres",
    password: "postgrepassword",
    database: "puttdle_dev",
    host: "db",
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "postgrepassword",
    database: "puttdle_test",
    host: "db",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: "null",
    database: "puttdle_prod",
    host: "db",
    dialect: "postgres",
  },
}
export default config
