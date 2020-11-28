import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { FullName } from "./full-name.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id!: number;

  @Column({ nullable: true, unique: true })
  discordId!: string;
}
