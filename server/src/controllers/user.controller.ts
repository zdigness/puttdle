import { User } from "../models/user.model"
import { Score } from "../models/score.model"
import db from "../db/index"

interface FullUser {
  user: User
  scores: Score
}

export default class UserController {
  static async checkUser(user: User): Promise<User | null> {
    try {
      const { email } = user
      return await db.User.findOne({ where: { email } })
    } catch (e) {
      console.log(e)
      return null
    }
  }

  static async createUser(email: User["email"]): Promise<FullUser | null> {
    try {
      // Check if user exists, otherwise create them
      const user: [User, boolean] = await db.User.findOrCreate({ where: { email: email } })

      if (!user[1]) {
        return null
      }

      const userScore: [Score, boolean] = await db.Score.findOrCreate({ where: { userId: user[0].id } })

      return {
        user: user[0],
        scores: userScore[0],
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }

  static async getUser(user: User): Promise<Promise<FullUser> | null> {
    try {
      const { email } = user
      const result: User | null = await db.User.findOne({ where: { email: email } })

      if (!result) {
        return null
      }

      const scores: Score | null = await db.Score.findOne({ where: { userId: result.id } })

      if (!scores) {
        return null
      }

      return {
        user: result,
        scores: scores,
      }
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
