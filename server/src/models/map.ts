import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  Index,
} from "sequelize-typescript"

import { Sandtrap } from "./sandtrap"
import { Water } from "./water"
import { Barrier } from "./barrier"

@Table({ tableName: "Maps" })
export class Map extends Model<Map> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number

  @AllowNull(false)
  @Index("day-index")
  @Column(DataType.DATE)
  day!: Date

  @AllowNull(false)
  @Column(DataType.INTEGER)
  par!: number

  @AllowNull(false)
  @Column(DataType.INTEGER)
  hole_x!: number

  @AllowNull(false)
  @Column(DataType.INTEGER)
  hole_y!: number

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ball_x!: number

  @AllowNull(false)
  @Column(DataType.INTEGER)
  ball_y!: number

  @HasMany(() => Sandtrap)
  sandtraps!: Sandtrap[]

  @HasMany(() => Water)
  waters!: Water[]

  @HasMany(() => Barrier)
  barriers!: Barrier[]
}
