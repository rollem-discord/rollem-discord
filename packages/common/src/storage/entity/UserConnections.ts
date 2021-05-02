import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique, Index, PrimaryColumn} from "typeorm";

@Entity()
export class UserConnections {
    @PrimaryColumn()
    id!: string;

    @Column({ type: 'varchar', nullable: true })
    discord_access_token: string | null = null;

    @Column({ type: 'varchar', nullable: true })
    discord_token_type: string | null = null;

    @Column({ type: 'varchar', nullable: true })
    discord_expires_at: Date | null = null;

    @Column({ type: 'varchar', nullable: true })
    discord_refresh_token: string | null = null;

    @Column({ type: 'varchar', nullable: true })
    discord_scope: string | null = null;
}
