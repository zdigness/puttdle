import { User } from "./models/user"
import { Score } from "./models/score"

interface FullUser {
  user: User
  scores: Score
}

export { FullUser }
