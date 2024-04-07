import UserController from "../user"
import database from "../../db/index"
import { Repository, Model } from "sequelize-typescript"
import { User } from "../../models/user"
import { Score } from "../../models/score"

// Mock the database class
jest.mock("../../db/index", () => {
  const createMockRepository = <T extends Model<T>>(): Repository<T> => {
    return {
      findOne: jest.fn(),
      findOrCreate: jest.fn(),
      // Add other methods you want to mock
    } as unknown as Repository<T>
  }

  return {
    sequelize: {
      authenticate: jest.fn(),
      sync: jest.fn(),
    },
    User: createMockRepository<User>(),
    Score: createMockRepository<Score>(),
    // Add other repositories you want to mock
  }
})

describe("UserController", () => {
  it("should check a user", async () => {
    const mockUser = { email: "test@test.com" }

    ;(database.User.findOne as jest.Mock).mockResolvedValue(mockUser)

    const user: User | null = await UserController.checkUser(mockUser as User)

    expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } })
    expect(user).toEqual(mockUser)
  })

  it("should return null when checking a user that does not exist", async () => {
    const mockUser = { email: "nonexistent@test.com" }

    // Mock the findOne method to return null
    ;(database.User.findOne as jest.Mock).mockResolvedValue(null)

    const user: User | null = await UserController.checkUser(mockUser as User)

    expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } })
    expect(user).toBeNull()
  })

  it("should return null when checkUser encounters an error", async () => {
    const mockUser = { email: "test@test.com" }
    const consoleSpy = jest.spyOn(console, "error")
    // Mock the findOne method to throw an error
    ;(database.User.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Test error")
    })

    const result = await UserController.checkUser(mockUser as User)
    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should create a user", async () => {
    const mockUser: [{ id: number; email: string }, boolean] = [{ id: 1, email: "test@test.com" }, true]
    const mockScore: [{ userId: number; score: number }, boolean] = [{ userId: 1, score: 0 }, true]
    const expectedFullUser = { user: mockUser[0], scores: mockScore[0] }

    ;(database.User.findOrCreate as jest.Mock).mockResolvedValue(mockUser)
    ;(database.Score.findOrCreate as jest.Mock).mockResolvedValue(mockScore)

    const fullUser = await UserController.createUser("test@test.com")

    expect(database.User.findOrCreate).toHaveBeenCalledWith({ where: { email: "test@test.com" } })
    expect(database.Score.findOrCreate).toHaveBeenCalledWith({ where: { userId: mockUser[0].id } })
    expect(fullUser).toEqual(expectedFullUser)
  })

  it("should not create a user because they already exist", async () => {
    const mockUser: [{ id: number; email: string }, boolean] = [{ id: 1, email: "test@test.com" }, false]

    // Mock the findOrCreate method to return an existing user
    ;(database.User.findOrCreate as jest.Mock).mockResolvedValue(mockUser)

    const fullUser = await UserController.createUser("test@test.com")

    expect(database.User.findOrCreate).toHaveBeenCalledWith({ where: { email: "test@test.com" } })
    expect(fullUser).toBeNull()
  })

  it("should return null when createUser encounters an error", async () => {
    const mockEmail = "test@test.com"
    const consoleSpy = jest.spyOn(console, "error")
    // Mock the findOrCreate method to throw an error
    ;(database.User.findOrCreate as jest.Mock).mockImplementation(() => {
      throw new Error("Test error")
    })

    const result = await UserController.createUser(mockEmail)

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should get a user", async () => {
    const mockUser = { id: 1, email: "test@test.com" }
    const mockScore = { userId: 1, score: 0 }
    const expectedFullUser = { user: mockUser, scores: mockScore }

    ;(database.User.findOne as jest.Mock).mockResolvedValue(mockUser)
    ;(database.Score.findOne as jest.Mock).mockResolvedValue(mockScore)

    const fullUser = await UserController.getUser(mockUser as User)

    expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } })
    expect(database.Score.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
    expect(fullUser).toEqual(expectedFullUser)
  })

  it("should return null when getting a user that does not exist", async () => {
    const mockUser = { email: "nonexistent@test.com" }

    // Mock the findOne method to return null
    ;(database.User.findOne as jest.Mock).mockResolvedValue(null)

    const fullUser = await UserController.getUser(mockUser as User)

    expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } })
    expect(fullUser).toBeNull()
  })

  it("should return null when getting a user that exists but does not have a score", async () => {
    const mockUser = { id: 1, email: "test@test.com" }

    // Mock the findOne method to return a user
    ;(database.User.findOne as jest.Mock).mockResolvedValue(mockUser)
    // Mock the findOne method to return null for the score
    ;(database.Score.findOne as jest.Mock).mockResolvedValue(null)

    const fullUser = await UserController.getUser(mockUser as User)

    expect(database.User.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } })
    expect(database.Score.findOne).toHaveBeenCalledWith({ where: { userId: mockUser.id } })
    expect(fullUser).toBeNull()
  })

  it("should return null when getUser encounters an error", async () => {
    const mockUser = { email: "test@test.com" }
    const consoleSpy = jest.spyOn(console, "error")
    // Mock the findOne method to throw an error
    ;(database.User.findOne as jest.Mock).mockImplementation(() => {
      throw new Error("Test error")
    })

    const result = await UserController.getUser(mockUser as User)

    expect(result).toBeNull()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
