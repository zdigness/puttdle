import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript"
import { Map } from "./map"

@Table({ tableName: "Water" })
export class Water extends Model<Water> {
  @BelongsTo(() => Map)
  map!: Map

  @ForeignKey(() => Map)
  @Column
  mapId!: number

  @Column(DataType.INTEGER)
  water_x!: number

  @Column(DataType.INTEGER)
  water_y!: number
}
