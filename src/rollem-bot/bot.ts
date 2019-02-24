'use strict';

const util = require("util");

import Discord from 'discord.js';
import { RollemParser } from '../rollem-language/rollem.js';
import moment from 'moment';
import * as assert from 'assert';

// const mongodbAddress = process.env.MONGODB_ADDRESS as string;
// const mongodbPassword = process.env.MONGODB_ROOT_PASSWORD as string;
// assert.ok(!!mongodbAddress, "no mongodb address");
// assert.ok(!!mongodbPassword, "no mongodb password");

// MongoClient.connect(
//   mongodbAddress,
//   { auth: { user: 'root', password: mongodbPassword } },
//   (err, client) => {
//     assert.equal(null, err);
    
//     console.log("Mongo DB connection successful.");
 
//     const db = client.db("test");
   
//     client.close();
//   })



