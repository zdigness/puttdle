import { Table, Model, Column, DataType, PrimaryKey, AutoIncrement, AllowNull, HasMany } from "sequelize-typescript"

import { Sandtrap } from "./sandtrap"
import { Water } from "./water"
import { Barrier } from "./barrier"

@Table({ tableName: "Maps", })
export class Map extends Model<Map> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number
    
  @AllowNull(false)
  @Column(DataType.DATEONLY)
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