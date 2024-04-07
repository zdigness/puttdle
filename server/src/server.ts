import dotenv from "dotenv"
import fs from "fs"
dotenv.config(dotenv.parse(fs.readFileSync(".env")))

import express, { Application } from "express"
import cors from "cors"
import appRouter from "./routes/index"
import "./db"

const app: Application = express()
const port = 3000
// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// CORS
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use("/api/v1", appRouter)

// Attempt to sync the database and start the server
try {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
} catch (error) {
  console.log(`Error occurred: ${error}`)
}
