import { Router } from "express"
import MapController from "../controllers/map"
import { FullMap } from "../types"

const mapRouter = Router()

mapRouter.get("/", async (req, res) => {
  try {
    const today = new Date()
    console.log(today)
    const mapExists: FullMap | null = await MapController.getMap(today)

    if (mapExists) {
      const fullMap: FullMap | null = await MapController.getMap(today)
      console.log(fullMap?.map.day)
      console.log(fullMap?.map.par)
      console.log(fullMap?.map.hole_x)
      console.log(fullMap?.map.hole_y)
      console.log(fullMap?.map.ball_x)
      console.log(fullMap?.map.ball_y)
      console.log(fullMap?.sandtraps)
      console.log(fullMap?.water)
      console.log(fullMap?.barriers)
      res.status(200).send(fullMap)
    }
  } catch (e) {
    console.error(e)
    res.send("Error checking map")
  }
})

export default mapRouter