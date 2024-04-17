import { User } from "./models/user"
import { Score } from "./models/score"
import { Map } from "./models/map"
import { Sandtrap } from "./models/sandtrap"
import { Water } from "./models/water"
import { Barrier } from "./models/barrier"

interface FullUser {
  user: User
  scores: Score
}

interface FullMap {
  map: Map
  sandtraps: Sandtrap[]
  water: Water[]
  barriers: Barrier[]
}

export { FullUser, FullMap }
