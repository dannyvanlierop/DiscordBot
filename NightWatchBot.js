//var movescript = require("./MoveOther.js", true); <-- to move the role item order
var serverID = "321077154786050059";    //MainServer
//var serverID = "452491057285038101";    //TestServer

process.stdout.write('\n' + "Starting NightwatchBot...");

const fs = require('fs');

//Main discord.io dependency.
const Discord = require('discord.io');
const movescript = require("./MoveOther.js");

const now = new Date();
const TimeNow = now.getTime();

const myDB = require('./config/myDB.json');
fs.writeFileSync('./config/_autobackup/myDB.' + TimeNow + '.json', JSON.stringify(myDB));

//starting the bot client
var bot = new Discord.Client({
    autorun: true,
    token: myDB[serverID].config.token     //The auth token
});

var server = {
    //server configuration
    debug : myDB[serverID].config.server.bDebug,
    testserver : myDB[serverID].config.server.bTestServer
};

bot.on('ready', function(event) {
    fs.writeFileSync('./config/_autobackup/bot.' + TimeNow + '.json', JSON.stringify(bot));
    process.stdout.write('\n\t' + "Server is Ready!" + '\n\n\t' + "Botname: " + bot.username + '\n\t' + "botID: " +  bot.id  + '\n\n');
    
   // console.log(JSON.stringify(channels.getAllType(), null, 2));

    //myDB[serverID].users = users.getAll(); fs.writeFileSync('./config/myDB.json', JSON.stringify(myDB));

    //Clean created array, remove the custom roles from the default, after a bot restart
    for (var roleid in myDB[serverID].roles.created) {
        if ( typeof myDB[serverID].roles.created[roleid] != undefined ){
            if ( myDB[serverID].roles.created[roleid].id == roleid){
                if ( roleid != '457247197545758721' || roleid != '456757033736077312' ){//StandBy || User
                    //removeRole( serverID, userID, bot.servers[serverID].members[userID].roles[i] );
                    bot.deleteRole({
                        serverID: serverID,
                        roleID: roleid
                        },function(error){

                    });
                    console.log("Cleanup done!")
                }
            };
        };
    };

    myDB[serverID].roles.deleted = {};
    myDB[serverID].roles.created = {};
    
    users.getAll();
    roles.getAll();
    channels.getAll();

    roles.save();
    console.log("myDB init done!");
});


arrSpotifyHistory= [];

var listen = {
    //enable/disable listener setting
    //Items found in the source, not used yet
    any : myDB[serverID].config.event.bListenOnAny, 
    debug : myDB[serverID].config.event.bListenOnDebug,
    message : myDB[serverID].config.event.bListenOnMessage,
    presence : myDB[serverID].config.event.bListenOnPresence,
    allusers : myDB[serverID].config.event.bListenOnAllUSers,
    disconnect : myDB[serverID].config.event.bListenOnDisconnect,
    ready : myDB[serverID].config.event.bListenOnReady,
    error : myDB[serverID].config.event.bListenOnError,
    log : myDB[serverID].config.event.bListenOnLog,
    fileEnd : myDB[serverID].config.event.bListenOnFileEnd,
    end : myDB[serverID].config.event.bListenOnEnd,
    done : myDB[serverID].config.event.bListenOnDone,
    incoming  : myDB[serverID].config.event.bListenOnIncomming,
    speaking : myDB[serverID].config.event.bListenOnSpeaking,
    newMemberStream : myDB[serverID].config.event.bListenOnNewMemberStream
};

