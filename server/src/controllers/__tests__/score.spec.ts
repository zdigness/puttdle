import { User } from "../../models/user"
import { Score } from "../../models/score"

import db from "../../db"

export default class ScoreController {
  static async getScore(email: User["email"], day: Score["day"]): Promise<Score | null> {
    try {
      const retrievedUser: User | null = await db.User.findOne({
        where: { email },
      })

      if (!retrievedUser) {
        throw Error("User does not exist")
      }

      const retrievedScore: Score | null = await db.Score.findOne({
        where: { userId: retrievedUser.id, day },
      })

      if (!retrievedScore) {
        throw Error("Score does not exist")
      }

      return retrievedScore
    } catch (e) {
      console.error(e)
      return null
    }
  }

  static async updateScore(email: User["email"], day: Score["day"], score: Score["score"]): Promise<Score | null> {
    try {
      const retrievedUser: User | null = await db.User.findOne({
        where: { email },
      })

      if (!retrievedUser) {
        throw Error("User does not exist")
      }

      const [updatedScore]: [number, Score[]] = await db.Score.update(
        { score },
        {
          where: { userId: retrievedUser.id, day },
          returning: true,
        }
      )

      if (updatedScore === 0) {
        throw Error("Score does not exist")
      }

      return updatedScore
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
