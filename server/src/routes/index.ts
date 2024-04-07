import { Router } from "express"
import userRouter from "./user"

const appRouter = Router()

const appRoutes = [
  {
    path: "/google-login",
    router: userRouter,
  },
]

appRoutes.forEach((route) => {
  appRouter.use(route.path, route.router)
})

export default appRouter