var channels = {

    GetNameById : function(iChannelId){ //Returns the 'channelname' by 'channelid'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var channel in bot.servers[serverID].channels) {   //Get channels
                if ( bot.servers[serverID].channels[channel].id == iChannelId ) {   //Check if channelid is same as iChannelId
                    //console.log('\n' + "Found: channelsGetIdByName(" + iChannelId + "), iChannelId = " + bot.servers[serverID].channels[channel].name );
                    return bot.servers[serverID].channels[channel].name;  //return the channelid of channel
                };
            };
        };
        console.log("ResponseError: Could not find channelname... with channelid = " + iChannelId + '"' );
        return false;
    },
    GetIdByName : function(sChannelName){   //Returns the 'channelid' by 'channelname'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var channel in bot.servers[serverID].channels) {   //Get channels
                if ( bot.servers[serverID].channels[channel].name == sChannelName ) {   //Check if channelname is same as sChannelName
                    //console.log('\n' + "Found: channelsGetIdByName(" + sChannelName + "), iChannelId = " + bot.servers[serverID].channels[channel].id );
                    return bot.servers[serverID].channels[channel].id;  //return the channelid of channel
                };
            };
        };
        console.log("ResponseError: Could not find channelid... with channelname = " + sChannelName + '"' );
        return false;
    },
    getAll : function(){
        var returnObj = { };
        for (var serverID in bot.servers) {
            for (var channelID in bot.servers[serverID].channels) {
                if (typeof bot.servers[serverID].channels[channelID].id == undefined) return;
                returnObj[channelID] = { } 
                returnObj[channelID].members = bot.servers[serverID].channels[channelID].members;
                returnObj[channelID].permissions = bot.servers[serverID].channels[channelID].permissions;
                returnObj[channelID].guild_id = bot.servers[serverID].channels[channelID].guild_id; 
                returnObj[channelID].user_limit = bot.servers[serverID].channels[channelID].user_limit; 
                returnObj[channelID].type = bot.servers[serverID].channels[channelID].type;
                returnObj[channelID].position = bot.servers[serverID].channels[channelID].position;
                returnObj[channelID].parent_id = bot.servers[serverID].channels[channelID].parent_id;
                returnObj[channelID].nsfw = bot.servers[serverID].channels[channelID].nsfw;
                returnObj[channelID].name = bot.servers[serverID].channels[channelID].name;
                returnObj[channelID].id = bot.servers[serverID].channels[channelID].id;
                returnObj[channelID].bitrate = bot.servers[serverID].channels[channelID].bitrate;
            };

            //Duplicate, same value exists in server location, keep it as an reference
            //for (var userID in bot.channels) {
            //    if (typeof bot.channels[userID].id == undefined) return;
            //    returnObj[userID].members = bot.channels[userID].members;
            //    returnObj[userID].permissions = bot.channels[userID].permissions;
            //    returnObj[userID].guild_id = bot.channels[userID].guild_id;
            //    returnObj[userID].user_limit = bot.channels[userID].user_limit;
            //    returnObj[userID].type = bot.channels[userID].type;
            //    returnObj[userID].position = bot.channels[userID].position;
            //    returnObj[userID].parent_id = bot.channels[userID].parent_id;
            //    returnObj[userID].nsfw = bot.channels[userID].nsfw;
            //    returnObj[userID].name = bot.channels[userID].name;
            //    returnObj[userID].id = bot.channels[userID].id;
            //    returnObj[userID].bitrate = bot.channels[userID].bitrate;
            //};
        };
        myDB[serverID].channels = returnObj; 
              
        console.log("channels saved to myDB!");
        return returnObj;
    },
    getAllType : function(){
        var returnObj = {};
            returnObj.text = { };
            returnObj.dm = { };
            returnObj.voice = { };
            returnObj.groupdm = { };
            returnObj.category = { };

        for (var serverID in bot.servers) {
            //Get channels
            for(var channelID in bot.servers[serverID].channels) {
                if ( bot.servers[serverID].channels[channelID] != undefined ) {
                   

                    if ( bot.servers[serverID].channels[channelID].type == 0 ) {    //GUILD_TEXT
                        //returnObj.text[bot.servers[serverID].channels[channelID].name]  = channelID;
                        returnObj.text[channelID]  = bot.servers[serverID].channels[channelID].name;
                    }

                    else if ( bot.servers[serverID].channels[channelID].type == 1 ) {   //DM
                        //returnObj.dm[bot.servers[serverID].channels[channelID].name] = channelID;
                        returnObj.dm[channelID]  = bot.servers[serverID].channels[channelID].name;
                    }

                    else if ( bot.servers[serverID].channels[channelID].type == 2 ) {   //GUILD_VOICE
                        //returnObj.voice[bot.servers[serverID].channels[channelID].name] = channelID;
                        returnObj.voice[channelID]  = bot.servers[serverID].channels[channelID].name;
                    }

                    else if ( bot.servers[serverID].channels[channelID].type == 3 ) {   //GROUP_DM
                        //returnObj.groupdm[bot.servers[serverID].channels[channelID].name] = channelID;
                        returnObj.groupdm[channelID]  = bot.servers[serverID].channels[channelID].name;
                    }

                    else if ( bot.servers[serverID].channels[channelID].type == 4 ) {   //GUILD_CATEGORY
                        //returnObj.category[bot.servers[serverID].channels[channelID].name]  = channelID;
                        returnObj.category[channelID]  = bot.servers[serverID].channels[channelID].name;
                    };
                }
            };
        };
        return returnObj;
    }
};



