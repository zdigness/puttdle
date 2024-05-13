import { Router } from "express"
import { FullStats } from "../types"
import ScoreController from "../controllers/score"

const scoreRouter = Router()

scoreRouter.post("/", async (req, res) => {
  const score: number = req.body
  try {
    const newScore: number | null = await ScoreController.createScore(score)
    res.status(200).send(newScore)
  } catch (e) {
    console.error(e)
    res.send("Error creating score")
  }
})

scoreRouter.get("/", async (req, res) => {
  try {
    const score: number | null = await ScoreController.getScore()
    const streak: number | null = await ScoreController.getStreak()
    const stats: FullStats = { score: score ?? 0, streak: streak ?? 0 }
    res.status(200).send(stats)
  } catch (e) {
    console.error(e)
    res.send("Error getting scores")
  }
})

export default scoreRouter
