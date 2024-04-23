import { Table, Model, Column, DataType, ForeignKey, BelongsTo, AllowNull, Index } from "sequelize-typescript"
import { User } from "./user"

@Table({
  tableName: "Scores",
})
export class Score extends Model<Score> {
  @BelongsTo(() => User)
  user!: User

  @ForeignKey(() => User)
  @Column
  userId!: number

  @AllowNull(false)
  @Index("score-day-index")
  @Column(DataType.DATE)
  day!: Date

  @AllowNull(false)
  @Column(DataType.INTEGER)
  score!: number
}