var users = {

     GetNameById : function(iUserId){   //Returns the 'username' by 'userid'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var memberID in bot.servers[serverID].members) {   //Get members
                if ( bot.users[memberID].id == iUserId ) {   //Check iUserId
                    //console.log('\n' + "Found: usersGetNameById(" + iUserId + "), sUserName = " + bot.users[memberID].name );
                    return bot.users[memberID].name;  //return the username of iUserId
                };
            };
        };
        console.log("ResponseError: Could not find username... with userid = " + iUserId + '"' );
        return false;
    },
    GetIdByName : function(sUserName){  //Returns the 'userid' by 'userid'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var iUserId in bot.servers[serverID].members) {   //Get members
                if ( bot.users[iUserId].name == sUserName ) {   //Check sUserName
                    //console.log('\n' + "Found: usersGetIdByName(" + sUserName + "), iUserId = " + bot.users[iUserId].id );
                    return bot.users[iUserId].id;  //return the userid of sUserName
                };
            };
        };
        console.log("ResponseError: Could not find userid... with username = " + sUserName + '"' );
        return false;
    },
    getAll : function(){
        var returnObj = {};
        
        for (var serverID in bot.servers) {

            for (var memberID in bot.servers[serverID].members) {
                if (typeof bot.servers[serverID].members[memberID].id == undefined) return;
                returnObj[memberID] = { } 
                returnObj[memberID].roles = bot.servers[serverID].members[memberID].roles;
                returnObj[memberID].nick = bot.servers[serverID].members[memberID].nick;
                returnObj[memberID].mute = bot.servers[serverID].members[memberID].mute; 
                returnObj[memberID].deaf = bot.servers[serverID].members[memberID].deaf; 
                returnObj[memberID].id = bot.servers[serverID].members[memberID].id;
                returnObj[memberID].joined_at = bot.servers[serverID].members[memberID].joined_at;
            };

            for (var userID in bot.users) {
                if (typeof bot.users[userID].id == undefined) return;

                returnObj[userID].username = bot.users[userID].username;
                returnObj[userID].id = bot.users[userID].id;
                returnObj[userID].discriminator = bot.users[userID].discriminator;
                returnObj[userID].avatar = bot.users[userID].avatar;
                returnObj[userID].bot = bot.users[userID].bot;
            };
        };

        myDB[serverID].users.current = returnObj;
        console.log("users saved to myDB!");
        return returnObj;
    }
};


var roles = {

    getNameById : function(iRoleId){    //Returns the 'roleid' by 'rolename'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var roleID in bot.servers[serverID].roles) {   //Get roles
                if ( bot.servers[serverID].roles[roleID].id == iRoleId ) {   //Check if roleid is same as iRoleId
                    //console.log('\n' + "Found: rolesGetNameById(" + iRoleId + "), sRoleName = " + bot.servers[serverID].roles[roleID].name );
                    return bot.servers[serverID].roles[roleID].name;  //return the rolename
                };
            };
        };
        console.log("ResponseError: Could not find rolename... with roleid = " + iRoleId + '"' );
        return false;
    },
    getIdByName : function(sRoleName){  //Returns the 'rolename' by 'roleid'.
        for (var serverID in bot.servers) { //Get ServerID
            for (var roleName in bot.servers[serverID].roles) {   //Get roles
                if ( bot.servers[serverID].roles[roleName].name == sRoleName ) {   //Check if rolename is same as sRoleName
                    //console.log('\n' + "Found: rolesGetIdByName(" + sRoleName + "), iRoleId = " + bot.servers[serverID].roles[roleID].id );
                    return bot.servers[serverID].roles[roleName].id;  //return the roleid
                };
            };
        };
        console.log("ResponseError: Could not find roleid... with rolename = " + sRoleName + '"' );
        return false;
    },
    UpdateOrder : function(){   //moves the default roles to position 0, offline users are at -1
        bot.sendMessage({ "to": "456465168885481473", "message": 'updateRoleOther' }); 
        console.log("upating roles!" + '\n');
        roles.save();
    },
    getAll : function(){
        var returnObj = { };
        for (var serverID in bot.servers) {
            for (var roleID in bot.servers[serverID].roles) {
                if (typeof bot.servers[serverID].roles[roleID].id == undefined) return;
                returnObj[roleID] = { };
                returnObj[roleID].position = bot.servers[serverID].roles[roleID].position;
                returnObj[roleID].name = bot.servers[serverID].roles[roleID].name;
                returnObj[roleID].mentionable = bot.servers[serverID].roles[roleID].mentionable;
                returnObj[roleID].managed = bot.servers[serverID].roles[roleID].managed;
                returnObj[roleID].id = bot.servers[serverID].roles[roleID].id;
                returnObj[roleID].hoist = bot.servers[serverID].roles[roleID].hoist;
                returnObj[roleID].color = bot.servers[serverID].roles[roleID].color;
                returnObj[roleID]._permissions = bot.servers[serverID].roles[roleID]._permissions;
            };
        };

        myDB[serverID].roles.current = returnObj;
        console.log("roles saved to myDB!");
        return returnObj;
    },
    add : function(roleGroup, roleID, roleName){
        if ( (roleGroup == 'created' || roleGroup == 'current' || roleGroup == 'deleted') && ( roleGroup != undefined || roleID != undefined || roleName != undefined ) ){
            for (var serverID in bot.servers) {
                myDB[serverID].roles[roleGroup][roleID] = { "id" : roleID, "name" : roleName };
            }; console.log( "roles.add : " + roleGroup + " : " + roleID + " > " + roleName ); return {  "roleGroup" : roleGroup, "id" : roleID, "name" : roleName };
        } else { console.log( "roles.add ERROR : roleGroup: " + roleGroup + " roleID: " + roleID + " roleName: " + roleName ); return false; }

    },
    remove : function(roleGroup, roleID){ //remove the role from myDB
        if ( ( roleGroup == 'created' || roleGroup == 'current' || roleGroup == 'deleted' ) && ( roleGroup != undefined || roleID != undefined ) ){
            for (var serverID in bot.servers) {

                if ( roleGroup != 'deleted' ){
                    myDB[serverID].roles['deleted'][roleID] = myDB[serverID].roles[roleGroup][roleID];
                    delete myDB[serverID].roles[roleGroup][roleID];
                } else {
                    delete myDB[serverID].roles[roleGroup][roleID];
                }
                
            }; console.log( "roles.remove : " + roleID ); return { "roleGroup" : roleGroup, "id" : roleID };
        } else { console.log( "roles.remove ERROR : roleGroup: " + roleGroup + " roleID: " + roleID ); return false; }
    },
    del : function(roleName_roleID){
        
    },
    create : function(roleName){
        
    },
    spotifyUpdate : function(status){
        
    },
    save : function(){
       fs.writeFileSync('./config/myDB.json', JSON.stringify(myDB));
    }
};



