import 'reflect-metadata';
import { Injectable } from "injection-js";
import { createConnection, Connection, getConnection, Repository, ConnectionOptions } from "typeorm";
import { User } from "./entity/User";
import path from 'path';

@Injectable()
export class Storage {
  private connection!: Connection;

  public constructor() { }

  private get usersRepository(): Repository<User> { return this.connection.getRepository(User); }

  public async getOrCreateUser(discordUserId): Promise<User> {
    const retrieveById = async () => await this.usersRepository.findOne({where: { discordUserId: discordUserId }});
    const existingUser = await retrieveById();
    if (existingUser) { return existingUser; }

    const newUser = await this.usersRepository.create({discordUserId: discordUserId});
    const createdUser = await this.usersRepository.save(newUser);
    const retrievedUser = await retrieveById();

    return retrievedUser || createdUser;
  }

  public async forgetUser(discordUserId): Promise<User|undefined> {
    const existingUser = await this.usersRepository.findOne({discordUserId: discordUserId});
    if (!existingUser) { return undefined; }

    await this.usersRepository.delete(existingUser.id);

    return existingUser;
  }

  public async initialize() {
    console.log("homk",__dirname);
    const config: ConnectionOptions = {
      type: "postgres",
      url: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      connectTimeoutMS: 500,
      entities: [
        User,
      ],
      migrations: [
        path.join(__dirname, '/migration/**/*.js'),
      ],
      subscribers: [
        path.join(__dirname, '/subscriber/**/*.js'),
      ],
    };
    console.log(config);
    this.connection = await createConnection(config);
    debugger;
  }
}