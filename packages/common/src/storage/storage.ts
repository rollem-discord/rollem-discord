import 'reflect-metadata';
import { Injectable } from "injection-js";
import { createConnection, Connection, getConnection, Repository, ConnectionOptions, getRepository, getConnectionManager } from "typeorm";
import { User } from "./entity/User";
import path from 'path';
import { UserConnections } from './entity/UserConnections';

@Injectable()
export class Storage {
  private connection!: Connection;

  public constructor() { }

  private get usersRepository(): Repository<User> { return this.connection.getRepository(User); }

  private get userConnectionsRepository(): Repository<UserConnections> { return this.connection.getRepository(UserConnections); }

  public async getOrCreateUser(discordUserId): Promise<User> {
    const retrieveById = async () => await this.usersRepository.findOne({where: { discordUserId: discordUserId }});
    const existingUser = await retrieveById();
    if (existingUser) { return existingUser; }

    const newUser = await this.usersRepository.create({discordUserId: discordUserId});
    const createdUser = await this.usersRepository.save(newUser);
    const retrievedUser = await retrieveById();

    return retrievedUser || createdUser;
  }

  public async updateUser(user: User): Promise<User> {
    return await this.usersRepository.save(user);
  }

  public async forgetUser(discordUserId): Promise<User|undefined> {
    const existingUser = await this.usersRepository.findOne({discordUserId: discordUserId});
    if (!existingUser) { return undefined; }

    await this.usersRepository.delete(existingUser.id);

    return existingUser;
  }

  public async getOrCreateUserConnections(from: {id: string}): Promise<UserConnections> {
    const retrieve = async () => await this.userConnectionsRepository.findOne({where: { id: from.id }});

    const existingUserConnections = await retrieve();
    if (existingUserConnections) { return existingUserConnections; }

    const newUserConnections = await this.userConnectionsRepository.create({id: from.id});
    const createdUser = await this.userConnectionsRepository.save(newUserConnections);
    const retrievedUser = await retrieve();

    return retrievedUser || createdUser;
  }

  public async updateUserConnections(userConnections: UserConnections): Promise<UserConnections> {
    return await this.userConnectionsRepository.save(userConnections);
  }

  public async initialize() {
    if (this.connection) { return; }

    const config: ConnectionOptions = {
      type: "postgres",
      url: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      synchronize: true,
      connectTimeoutMS: 500,
      entities: [
        User,
        UserConnections,
      ],
      migrations: [
        path.join(__dirname, '/migration/**/*.js'),
      ],
      subscribers: [
        path.join(__dirname, '/subscriber/**/*.js'),
      ],
    };

    try {
      this.connection = await createConnection(config);
    } catch (err) {
      // If AlreadyHasActiveConnectionError occurs, return already existent connection
      if (err.name === 'AlreadyHasActiveConnectionError') {
        const existingConnection = getConnectionManager().get("default");
        this.connection = existingConnection;
        return;
     }

     throw err;
    }
  }
}