var log = {

    //LogLevels
    error : function(message){  //1

    },
    warn : function(message){ //2

    },
    info : function(message){ //3

    },
    trace : function(message){  //4

    },
    debug : function(message){  //5

    },

    //general
    console : function(message){

    },

    channel : function (ChannelIdOrChannelName,sMessage){
    //Send a message to ChannelIdOrChannelName, it can be the channelId or ChannelName

        var iChannelId = ChannelIdOrChannelName;
        var sChannelName = ChannelIdOrChannelName;

        var aChunks = [];
        var iChunksLimit = 1800;

        if (ChannelIdOrChannelName.length == 18 && sometestvar.match(/^[0-9]+$/) != null){ //Check if input is an digit with an length of 18, otherwise it is the channelname
            sChannelName = channels.GetNameById(ChannelIdOrChannelName);
        } else {
            iChannelId = channels.GetIdByName(ChannelIdOrChannelName)
        };

        if (!iChannelId || !sChannelName) return;

        sendMessage(iChannelId , "Function logToChannel - Id:" + iChannelId + " Name:" + sChannelName + " Length:" + sMessage.length)

        if ( sMessage.length > iChunksLimit ){
            aChunks = StringToArrayChunks(sMessage, iChunksLimit);
    
            for (var j = 0; j < aChunks.length; j++) {
                sendMessage(iChannelId, aChunks[j]);
            };

        } else {
            sendMessage(iChannelId, sMessage);
        };

        function sendMessage(iChannelId,sMessage){
            bot.sendMessage({
                to: iChannelId,
                message: sMessage
            }); 
        };;
    }
};





//////////////////////////////////////////////////////////////////////
//----------------------------PRESENCE------------------------------//
//////////////////////////////////////////////////////////////////////
if ( listen.presence ){
    
  //  console.log("Loading event listeners - listening for 'presence'");

    // {String} user : The user's name.
    // {String} userID : The user's ID.
    // {String} status : The user's status. Currently observed: ['online', 'idle', 'offline']
    // {Object} game : The entire object containing the name (String), type (Number) and possibly url (String/null). 

    bot.on('presence', function(user, userID, status, game, event) {

       // editRole();

        OnPresence(user, userID, status, game, event);
    });

    function OnPresence(user, userID, status, game, event){
        logToChannel( "presence-raw", "Info: " + '\n' + "userID:" + userID + " user:" + user + " status:" + status + " game:" + '\n' + JSON.stringify(game) + '\n' );
    };
};

