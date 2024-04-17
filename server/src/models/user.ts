import { Table, Model, Column, DataType, Index, HasOne } from "sequelize-typescript"
import { Score } from "./score"

@Table({
  tableName: "Users",
})
export class User extends Model<User> {
  @HasOne(() => Score, { foreignKey: "userId" })
  score!: Score

  @Index("email-index")
  @Column(DataType.STRING)
  email!: string
}
