//The auth token
var fs = require('fs');
const myDB = require('./config/myDB.json');
//var token = require('./config/token.json');

var serverID = "321077154786050059";

process.stdout.write('\t' + "Attach role moving script....");

const Discord = require("discord.js");
var client = new Discord.Client({
});

client.on("ready", () => {
    process.stdout.write('\t' + "ready!" + '\n');
});

client.on("message", (message) => {
    //emit channel

    //456465168885481473 - Channel - Emit
    //457158832963977219 - Channel - Commands
    //388800903895056404 - User - Ukill

    if( message.channel.id === '456465168885481473' && message.content === 'updateRoleOther'){
        
        message.reply('updateRoleOther received');

        message.guild.setRolePosition("457247197545758721", 1, false).then(role => {//Default role
        }).catch(console.error);

        message.guild.setRolePosition("457324364346687489", 2, false).then(role => {//spotify role
        }).catch(console.error);

        }
  
//console.log(roles.GetNameById('457324364346687489'));

    if (message.author.bot) return;

        if (message.channel.id === '457158832963977219' && message.author.id == 388800903895056404) {
            var commandArray = message.content.split(/ +/g);
            var param = "";
            for (var i = 1; i < commandArray.length; i++) {
                if (i != 1){
                    param += ',' + '"' + commandArray[i] + '"';
                } else {
                    param += '"' + commandArray[i] + '"';
                };
            };

            if (commandArray[0].length == 18 && commandArray[1].length < 3 ){
                message.guild.setRolePosition(commandArray[0], commandArray[1], false).then(role => {
                    }).catch(console.error).then(console.log(message.reply("Channel: " + commandArray[0] + " set to position: " + commandArray[1])));
 
            } else if(message.author.id != 388800903895056404){ //Ukiil-ID
                message.reply('too much param');
            }
        };
});

client.login(myDB[serverID].config.token);
