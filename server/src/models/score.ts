import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { User } from "./user"

@Table({
  tableName: "Scores",
})
export class Score extends Model<Score> {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @BelongsTo(() => User)
  user!: User

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  streak?: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  total?: number
}
