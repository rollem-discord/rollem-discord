import { Entity, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
@Entity()
export class UserFlags {
  @PrimaryColumn("uuid")
  userId!: string;

  @OneToOne(type => User, user => user.flags)
  user!: User;
}
