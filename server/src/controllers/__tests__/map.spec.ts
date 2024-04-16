import MapController from "../map"
import database from "../../db/index"
import { Repository, Model } from "sequelize-typescript"
import { Map } from "../../models/map"
import { Sandtrap } from "../../models/sandtrap"
import { Water } from "../../models/water"
import { Barrier } from "../../models/barrier"
import { FullMap } from "../../types"

jest.mock("../../db/index", () => {
  const createMockRepository = <T extends Model<T>>(): Repository<T> => {
    return {
      findOne: jest.fn(),
      findOrCreate: jest.fn(),
      findAll: jest.fn(),
      // Add other methods you want to mock
    } as unknown as Repository<T>
  }

  return {
    sequelize: {
      authenticate: jest.fn(),
      sync: jest.fn(),
    },
    Map: createMockRepository<Map>(),
    Sandtrap: createMockRepository<Sandtrap>(),
    Water: createMockRepository<Water>(),
    Barrier: createMockRepository<Barrier>(),
    // Add other repositories you want to mock
  }
})

describe("MapController", () => {
  describe("getMap", () => {
    it("should get a map", async () => {
      const mockMap = { id: 1, day: new Date(), par: 3, hole_x: 1, hole_y: 1, ball_x: 1, ball_y: 1 }
      const mockSandtraps = [{ id: 1, mapId: 1, x: 1, y: 1 }]
      const mockWater = [{ id: 1, mapId: 1, x: 1, y: 1 }]
      const mockBarriers = [{ id: 1, mapId: 1, x: 1, y: 1 }]
      const expectedFullMap = {
        map: mockMap,
        sandtraps: mockSandtraps,
        water: mockWater,
        barriers: mockBarriers,
      }

      ;(database.Map.findOne as jest.Mock).mockResolvedValue(mockMap)
      ;(database.Sandtrap.findAll as jest.Mock).mockResolvedValue(mockSandtraps)
      ;(database.Water.findAll as jest.Mock).mockResolvedValue(mockWater)
      ;(database.Barrier.findAll as jest.Mock).mockResolvedValue(mockBarriers)

      const fullMap: FullMap | null = await MapController.getMap(new Date())

      expect(database.Map.findOne).toHaveBeenCalledWith({ where: { day: mockMap.day } })
      expect(database.Sandtrap.findAll).toHaveBeenCalledWith({ where: { mapId: 1 } })
      expect(database.Water.findAll).toHaveBeenCalledWith({ where: { mapId: 1 } })
      expect(database.Barrier.findAll).toHaveBeenCalledWith({ where: { mapId: 1 } })
      expect(fullMap).toEqual(expectedFullMap)
    })

    it("should return null when the map does not exist", async () => {
      ;(database.Map.findOne as jest.Mock).mockResolvedValue(null)

      const fullMap: FullMap | null = await MapController.getMap(new Date())

      expect(fullMap).toBeNull()
    })

    it("should return null when getMap encounters an error", async () => {
      const consoleSpy = jest.spyOn(console, "error")
      ;(database.Map.findOne as jest.Mock).mockImplementation(() => {
        throw new Error("Test error")
      })

      const fullMap: FullMap | null = await MapController.getMap(new Date())

      expect(fullMap).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
})
