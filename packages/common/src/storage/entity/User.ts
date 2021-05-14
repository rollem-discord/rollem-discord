import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, Index, OneToOne, JoinColumn} from "typeorm";
import { UserFlags } from "./UserFlags";
import { UserSiteData } from "./UserSiteData";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @Index({ unique: true })
    discordUserId!: string;

    @CreateDateColumn()
    created!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @OneToOne(type => UserFlags, o => o?.user, { cascade: true })
    @JoinColumn()
    flags: User | undefined;

    @OneToOne(type => UserSiteData, o => o?.user, { cascade: true })
    @JoinColumn()
    siteData: User | undefined;
}
