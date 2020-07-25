class LobbyJoin {
    constructor(moduleManager) {


    moduleManager.addCommand("join", this.handle )

    }

    getLobby(moduleManager, lobbyIndex) {
        return new Promise((resolve, reject) => {
            moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
                if(err) reject(err);
                var dbo = db.db();
    
                dbo.collection("lobbylist").findOne({lobbyID: lobbyIndex}, function(err, lobby) {
                    if(err)  reject(err)
                    
                    if(lobby) {
    
                       resolve(lobby)
                        
                    }
                    else {
                        reject("No lobby found !")
                    }
                })
            })
        })
    }

    async writeJoinLobbyData(args) {
        var moduleManager = args.moduleManager;
        var msg = args.message;


        //console.log(moduleManager._lobbyJoin[msg.author.id])
        //console.log(args)

        switch(moduleManager._lobbyJoin[msg.author.id].step) {
            case 0:
                //console.log(args.message.content)
                let chooseAnswer = Number(args.message.content);
                console.log(chooseAnswer)

                //if(typeof chooseAnswer == Number) return msg.reply("Use 1 or 2 to answer");
                

                if(chooseAnswer == 1  || chooseAnswer == 2) {
                    
                    
                    let reply = "Okey now please select your role \n```"

                    let index = 1;
                    //console.log(moduleManager._lobbyJoin[msg.author.id])
                    for(const role in moduleManager._lobbyJoin[msg.author.id].lobby.lobbyGameMode.roles) {
                        if (!moduleManager._lobbyJoin[msg.author.id].lobby.lobbyGameMode.roles[role]) {
                            reply += index + ") " + role + "\n"
                            index += 1;
                        }
                    }


                    msg.reply(reply + "```");
                    moduleManager._lobbyJoin[msg.author.id].step = 1



                } else {
                    return msg.reply("🤦‍♂️ ... it's funny, but choose between yes or no");
                }
                break;
            case 1:
                let choosedRole = Number(msg.content)

                if(typeof choosedRole == Number) return msg.reply("This is not a number")

                let lobby = moduleManager._lobbyJoin[msg.author.id].lobby
                let realCount = 0;

                console.log(lobby.lobbyGameMode)
                for(const role in lobby.lobbyGameMode.roles) {
                    if(!lobby.lobbyGameMode.roles[role]) {
                        realCount += 1;
                    }
                }

                console.log("Real count" + realCount)
                    //msg.reply-""
                if (choosedRole >= realCount) return msg.reply("You cannot pick this role")

                let responseData = await moduleManager.Database.Tools.finializeJoin(moduleManager._lobbyJoin[msg.author.id].lobby, choosedRole)
                let code = responseData.code;
                let reponseMsg = responseData.msg;
                let getLobby = responseData.lobby;

                switch(code) {
                    case 0: //Good
                        let dataArgs = {}
                        dataArgs.moduleManager = moduleManager;
                        dataArgs.user = msg.author;
                        dataArgs.lobbyID = moduleManager._lobbyJoin[msg.author.id].lobby.lobbyID;

                        let exist = await moduleManager.User.Exist.handle(dataArgs);

                        console.log(exist)

                        if(!exist) {
                            moduleManager.User.Create.handle(dataArgs);
                        }

                        else {
                            moduleManager.User.JoinFunc.handle(dataArgs);
                        }


                        msg.reply("You joined the lobby")
                        break;
                    case 1: //Not good
                        moduleManager._lobbyJoin[msg.author.id].lobby = getLobby;
                        return msg.reply(reponseMsg)
                            break;
                    case 2: //Lobby not found
                        return msg.reply(reponseMsg);
                        break;
                                
                    default: //Not good, unknown error
                        return msg.reply("Unknown error")
                        break;
                }

                break;
            default:
                //
                break;
        }
    }

    async handle(args) {
        let moduleManager = args.moduleManager;
        let msg = args.message;

        let data = msg.content.split(" ");

        let targetID = Number(data[1]);


        if(typeof targetID == Number) return msg.reply("Invalid lobby id");

        moduleManager.Lobby.LobbyJoin.getLobby(moduleManager, targetID).then(lobby => {

            let reply = '```'

            moduleManager.Database.Tools.getGameName(lobby.uniqueName).then(gameName => {
                let user = moduleManager._discordClient.users.cache.get(lobby.ownerID);
                let username = user.username + "#" + user.discriminator;


                let playersCount = 0;
                let availableRoles = []

                for(const role in lobby.lobbyGameMode.roles) {
                    if(lobby.lobbyGameMode.roles[role]) {
                        playersCount += 1;
                        
                    }
                    else {
                        availableRoles.push(role)
                    }
                }

                reply +=  "LobbyID: " + lobby.lobbyID + " | Game: " + gameName + " | " + lobby.lobbyGameMode.name + " | " + lobby.lobbyName + " (" + username + "'s room) | " 
                + "Players " + playersCount  + " / " + lobby.lobbyGameMode.slots + " | Available roles: " ;

                for(const roleCanChoose of availableRoles) {
                    let addComma = ', ';

                    if(availableRoles.indexOf(roleCanChoose) + 1 == availableRoles.length) {
                        addComma = '';
                    }

                    reply += roleCanChoose + addComma;
                        
                }

                reply += "```\n" + "You want to join this ?\n```\n1) Yes\n2) No```" ;

                moduleManager._lobbyJoin[msg.author.id] = {step:0, lobby:lobby}
                
                msg.reply(reply)
            })

        })
       .catch(err => {
           msg.reply("Critical error ! Please contact the developer")
       })
    }
}

module.exports = LobbyJoin;