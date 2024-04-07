import { Router } from "express"
import { User } from "../models/user"
import UserController from "../controllers/user"

const userRouter = Router()

userRouter.post("/", async (req, res) => {
  console.log("Google login")
  const user: User = req.body
  const userExists = await UserController.checkUser(user)
  if (userExists) {
    console.log("User exists")
    const fullUser = await UserController.getUser(user)
    console.log(fullUser?.user.email)
    console.log(fullUser?.scores.streak)
    console.log(fullUser?.scores.total)
    res.send(fullUser)
  } else {
    console.log("Creating user")
    const newUser = await UserController.createUser(user.email)
    console.log(newUser?.user.email)
    console.log(newUser?.scores.streak)
    console.log(newUser?.scores.total)
    res.send(newUser)
  }
})

export default userRouter
