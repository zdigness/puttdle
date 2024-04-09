import { Router } from "express"
import { User } from "../models/user"
import { FullUser } from "../types"
import UserController from "../controllers/user"

const userRouter = Router()

userRouter.post("/", async (req, res) => {
  const user: User = req.body
  try {
    const userExists: User | null = await UserController.checkUser(user?.email)
    if (userExists) {
      const fullUser: FullUser | null = await UserController.getUser(user.email)
      console.log(fullUser?.user.email)
      console.log(fullUser?.scores.streak)
      console.log(fullUser?.scores.total)
      res.status(200).send(fullUser)
    } else {
      const newUser: FullUser | null = await UserController.createUser(user.email)
      console.log(newUser?.user.email)
      console.log(newUser?.scores.streak)
      console.log(newUser?.scores.total)
      res.status(200).send(newUser)
    }
  } catch (e) {
    console.error(e)
    res.send("Error checking user")
  }
})

export default userRouter
