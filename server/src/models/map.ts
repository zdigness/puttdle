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
    
  @Column(DataType.DATEONLY)
  @AllowNull(false)
    day!: Date

  @Column(DataType.INTEGER)
  @AllowNull(false)
    par!: number

  @Column(DataType.INTEGER)
  @AllowNull(false)
    hole_x!: number

  @Column(DataType.INTEGER)
  @AllowNull(false)
    hole_y!: number

  @Column(DataType.INTEGER)
  @AllowNull(false)
    ball_x!: number

  @Column(DataType.INTEGER)
  @AllowNull(false)
    ball_y!: number

  @HasMany(() => Sandtrap)
    sandtraps!: Sandtrap[]

  @HasMany(() => Water)
    waters!: Water[]

  @HasMany(() => Barrier)
    barriers!: Barrier[]
}