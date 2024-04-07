import winston from "winston"
import logger from "../logger"

describe("Logger", () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(winston.transports.Console.prototype, "log")
    process.env.NODE_ENV = ""
  })

  it("should log debug level when NODE_ENV is not production", () => {
    logger.debug("debug message")
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({ level: "debug" }), expect.any(Function))
  })

  it("should log error level when NODE_ENV is production", () => {
    process.env.NODE_ENV = "production"
    logger.error("error message")
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({ level: "error" }), expect.any(Function))
  })
})
