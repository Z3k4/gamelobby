class LobbySearch {
    constructor(moduleManager) {


        moduleManager.addCommand("search", this.handle )
    }

    async handle(args) {
        let moduleManager = args.moduleManager;
        let msg = args.message;

        let data = msg.content.split(" ");
        
        try {
            let lobbylist = await moduleManager.Database.Tools.searchLobby(data);
            //console.log(lobbylist);
            let reply = "Found " + lobbylist.length + " lobby with your preferences \n```"
            for(const lobby of lobbylist) {
                //console.log(lobby)
                let gameName = await moduleManager.Database.Tools.getGameName(lobby.uniqueName);
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

                reply += "\n";
                


            }
            msg.reply(reply + '```');
        }

        catch(err) {
            console.log(err);
            msg.reply("Unable to find a lobby with yours preferences");
        }

        
        //Check if there are research data
        

    }
}

module.exports = LobbySearch;