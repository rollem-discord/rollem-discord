import { Injectable } from "injection-js";
import { createConnection, Connection, getConnection, Repository } from "typeorm";
import { User } from "./entity/User";

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
    this.connection = await createConnection({
      type: "postgres",
      url: process.env.DB_CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
      connectTimeoutMS: 500,
      entities: [
        "rollem-dist/storage/entity/*.js",
      ],
    });
  }
}