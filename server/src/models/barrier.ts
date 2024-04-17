import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript"
import { Map } from "./map"

@Table({ tableName: "Barriers" })
export class Barrier extends Model<Barrier> {
  @BelongsTo(() => Map)
  map!: Map

  @ForeignKey(() => Map)
  @Column
  mapId!: number

  @Column(DataType.INTEGER)
  barrier_x!: number

  @Column(DataType.INTEGER)
  barrier_y!: number
}
