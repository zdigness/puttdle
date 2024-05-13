import { Score } from "../models/score"
import { User } from "../models/user"
import db from "../db"

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

  static async getStreak(email: User["email"]): Promise<number | null> {
    
  }
}
