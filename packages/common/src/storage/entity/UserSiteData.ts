import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export enum SiteVersion {
  NONE = "",
  V2 = "v2",
}

@Entity()
export class UserSiteData {
  @PrimaryColumn("uuid")
  userId!: string;

  @OneToOne(type => User, user => user.siteData)
  user!: User;

  @Column({
    type: "enum",
    enum: SiteVersion,
    default: SiteVersion.NONE,
  })
  firstSiteVersion!: string;

  @CreateDateColumn()
  firstLogin!: Date;

  @UpdateDateColumn()
  lastLogin!: Date;
}
