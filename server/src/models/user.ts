import { Table, Model, Column, DataType, Index, HasMany, Default } from "sequelize-typescript"
import { Score } from "./score"

@Table({
  tableName: "Users",
})
export class User extends Model<User> {
  @Index("email-index")
  @Column(DataType.STRING)
  email!: string

  @Default(0)
  @Column(DataType.INTEGER)
  streak!: number

  @HasMany(() => Score)
  scores!: Score[]
}
