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

const configTemplate: Config = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "database",
  host: process.env.DB_HOST || "localhost",
  dialect: "postgres",
}

const config: DatabaseConfig = {
  development: configTemplate,
  test: configTemplate,
  production: configTemplate,
}
export default config
