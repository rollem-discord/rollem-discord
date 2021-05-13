import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, Index, OneToOne, JoinColumn} from "typeorm";
import { UserFlags } from "./UserFlags";

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

    @OneToOne(type => UserFlags, userFlags => userFlags.user, { cascade: true })
    @JoinColumn()
    flags!: User;
}
