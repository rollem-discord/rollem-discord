'use strict';

const Discord = require('discord.js');
const Rollem  = require('./rollem.js');
const client = new Discord.Client();
var token = process.env.DISCORD_BOT_USER_TOKEN

var messageInterval = 60000;
var restartMessage = "Hello, World!";
var messages = [
  "Docs at github.com/lemtzas/rollem-discord",
  "Just roll to roll",
  "r`2d20` for inline",
  "r1+1 for math"
];

function cycleMessage()
{
  var message = messages.shift();
  messages.push(message);
  console.log('Set status to: ' + message);
  client.user.setStatus("online", message);
}

client.on('ready', () => {
  console.log('I am ready!');
  console.log('Set status to: ' + restartMessage);
  client.user.setStatus("online", restartMessage);
  console.log('username: ' + client.user.username);
  console.log('id: ' + client.user.id);
  setInterval(cycleMessage, messageInterval);
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.on('message', message => {
  if (message.author == client.user) { return; }

  // parse the whole string and check for dice
  var result = Rollem.tryParse(message.content);
  var response = buildMessage(result);
  if (response && result.depth > 1 && result.dice > 0) {
    console.log('soft parse | ' + message + " -> " + response);
    message.reply(response);
    return;
  }

  // ignore the dice requirement with prefixed strings
  if (message.content.startsWith('r') || message.content.startsWith('&')) {
    var subMessage = message.content.substring(1);
    var result = Rollem.tryParse(subMessage);
    var response = buildMessage(result, false);
    if (response) {
      console.log('hard parse | ' + message + " -> " + result);
      message.reply(response);
      return;
    }
  }

  // handle inline matches
  var last = null;
  var matches = [];
  var regex = /\[(.+?)\]/g;
  while (last = regex.exec(message.content)) { matches.push(last[1]); }

  if (matches && matches.length > 0) {
    var messages = matches.map(function(match) {
      var result = Rollem.tryParse(match);
      var response = buildMessage(result);
      return response;
    }).filter(function(x) { return x; });
    var fullMessage = messages.join('\n');
    if (fullMessage) {
      console.log('line parse | ' + message + " -> " + fullMessage);
      message.reply(fullMessage);
      return;
    }
  }
});

client.login(token);

function buildMessage(result, requireDice = true)
{
  if (result === false) { return false; }
  if (typeof(result) === "string") { return result; }
  if (result.depth <= 1) { return false; }
  if (requireDice && result.dice < 1) { return false;}

  var response = "";

  if (result.label && result.label != "") {
    response += "'" + result.label + "', ";
  }
  if (typeof(result.value) === "boolean")
  {
    result.value = result.value ? "**Success!**" : "**Failure!**";
  }

  response += result.value + ' ⟵ ' + result.pretties;

  return response;
}
