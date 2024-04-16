import { Map } from "../models/map"
import { Sandtrap } from "../models/sandtrap"
import { Water } from "../models/water"
import { Barrier } from "../models/barrier"
import { FullMap } from "src/types"
import db from "../db"

export default class MapController {
  static async getMap(day: Map["day"]): Promise<FullMap | null> {
    try {
      const retrievedMap: Map | null = await db.Map.findOne({ where: { day } })

      if (!retrievedMap) {
        throw Error("Map does not exist")
      }

      const sandtraps: Sandtrap[] = await db.Sandtrap.findAll({ where: { mapId: retrievedMap.id } })
      const water: Water[] = await db.Water.findAll({ where: { mapId: retrievedMap.id } })
      const barriers: Barrier[] = await db.Barrier.findAll({ where: { mapId: retrievedMap.id } })

      return {
        map: retrievedMap,
        sandtraps,
        water,
        barriers,
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
