import { Router } from "express"
import { FullMap } from "../types"
import MapController from "../controllers/map"

const mapRouter = Router()

mapRouter.get("/", async (req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const mapExists: FullMap | null = await MapController.getMap(today)

    if (mapExists) {
      res.status(200).send(mapExists)
    } else {
      res.status(404).send("Map not found")
    }
  } catch (e) {
    console.error(e)
    res.send("Error checking map")
  }
})

export default mapRouter
