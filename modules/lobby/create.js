const discord = require('discord.js')

class LobbyCreate {
    constructor(moduleManager) {


        moduleManager.addCommand("create", this.handle )
    }

    handle(args) {
        let moduleManager = args.moduleManager;
        let msg = args.message;

        
        if(moduleManager._lobbyInstance[msg.author.id]) {
            msg.reply("You're already intialiazed a lobby")
            return;
        }

        let newLobby = moduleManager.Lobby.LobbyCreate.makeLobbyManager();
        msg.channel.send(newLobby).then(rply => {
            /*rply.react("🌂").then(rply => {
                rply.message.react("🕶").then(rply => {
                })
            })*/

            moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
                if (err) throw err;
                let dbo = db.db();
                
                dbo.collection("gamedata").find({}).toArray(function(err, result) {
                    if (err) throw err;

                    //console.log(result);

                    
                    result.forEach(item => {
                        rply.react(item.gameEmoji)
                    })
                    
                    db.close();
                })
            })
        })

    }


    makeLobbyManager() {
        let richtext = new discord.MessageEmbed();
        richtext.setTitle("Setup lobby...");
        richtext.setDescription("To make lobby, please add reaction to specify game");
        richtext.setAuthor("Lobby Creator")

        return richtext;
        
    }

    async finishLobby(moduleManager, lobbyData) {
        moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db();
            dbo.collection("lobbylist").findOne({ownerID: lobbyData.user.id}, function(err, result) {
                if (err) throw err;
                

                let edit = {$set : {lobbySlots: lobbyData.gameSlots, uniqueName: lobbyData.uniqueName, lobbyGameMode: lobbyData.gameMode, lobbyName: lobbyData.name}}
                if (result) {
                    
                    dbo.collection("lobbylist").updateOne({ownerID: lobbyData.user.id}, edit, function(err, result) {
                        if (err) throw err;
                        db.close()
                    })
                   ;
                } else {
                    //let lobbyID = lobbyData.user.id;

                    dbo.collection("lobbylist").countDocuments({}, function(err, count) {
                        if (err) throw err;

                        var lobbyObj = {};
                        
                        lobbyObj.lobbyID = count
                        lobbyObj.ownerID = lobbyData.user.id;
                        lobbyObj.lobbySlots = lobbyData.gameSlots;
                        lobbyObj.lobbyName = lobbyData.name;
                        lobbyObj.uniqueName = lobbyData.uniqueName;
                        lobbyObj.lobbyGameMode = lobbyData.gameMode;

                        dbo.collection("lobbylist").insertOne(lobbyObj, function(err, result) {
                            if(err) throw err;
    
                            db.close();
                        })
                    })
                    
                }
            })

            
        })
        let richtext = new discord.MessageEmbed();
        let gameName = await moduleManager.Database.Tools.getGameName(lobbyData.uniqueName);
        console.log(gameName)

        richtext.setTitle(lobbyData.name);
        richtext.setDescription("Players (1 /  " + lobbyData.gameMode.slots + ") \n" +  lobbyData.user.tag)

        //console.log(moduleManager.Database)
        richtext.setAuthor(gameName)

        return richtext;
    }

    async writeLobbyData(args) { //To follow and setup every step
        let moduleManager = args.moduleManager;
        let messageReaction = args.messageReaction; 
        let message = args.message;
        let user = args.user;



        //console.log(moduleManager._lobbyInstance[messageReaction.message.author.id].step)
        
        switch(moduleManager._lobbyInstance[user.id].step) {
            case 0:
                messageReaction.message.reply("Lobby instance has been created, please write lobby informations \n Lobby Name: ")
                break;
            case 1:
                moduleManager._lobbyInstance[message.author.id].name = message.content;
                let getModes = await moduleManager.Database.Tools.getGameModes(moduleManager._lobbyInstance[message.author.id].uniqueName);

                var reply = "Select the mode ```";

                for(const mode of getModes) {
                    reply += (getModes.indexOf(mode) + 1) + " | " + mode.name + " | Max Players: " + mode.slots + "\n";
                }

                message.reply(reply + "```");

                
                break;
            case 2:
                //console.log(moduleManager.Database.Tools)
                let chooseMode = Number(message.content)
                console.log(chooseMode)
                if(Number.isInteger(chooseMode)) {
                    
                    let gameMode = await moduleManager.Database.Tools.getGameMode(moduleManager.Database.Tools.getGameModes(moduleManager._lobbyInstance[message.author.id].uniqueName), chooseMode)
                    let getRoles = await moduleManager.Database.Tools.getGameRoles(moduleManager._lobbyInstance[message.author.id].uniqueName);

                    gameMode[chooseMode -1] = message.author.id;

                    moduleManager._lobbyInstance[message.author.id].gameMode = gameMode;

                    //console.log(gameMode)
                    var reply = "Choose your role :\n```";


                    getRoles.forEach(role => {
                        reply += (getRoles.indexOf(role) + 1) + " | " + role + "\n"
                    })

                    
                    message.reply(reply + "```")
                }
                else {
                    message.reply("wHy Y0u w4Nt T0 bR00k Me ?!\n pL34s3 cH00s3 tH3 c0Rr3cT 4nSw3r");
                    return;
                }
                break;
            case 3:
                //geGameRole
                let chooseRole = Number(message.content)
                if(Number.isInteger(chooseRole)) {
                    let getRoles = moduleManager._lobbyInstance[message.author.id].gameMode.roles
                    

                    let index = 1;
                    for(const role in getRoles) {

                        if(index == chooseRole) {
                            if(moduleManager._lobbyInstance[message.author.id].gameMode.roles[role] == undefined) {
                                moduleManager._lobbyInstance[message.author.id].gameMode.roles[role] = user.id;
                            } else {
                                message.reply("This role are already picked")
                                return;
                            }
                            
                        }
                        index += 1;
                    }

                    //console.log()

                    moduleManager._lobbyInstance[message.author.id].user = user;
                    //moduleManager._lobbyInstance[message.author.id].players = [user.id]; 
                    moduleManager._lobbyInstance[message.author.id].role = message.content;
                    
                    console.log(moduleManager._lobbyInstance[message.author.id].gameMode)

                    message.reply("Your lobby data : ")

                    let richText = await moduleManager.Lobby.LobbyCreate.finishLobby(moduleManager, moduleManager._lobbyInstance[message.author.id]);
                    message.reply(richText)
                    break;
                } else {
                    message.reply("wHy Y0u w4Nt T0 bR00k Me ?!\n pL34s3 cH00s3 tH3 c0Rr3cT 4nSw3r");
                    return;
                }
            default:
                //messageReaction.message.reply("Lobby instance has been created, please write lobby informations")
                break;

        }

        moduleManager._lobbyInstance[user.id].step += 1
        

        
    }
}

module.exports = LobbyCreate;