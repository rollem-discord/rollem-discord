'use strict';

const Discord = require('discord.js');
const Rollem  = require('./rollem.js');
const client = new Discord.Client();
var token = process.env.DISCORD_BOT_USER_TOKEN

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setStatus("online", "Just roll to roll")
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.on('message', message => {
  if (message.author == client.user) { return; }
  var result = Rollem.parse(message.content)
  if (result === false) { return; }
  if (typeof(result) === "string") {
    message.reply(result);
    return;
  }
  if (result.depth === 1) {return;}

  var response = "";

  if (result.label && result.label != "") {
    response += "'" + result.label + "', ";
  }
  if (typeof(result.value) === "boolean")
  {
    result.value = result.value ? "**Success!**" : "**Failure!**";
  }

  response += result.value + ' ⟵ ' + result.pretties;

  console.log(message + " -> " + response);
  message.reply(response);
});

client.login(token);
