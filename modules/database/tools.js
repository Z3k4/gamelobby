

class Tools {
    constructor(Database) {
        this._Database = Database;
    }

    getGameName(uniqueName) {
        return new Promise((resolve, reject) => {
            this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
                if (err) reject(err);
                var dbo = db.db();

                dbo.collection("gamedata").findOne({uniqueName: uniqueName}, function(err, result) {
                    if(err) reject(err);
                    
                    db.close();

                    resolve(result.gameName)
                }) 
                
            })
        })
    }

    getGameRoles = function(uniqueName) {
        return new Promise((resolve, reject)=> {
            this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
                if(err) reject(err);
                var dbo = db.db();

                dbo.collection("gamedata").findOne({uniqueName:uniqueName}, function(err, result) {
                    if(err) reject(err);

                    db.close();
                    resolve(result.gameRoles)
                })
            })
        })
    }

    getGameModes = function(uniqueName) { //To find all availables gamemodes of game
        return new Promise((resolve, reject) => {
            this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
                if(err) reject(err);
                var dbo = db.db();

                dbo.collection("gamedata").findOne({uniqueName:uniqueName}, function(err, result) {
                    if(err) reject(err);
                    db.close();
                    resolve(result.gameModes)
                })
            })
        })
    }

    getGameMode = function(getGameModeFunc, index) { //To find gamemode of game by index
        return new Promise((resolve, reject) => {
            getGameModeFunc.then(gamemodes => {
                resolve(gamemodes[index - 1]) // Index - 1 because player can be choose between 1 and n but array start at 0
            })
            .catch(err => reject(err))
        })
    }

    geGameRole = function(getGameRoleFunc, index) { //To find a role of game by index
        return new Promise((resolve, reject) => {
            getGameRoleFunc.then(roles => {
                resolve(roles[index - 1])
            })
            .catch(err => reject(err));
        })
    }

    searchLobby = function(param) { // param[1] to specify game, param[2] to specify gamemode 
        return new Promise((resolve, reject) => {
            if (param[1]) {
                //console.log(param[1])
                this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
                    if (err) throw reject(err);

                    var dbo = db.db();
                    let researchParamters = {}
                    if(param[1]) {
                        researchParamters.uniqueName = param[1]
                        if(param[2]) {
                            researchParamters.gameMode.name = param[2]
                        }
                    }
                    dbo.collection("lobbylist").find(researchParamters).toArray(function(err, result) {
                        if (err) throw reject(err);
                        //console.log(result);
                        db.close();
                        resolve(result)
                    })
                })
                
            }
        })
    }


    registerGame = function(gameData) {
        this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db();
            
            /*dbo.collection("gamedata").insertOne(gameObject, function(err, res) {
                if(err) throw err;
                console.log("New gamedata have been inserted");
                db.close();
            })*/

            dbo.collection("gamedata").findOne({gameName: gameData.gameName}, function(err, result) { 
                if(err) throw err;

                if(result == null) {
                    dbo.collection("gamedata").insertOne(gameData, function(err, res) {
                        if(err) throw err;
                        console.log("New gamedata have been inserted");
                        db.close();
                    })
                } else {
                    var newValue = { $set : gameData};

                    dbo.collection('gamedata').updateOne({gameName : gameData.gameName}, newValue, function(err, result) {
                        if (err) throw err;
                        console.log(gameData.gameName + " document updated successful")

                        db.close();
                    })
                }
            })
        })
    }

    finializeJoin (clientLobby, clientIndex) {
        return new Promise((resolve, reject) => {
            this._Database._mongoClient.connect(this._Database._uri, function(err, db) {
                if(err) reject("Critical error, please retry");

                var dbo = db.db();

                dbo.collection("lobbylist").findOne({lobbyID: clientLobby.lobbyID}, function(err, result) {
                    if(err) reject("Critical error, please retry")
                    if(result) {
                        let numberUsers = 0;
                        let availablesRoles = [];

                        for(const role in result.lobbyGameMode.roles) {
                            if(!result.lobbyGameMode.roles[role]) {
                                numberUsers += 1;
                                availablesRoles[role] = true;
                            }
                        }

                        let index = 0;

                        //console.log(availablesRoles)
                        for(const clientrole in clientLobby.lobbyGameMode.roles) {
                            index += 1
                            if (index == clientIndex) {
                                if(availablesRoles[clientrole]) {
                                    resolve({code : 0, msg: "You join the lobby", lobby:result})
                                }
                                else {
                                    resolve({code: 1, msg: "Unavailable role, please select another", lobby:result})
                                }
                            }
                            
                        }

                        if(numberUsers >= result.lobbyGameMode.slots) {
                            resolve({code: 1, msg: "Lobby full", lobby:result})
                        }
                    }
                    else {
                        resolve({code: 2, msg: "Lobby not found"})
                    }
                })
            })
        })
    }
}

module.exports = Tools;

//Tools.get