'use strict';

const Discord = require('discord.js');
const Rollem  = require('./rollem.js');
const moment = require ('moment');

var rollemClient = null;

function newClient() {
  let client = new Discord.Client();

  var token = process.env.DISCORD_BOT_USER_TOKEN

  var mentionRegex = /$<@999999999999999999>/i;
  var messageInterval = 60000;
  var restartMessage = "http://rollem.rocks !!!";
  var messages = [
    "http://rollem.rocks v1.0.0"
  ];

  function cycleMessage()
  {
    var message = messages.shift();
    messages.push(message);
  //   console.log('Set status to: ' + message);
    client.user.setStatus("online", message);
  }

  client.on('disconnect', () => {
    console.log(""+new Date()+" quitting");
    process.exit(1);
  });

  client.on('ready', () => {
    console.log('I am ready!');
    console.log('Set status to: ' + restartMessage);
    client.user.setStatus("online", restartMessage);
    console.log('username: ' + client.user.username);
    console.log('id: ' + client.user.id);
    setInterval(cycleMessage, messageInterval);
    var mentionRegex_s = '^<@' + client.user.id + '>\\s+';
    mentionRegex = new RegExp(mentionRegex_s);
  });

  client.on('message', message => {
    if (message.author.bot) { return; }
    if (message.author == client.user) { return; }
    if (message.guild) { return; }
    if (message.content === 'ping') {
      message.reply('pong');
    }
  });

  client.on('message', message => {
    if (message.author.bot) { return; }
    let prefix = getPrefix(message);
    let content = message.content.substring(prefix.length);

    // ignore without prefix
    var match = content.match(mentionRegex);
    if (message.guild && !match) { return; }
    if (match) {
      content = content.substring(match[0].length).trim();
    }

    if (content.startsWith('stats')) {
      process.stdout.write("s1");
      let guilds = client.guilds.map((g) => g.name);
      let uptime = moment.duration(client.uptime);
      let stats = [
        '',
        '**guilds:** ' + client.guilds.size,
        '**users:** '  + client.users.size,
        '**uptime:** ' + `${uptime.days()}d ${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`,
        '',
        '**guild-list:**',
        guilds.join(', ')
      ];
      let response = stats.join('\n');
      message.reply(stats);
    }
  });

  client.on('message', message => {
    if (message.author.bot) { return; }
    if (message.author == client.user) { return; }
    let prefix = getPrefix(message);
    let content = message.content.substring(prefix.length);

    // parse the whole string and check for dice
    var result = Rollem.tryParse(content);
    var response = buildMessage(result);
    if (!content.startsWith('D') && response && result.depth > 1 && result.dice > 0) {
  //     console.log('soft parse | ' + message + " -> " + response);
      process.stdout.write("r1");
      message.reply(response);
      return;
    }

    // ignore the dice requirement with prefixed strings
    if (content.startsWith('r') || content.startsWith('&')) {
      var subMessage = content.substring(1);
      var result = Rollem.tryParse(subMessage);
      var response = buildMessage(result, false);
      if (response) {
  //       console.log('hard parse | ' + message + " -> " + result);
        process.stdout.write("r2");
        message.reply(response);
        return;
      }
    }

    // ignore the dice requirement with name prefixed strings
    var match = content.match(mentionRegex);
    if (match) {
      var subMessage = content.substring(match[0].length);
      var result = Rollem.tryParse(subMessage);
      var response = buildMessage(result, false);
      if (response) {
  //       console.log('hard parse | ' + message + " -> " + result);
        process.stdout.write("r3");
        message.reply(response);
        return;
      }
    }

    // handle inline matches
    var last = null;
    var matches = [];
    var regex = /\[(.+?)\]/g;
    while (last = regex.exec(content)) { matches.push(last[1]); }

    if (matches && matches.length > 0) {
      var messages = matches.map(function(match) {
        var result = Rollem.tryParse(match);
        var response = buildMessage(result);
        return response;
      }).filter(function(x) { return x; });
      var fullMessage = messages.join('\n');
      if (fullMessage) {
  //       console.log('line parse | ' + message + " -> " + fullMessage);
        process.stdout.write("r4");
        message.reply(fullMessage);
        return;
      }
    }
  });

  client.login(token);

  function getRelevantRoleNames(message, prefix) {
    if (!message.guild) { return []; }
    let me = message.guild.members.get(client.user.id);
    let roleNames = me.roles.map(r => r.name);
    let roles = roleNames.filter(rn => rn.startsWith(prefix));
    return roles;
  }

  function getPrefix(message) {
    let prefixRolePrefix = 'rollem:prefix:';
    let prefixRoles = getRelevantRoleNames(message, prefixRolePrefix);
    if (prefixRoles.length == 0) { return ""; }
    let prefix = prefixRoles[0].substring(prefixRolePrefix.length);
    return prefix;
  }

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

  return client;
}


rollemClient = newClient();
