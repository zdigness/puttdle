import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from "sequelize-typescript"
import { Map } from "./map"

@Table({ tableName: "Sandtrap", })
export class Sandtrap extends Model<Sandtrap> {
  @BelongsTo(() => Map)
    map!: Map

  @ForeignKey(() => Map)
  @Column
    mapId!: number

  @Column(DataType.INTEGER)
    x!: number

  @Column(DataType.INTEGER)
    y!: number
}