class ModuleManager {
    constructor(discordClient) {
        this.allcommands = []
        this.register(require('../database/base'));
        this.register(require('../lobby/base'));
        this.register(require('../user/base'));

        this.register(require('../user/discordutils/setProfil'));


        this._prefixcmd = ">";
        
        this._discordClient = discordClient;
        this._lobbyInstance = [];
        this._lobbyJoin = [];

        

        this._discordClient.on('message', (msg) => {
            if(msg.author.bot) return;
            let content = msg.content;
            
            if(content.substring(0, 1) == this._prefixcmd) {
                let cmdData = content.substring(1, content.length).split(" ");

                //this.executeCommand(cmdData[0], {message : msg, args : cmdData});
                //if (msg.guild == null) {
                    this.executeCommand(cmdData[0], {message : msg, args : cmdData}); 
                //}
            }

            else {
                let args = {};
                args.moduleManager = this;
                args.message = msg;
                args.user = msg.author;

                if(this._lobbyInstance[msg.author.id] != undefined) {
                    

                    this.Lobby.LobbyCreate.writeLobbyData(args);
                }
                else if (this._lobbyJoin[msg.author.id] != undefined) {
                    this.Lobby.LobbyJoin.writeJoinLobbyData(args);
                }
            }
        })
 
        this._discordClient.on("messageReactionAdd", (messageReaction, user) => {
            let moduleManager = this;
            if(!user.bot) {
                

                if(moduleManager._lobbyInstance[user.id] == undefined) {
                    moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db();

                        dbo.collection("gamedata").findOne({gameEmoji: messageReaction.emoji.name}, function(err, result) {
                            if (err) throw err;

                            if(result != null) {
                                moduleManager._lobbyInstance[user.id] = {step : 0, uniqueName: result.uniqueName, gameSlots : result.gameSlots};

                                let args = {}
                                args.moduleManager = moduleManager;
                                args.messageReaction = messageReaction;
                                args.user = user;
                                

                                moduleManager.Lobby.LobbyCreate.writeLobbyData(args);
                            }
                        })
                        /*dbo.collection("gamedata").findOne({gameEmoji : messageReaction.emoji}, function(err, result) {
                            if (err) throw err;

                            console.log(result)
                            result.forEach(gameData => {
                                moduleManager._lobbyInstance[msg.author.id] = {step: 0, gameName : gameData.gameName}
                            })


                            db.close();
                        })*/

                        db.close();
                    })

                   

                    /**/
                }
            }
        })


        //Intialize lobbylist
        function getLobby(moduleManager) {
            moduleManager.Database.getAllLobby()
            .then(result => {
                //console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
        }

        let moduleManager = this;
        setInterval(function() {
            getLobby(moduleManager)
        }, 1000)
    }


    register(moduleName) {
        this[moduleName.name] = new moduleName(this);

    }

    executeCommand(name, args) {
        args.moduleManager = this;
        this.allcommands.forEach(cmdItem => {
            console.log(name)
            if(name == cmdItem.name) {
                
                cmdItem["function"](args)
            }
        })
    }

    addCommand(name, func) {
        this.allcommands.push({"name" : name, "function" : func})
    }
}

module.exports = ModuleManager;