//This get triggerd when the user send a presence(change)
bot.on('presence', function(user, userID, status, game, event) {
    
    var gameName;
    var serverID = "321077154786050059";

    if ( bot.users[userID].bot ){ return; };
    if ( userID == '333933140949336064') return;//bot??     
    if ( userID == '321660663959126016') return; //pirate
    if ( userID == '333933140949336064') return; //avidana
  
  //  if ( userID != '297518555736571914') return;//not Ukill :)

    //if ( event.d.author.id != bot.id ){ return; };

    if ( game == null){ gameName = "StandBy";
    } else { gameName = game.name; }

//    var foundUserRole = false;
//    //Temp function
//  //  console.log('\n' + "presence: " + '\n' + JSON.stringify(game) )
//    for ( i = 0; i < bot.servers[serverID].members[userID].roles.length; i++ ){
//        if ( bot.servers[serverID].members[userID].roles[i] == '456757033736077312' ){
//            foundUserRole = true;
//        };
//    };
//
//    if (!foundUserRole){
//        addRoleToUser( serverID, userID, "User" );
//    };
//
//    /////////////////////////////



        if (gameName == 'Spotify'){
        
        var str;
        
        for( i = 0; i < 6; i++){
            if ( arrSpotifyHistory[i] == game.details ){
                return;
            }
        };

        for( i = 0; i < 6; i++){
            arrSpotifyHistory[i + 1] = arrSpotifyHistory[i];
        };

        arrSpotifyHistory[0] = game.details;


        str = "https://www.youtube.com/results?search_query=";

        str += JSON.stringify(game.details) + JSON.stringify(game.state) + JSON.stringify(game.assets.large_text);
        str = str.replace(/"/g,' ');
        str = str.replace(/\s\s+/g, ' ');
        str = str.replace(/ /g,'+');
        //str = '<' + str + '>';
    
        //var str2 = game.details + "  -  " + game.state + "  -  " + game.assets.large_text;
        var str2 = game.state + "  -  " + game.assets.large_text + "  -  " + game.details;

        bot.sendMessage({
            to: '456556929754595329',
            message: "",
            embed: {
                color: 3447003,
                author: {
                    name: str2,
                    icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-6H0JFc4x1_1NAgm8NnBzEevO3OFld9q5rspY1qSBtQdyf45A"
                },
                title: "Link to youtube",
                url: str
            }
 
        }); 
    }


//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER
//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER
//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER//////////////////////CHECK THIS LATER
    //Clean created array, remove the custom roles from the default, after a bot restart
    for (var roleid in myDB[serverID].roles.created) {
        if ( typeof myDB[serverID].roles.created[roleid] != undefined ){
            if ( myDB[serverID].roles.created[roleid].id == roleid){
                if ( myDB[serverID].roles.created[roleid].id != '457247197545758721' || myDB[serverID].roles.created[roleid].id != '456757033736077312' ){//StandBy || User
                    //removeRole( serverID, userID, bot.servers[serverID].members[userID].roles[i] );
                    bot.removeFromRole({
                        serverID: serverID,
                        roleID: roleid,
                        userID: userID
                        },function(error){

                    });
                    console.log("Cleanup: Remove role : " + roleid + " from: " + userID );
                }
            };
        };
    };
   addRoleToUser( serverID, userID, gameName );
});


var colorNumber = 10000;



//This function is usesd to add an existing role or creating a new one
//roleIDorName can handle the id of a role, but also the name
function addRoleToUser( serverID, userID, roleIDorName ){

    process.stdout.write("addRoleToUser: " + '\t' + " serverID: [" + serverID + "] userID: [" + userID + "] status: [" + roleIDorName + "] ");

    var roleFound = false;                                      //Only assign the existing role and Skip creating a new duplicated role when found
    var roleID;                     
    var roleName =  roleIDorName;                               //Set after param check
    var skipSecond = false;

    for (var serverID in bot.servers) {
        for (var role in bot.servers[serverID].roles) {
            if ( bot.servers[serverID].roles[role].name === roleIDorName || bot.servers[serverID].roles[role].id === roleIDorName ){
                roleFound = true;
                roleID = bot.servers[serverID].roles[role].id;
                roleName = bot.servers[serverID].roles[role].name;
                process.stdout.write("roleID: [" + roleID + "]" + '\n');
            };
        };
    };

    //Try to remove all the user roles, protected roles will be filtered out later
    for (var i = 0; i < bot.servers[serverID].members[userID].roles.length; i++) {
        if ( bot.servers[serverID].members[userID].roles[i] != roleID ){

            //Extra - probhit removing current roles, or roles created when bot was switched down, this check will also be done in the removeRole function.
            for (var serverID in myDB) {
                for (var roleid in myDB[serverID].roles.current) {
                    if ( typeof myDB[serverID].roles.current[roleid].id != undefined ){
                        if ( myDB[serverID].roles.current[roleid].id == roleID){
                            removeRole( serverID, userID, bot.servers[serverID].members[userID].roles[i] );
                            skipSecond = true;
                        };
                    };
                };
                
                //TESTING this
                if (skipSecond){
                    for (var roleid in myDB[serverID].roles.created) {
                        if ( typeof myDB[serverID].roles.created[roleid] != undefined ){
                            if ( myDB[serverID].roles.created[roleid].id == roleID){
                                removeRole( serverID, userID, bot.servers[serverID].members[userID].roles[i] );
                            };
                        };
                    };
                };
            };
        };
    };

    if ( !roleFound ){ 
        createRole();
    } else { 
        addToRole();
    };


 
    function createRole(){
        bot.createRole(serverID, function(error,response){
            if (error){ 
                console.log('\t' + "- createRole: serverID: " + serverID + " roleID: " + roleID + " roleName: " + roleName + '\n\t\t' + error);
            } else {
                roleID = response.id;

                for (var serverID in myDB) {
                    myDB[serverID].roles.created[roleID] = {}
                    myDB[serverID].roles.created[roleID].id = roleID;
                    myDB[serverID].roles.created[roleID].name = roleName;
                };
                
                 //roles.save();

                console.log('\t' + "- createRole : roleID: " + roleID + " roleName: " + roleName + "@Server: " + serverID + " created " + '\n' + JSON.stringify(response, null, 2));
                editRole(response.id);
            };
        });
    };

    function editRole(roleid){

        colorNumber += 1010101;

        if ( colorNumber > 20000000){
            colorNumber = 100000;
        }

        bot.editRole({
            serverID: serverID,
            roleID: roleid,
            name:  roleName,
           // color: 3447003,                       //Country-16777215 Games-3447003
            color : colorNumber,
	        permissions: {
	            GENERAL_CREATE_INSTANT_INVITE: false,
	            VOICE_USE_VAD: false,
	            GENERAL_CREATE_INSTANT_INVITE: false,
                GENERAL_ADMINISTRATOR: false,
	            GENERAL_MANAGE_ROLES: false,
	            GENERAL_MANAGE_CHANNELS: false,
	            GENERAL_MANAGE_GUILD: false,
	            GENERAL_KICK_MEMBERS: false,
	            GENERAL_BAN_MEMBERS: false,
	            GENERAL_ADMINISTRATOR: false,
                GENERAL_MANAGE_CHANNELS: false,
                GENERAL_MANAGE_GUILD: false,
                GENERAL_AUDIT_LOG: false,
                GENERAL_MANAGE_ROLES: false,
                GENERAL_MANAGE_NICKNAMES: false,
                GENERAL_CHANGE_NICKNAME: false,
                GENERAL_MANAGE_WEBHOOKS: false,
                GENERAL_MANAGE_EMOJIS: false,
                TEXT_ADD_REACTIONS: false,
	            TEXT_READ_MESSAGES: false,
	            TEXT_SEND_MESSAGES: false,
	            TEXT_SEND_TTS_MESSAGE: false,
	            TEXT_MANAGE_MESSAGES: false,
	            TEXT_EMBED_LINKS: false,
	            TEXT_ATTACH_FILES: false,
	            TEXT_READ_MESSAGE_HISTORY: false,
	            TEXT_MENTION_EVERYONE: false,
                TEXT_EXTERNAL_EMOJIS: false,
	            VOICE_CONNECT: false,
	            VOICE_SPEAK: false,
	            VOICE_MUTE_MEMBERS: false,
	            VOICE_DEAFEN_MEMBERS: false,
	            VOICE_MOVE_MEMBERS: false,
	            VOICE_USE_VAD: false,
	        },
            hoist: true,
            mentionable: true,
            position: 2
        },function(error,response){
            if (error){
                console.log('\t' + "- editRole: serverID: " + serverID + " roleID: " + roleID + " roleName: " + roleName + '\n\t\t' + error);
            } else {
                console.log('\t' + "- editRole : roleID: " + roleID + " roleName: " + roleName + "@Server: " + serverID + " edited " + '\n' + JSON.stringify(response, null, 2));

                ///Add the role to created roles
                addRoleToUser( serverID, userID, roleName );
            };
        });
    };

    function addToRole(){

        bot.addToRole({
            "serverID": serverID, 
            "userID": userID, 
            "roleID": roleID
            },function(error){ 
                if (error){ 
                    console.log('\t' + "- addToRole: serverID: " + serverID + " roleID: " + roleID + '\n\t\t' + error); 
                } else {
                    console.log('\t' + "- addToRole : roleID: " + roleID + " @ serverID: " + serverID + " add to " + userID);
                    
                    //Update the current user status
                    roles.UpdateOrder();
                };
        });
    };
};


function removeRole( serverID, userID, roleID ){

    var roleSkipRemove = false;
    var roleGotUsers = false;
    var roleGotUsersAmmount = 0;
    var roleName = roles.getNameById(roleID);

    var ProtectedRoles = ["389215116517834753","455304743816921089","453644287079481354","392473025133543426","436880828367372289","429592311501029382","454089142066872320","398587436957040651","402231869124640768","388234825804283904","436879426656141312","344616284190670848","455304668390621194","455305639799947264","421630602106634240","455130303099568148","454065645445971968","393063141833179146","393078237984718858","393015573828861953","388233748615004160","358683395896770560","424203419801092096","412794326725427200","455304609452261396","393065526630285334","402887787944214560","417649770530734081","393542084088299522","393080489042378762","416197827094642689","392361080137187331","396701728369803265","390854070065168384","389871841788952587","414098188426018816","392816093594386432","418876193019002900","406875505489346561","455122369430945814","383765193001533461","402890648358748160","398524036185063444","402889678652702722","454934122993942531","323196451838754817","452603354627964938","396366085080743937","454925901499727874","398520433483448323","389384945379835905","412702836229668879","393243733493153803","392688814973255700","386648093996613634","453678812807299078","455280483626909706","388154260262748170","439405560199249920","407213904125624341","446641518061682698","455334706934710283","454994327958061057","390853955590029314","382626009561694212","454311757926891520","393065534406524930","455105862910869505","416375663768109066","393074905727500290","420319363518693382","454775830690922506","455299164406808587","455304725064056832","390853959570554880","393078283689918465","455130316659490816","454988205767524352","402943360874184704","402905876366884864","392729142422011904","388728023035281428","390854160289103883","443533621937176586","321713816360714241","452555468431163405","454787568580427786","388236078353481728","414126356578959362","455176609662763019","399671640415404033","455304548916002835","455135503218376704","424538222635515914","389477928058224640","416295585541259265","440558045052010497","455337072757309441","398198102235938827","388234018409152512","405051260144844811","321715486608064512","390976181786247168","439405995555422209","375721421105659915","390985494881894402","391238900217151498","395900431009841184","449913737303031809","398524777876160512","395900846484881418","321750469116690435","422786856455897098","455337065534586880","392383232576061440","441274222833041429","454993914487767052","393076430394753037","447525224267776000","393062070213410816","390983108268130305","387623597121732620","392383438285570059","370573329100308480","393078280972140545","391055433605054465","418172697114312705","454924803942645760","345578286686142466","402890113052573697","367323570268930049","385478016769327115","370305805649444874","424197914026442752","455104308292091917","455304535997677568","441981414246842368","375384929464221697","392328222286807041","393080939443519509","453653779363921924","388723424933183488","387761033973989378","455302911195480075","354641392557096961","399731206662520832","321710160357752843","418876191307726848","393065529881001984","385220617152102411","427938181640617984","399695903767920660","399736599287431168","418857517423263744","389418334921293826","321077154786050059","404296638383915010","443532020401045515","446748738287829012","455106655860949003","395228607259213824","388232647542833162","439260758145237000","400778183294713866","337623132225536000","334452901931909121","455118726380126243","453654647748558848","400343419588837378","441989725323132938","429417561830981632","391991592585527306","389626143428313089","392358077879549968","399735984800923649","393549294465974272","454979118812102661","455297478896386069","398217248860536842","398542691903733760","392360189136994305","455337387254349824","418857522888310785","454252015069954051","388641940704329728","389613163785486356","392309568392265728","455311613067526150","455304906564173834","436877699009609738","418379106309111808","406772896547995658","454091122168561665","436181627576516630","409459113530097685","454247226139607050","388728364854149120","421779215923544065","454332288486866945","393034330336919553","453643656356823050","418857527833264129","455304754172788737","365923999466651648","416301389795557376","455325863194394644","421624875124260882","393062270625906688","454802523409088522","454796130765635615","455304724489437188","391239585700642817","401455928534106122","401865176573280256","390607558295158786","384348327422197782","387761016433278987","436877954505637888","391647129933971477","414142556411133973","421039647871991809","321717224035450890","454782389965553664","385220757665480735","423938077820583938","393547594967678987","393067337458253844","388435607199809538","393025486806319115","409084527135424514","455102601206169601","393062068552597505","398911136424001536","404695276415090699","455337098514268170","390854162021089282","393021547155030018","446750043589050370","454326514960433162","321714500287987722","414098000453959680","455110291428999188","405054009351733258","419800811158241280","442458063459319808","454815065883934730","392450760186789889","393062330289881093","392358184070938625","455304732718923776"];

    for (var i = 0; i < ProtectedRoles.length && !roleSkipRemove; i++) {    //Skip removing this role when its found in ProtectedRoles array
        if (ProtectedRoles[i] == roleID){
            roleSkipRemove = true;
        }
    };
    
    for (var serverID in myDB) {
        for (var roleid in myDB[serverID].roles.current) {
             if ( typeof myDB[serverID].roles.current[roleid].id != undefined) {
                 if ( myDB[serverID].roles.current[roleid].id == roleID) {
                     roleSkipRemove = true;
                 };
             };
         };
    };

    //Skip removing when there is more then 1 user in th group before removing the role
    if (!roleSkipRemove){
        for (var serverID in bot.servers) {
            for (var member in bot.servers[serverID].members) {
                for (var i = 0; i < bot.servers[serverID].members[member].roles.length && !roleSkipRemove; i++) {
                    if (bot.servers[serverID].members[member].roles[i] === roleID ){
                        roleGotUsersAmmount++;
                        if (roleGotUsersAmmount > 1){
                            roleGotUsers = true;
                        };
                    };
                };
            };
         };
    };

    if (!roleSkipRemove){
        bot.removeFromRole({
            "serverID": serverID, 
            "userID": userID, 
            "roleID": roleID
            },function(error, response){ 

                if (error){ 
                    console.log('\t' + "- removeFromRole: " + '\n\t\t' + error + " " + roleID + " serverID: " + serverID + " from userID " + userID);
                } else {
                    console.log('\t' + "- Role : " + roleID + " @Server: " + serverID + " is removed from user: " + userID);
                };
        });
    };

    if(!roleSkipRemove && !roleGotUsers){
        bot.deleteRole({
            serverID: serverID,
            roleID: roleID
            },function(error){
                
                if (typeof serverID == undefined) return;

                if (error){ 
                    console.log('\t' + "- deleteRole: " + '\n\t\t' + error + " " + roleID + " @ from serverID: " + serverID);
                } else {
                    console.log('\t' + "- Role : " + roleID + " is remove from server Server: " + serverID);

                for (var serverID in myDB) {
                    for (var roleid in myDB[serverID].roles.deleted) {
                        if (roleID == roleid){
                            myDB[serverID].roles.deleted[roleid] = {}
                            myDB[serverID].roles.deleted[roleid].id = roleID;
                            myDB[serverID].roles.deleted[roleid].name = roleName;
                        }
                    }
                
                    console.log("deleteRole : " + roleName + " add to deleted DB succeed!!")

                    if ( typeof myDB[serverID].roles.created[roleID] != undefined ){
                        delete myDB[serverID].roles.created[roleID];
                        console.log("deleteRole : " + roleName + " del from created DB succeed!!")
                    }
                    
                    if ( myDB[serverID].roles.current[roleID] != undefined ){
                        delete myDB[serverID].roles.current[roleID];
                        console.log("deleteRole : " + roleName +  "del from current DB succeed!!")
                    }

                };
                  //  roles.UpdateOrder();
            };
        });
    };
};






//Push a message to one of the predefined channels
//The ChannelIdOrChannelName can be the channelId or ChannelName
function logToChannel(ChannelIdOrChannelName,sMessage){
    
    var iChannelId;
    var sChannelName;

    var aChunks = [];
    var iChunksLimit = 1800;

    if (ChannelIdOrChannelName.length == 18 && sometestvar.match(/^[0-9]+$/) != null){
        iChannelId = ChannelIdOrChannelName;
        //sChannelName = channelsGetNameById(ChannelIdOrChannelName);
        sChannelName = channels.GetNameById(ChannelIdOrChannelName);
    } else {
        //iChannelId = channelsGetIdByName(ChannelIdOrChannelName);
        channels.GetIdByName(ChannelIdOrChannelName)
        sChannelName = ChannelIdOrChannelName;
    };
    
    if (!iChannelId || !sChannelName) return;

    sendMessage(iChannelId , "Function logToChannel - Id:" + iChannelId + " Name:" + sChannelName + " Length:" + sMessage.length)

    if ( sMessage.length > iChunksLimit ){
        aChunks = StringToArrayChunks(sMessage, iChunksLimit);
 
        for (var j = 0; j < aChunks.length; j++) {
            sendMessage(iChannelId, aChunks[j]);
        };

    } else {
        sendMessage(iChannelId, sMessage);
    };

    function sendMessage(iChannelId,sMessage){
        bot.sendMessage({
            to: iChannelId,
            message: sMessage
        }); 
    };;
};

function StringToArrayChunks(sMessage, iPartsLength){   //Convert strings to the length iPartsLength, returns an array with strings.
    var chunks = [];
    for (var i = 0, charsLength = sMessage.length; i < charsLength; i += iPartsLength) {
        chunks.push(sMessage.substring(i, i + iPartsLength));
    } ;
    return chunks;
};











//function sendMessage(channel, message, embed){
//// * Send a message to a channel.
//// * @arg {Object} input
//// * @arg {Snowflake} input.to - The target Channel or User ID.
//// * @arg {String} input.message - The message content.
//// * @arg {Object} [input.embed] - An embed object to include
//// * @arg {Boolean} [input.tts] - Enable Text-to-Speech for this message.
//// * @arg {Number} [input.nonce] - Number-used-only-ONCE. The Discord client uses this to change the message color from grey to white.
//// * @arg {Boolean} [input.typing] - Indicates whether the message should be sent with simulated typing. Based on message length.
//
//     sendMessage = {
//         to: '453632974525825035',
//         message: "test",
//         embed: {
//             color: 3447003,
//             author: {
//                 name: "TestUser",
//                 icon_url: "https://www.iconfinder.com/icons/229153/file_format_uniform_resource_locator_url_web_address_icon"
//             },
//             title: "This is an embed",
//             url: "http://google.com",
//             description: "This is a test embed to showcase what they look like and what they can do.",
//             fields: [
//                 {
//                     name: "Fields",
//                     value: "They can have different fields with small headlines."
//                 },
//                 {
//                     name: "Masked links",
//                     value: "You can put [masked links](http://google.com) inside of rich embeds."
//                 },
//                 {
//                     name: "Markdown",
//                     value: "You can put all the *usual* **__Markdown__** inside of them."
//                 }
//             ],
//             timestamp: new Date(),
//             footer: {
//                 icon_url: "https://www.iconfinder.com/icons/229153/file_format_uniform_resource_locator_url_web_address_icon",
//                 text: "© Example"
//             }
//         }
//     }; 
//
//     return sendMessage;
//};



bot.on('guildMemberAdd', function(user, userID, channelID, message, event) {

    var members;

   

    for (var serverID in bot.servers) {
        members = bot.servers[serverID].member_count;
    };

        bot.sendMessage({
            to: '456424931996205056',
            message: members + '\n' +
            '\n' + "Welcome (back) to the NightWatch :) " + '\n' 
            //'\n' + "member: " + members
        });

        addRoleToUser('456757033736077312');//"User"
        addRoleToUser('456873948634677259');//"🏳️ No country role"
        addRoleToUser('456872678373195807');//"🙃 No Custom Role"
});


//var start = new Date().getTime();
//for (var i = 0; i < 1e7; i++) {
//    if ((new Date().getTime() - start) > 10){
//        position++
//       
//       // if ( position < roleArr.length ){
//        setrole();
//     //   console.log(JSON.stringify(roleObj));
//        //fs.writeFileSync('./roleObj.json', JSON.stringify(roleObj));
//        break;
//        }
//    }
//}
 