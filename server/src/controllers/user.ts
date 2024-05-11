import { User } from "../models/user"
import { Score } from "../models/score"
import { FullUser } from "../types"
import db from "../db"

export default class UserController {
  static async checkUser(email: User["email"]): Promise<User | null> {
    try {
      return await db.User.findOne({
        where: { email },
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  static async createUser(email: User["email"]): Promise<User | null> {
    try {
      // Check if user exists, otherwise create them
      const createdUser: [User, boolean] = await db.User.findOrCreate({
        where: { email },
      })

      if (!createdUser[1]) {
        throw Error("User already exists")
      }
      return createdUser[0]
    } catch (e) {
      console.error(e)
      return null
    }
  }

  static async getUser(email: User["email"]): Promise<Promise<FullUser> | null> {
    try {
      const retrievedUser: User | null = await db.User.findOne({
        where: { email },
      })

      if (!retrievedUser) {
        throw Error("User does not exist")
      }

      const date = new Date()
      date.setUTCHours(0, 0, 0, 0)
      const scores: Score | null = await db.Score.findOne({ where: { userId: retrievedUser.id, day: date } })

      if (!scores) {
        throw Error(`Score does not exist for user ${retrievedUser.id}`)
      }

      return {
        user: retrievedUser,
        scores: scores,
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
