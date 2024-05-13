import { Router } from "express"
import userRouter from "./user"
import mapRouter from "./map"
import scoreRouter from "./score"

const appRouter = Router()

const appRoutes = [
  {
    path: "/google-login",
    router: userRouter,
  },
  {
    path: "/map",
    router: mapRouter,
  },
  {
    path: "/score",
    router: scoreRouter,
  },
]

appRoutes.forEach((route) => {
  appRouter.use(route.path, route.router)
})

export default appRouter
