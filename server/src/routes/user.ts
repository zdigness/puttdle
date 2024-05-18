import { Router } from "express"
import { User } from "../models/user"
import { FullUser } from "../types"
import UserController from "../controllers/user"

const userRouter = Router()

userRouter.post("/google-login", async (req, res) => {
  const user: User = req.body
  try {
    const userExists: User | null = await UserController.checkUser(user?.email)
    if (userExists) {
      const fullUser: FullUser | null = await UserController.getUser(user.email)
      console.log(fullUser?.user.email)
      console.log(fullUser?.user.streak)
      console.log(fullUser?.scores.score)
      res.status(200).send(fullUser)
    } else {
      const newUser: User | null = await UserController.createUser(user.email)
      console.log(newUser?.email)
      console.log(newUser?.streak)
      res.status(200).send(newUser)
    }
  } catch (e) {
    console.error(e)
    res.send("Error checking user")
  }
})

export default userRouter
