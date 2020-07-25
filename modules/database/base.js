var MongoClient = require('mongodb').MongoClient, assert = require('assert');
//const client = new mongo(uri);


class Database {

    constructor() {
        this._mongoClient = MongoClient;
        this._uri = "mongodb://mezkay:kC6tfjV9H0qsjwIbvVOZ@localhost:27017/gamelobby"
        this._mongoClient.connect(this._uri, function(err, db) {
            if (err) throw err;
            console.log("Connected to database...")

            var dbo = db.db();
            dbo.createCollection("lobbylist", function(err, res) {
                if (err) throw err;
                console.log("Lobby created !" );
                
            })

            dbo.createCollection("gamedata", function(err, res) {
                if (err) throw err;
                console.log("Gamedata created")
            })

            dbo.createCollection("users", function(err, res) {
                if(err) throw err;
            })


            //db.close();
        })

        //Register database function
        this.register(require('./tools'));

        //Register game data
        this.register(require('./games/leagueoflegends'));
        this.register(require('./games/overwatch'));



        

        //var lolData = require('./games/leagueoflegends');
        //var loldata = new lolData(this)
    }

    execQueries() {
        this._mongoClient.connect(this._uri, function(err, db) {
            let dbo = db.db();

            dbo.command({insert : ''})

            db.close();
        })
    }

    addLobby(name, game) {
        this._mongoClient.connect(this._uri, function(err, db) {
            if (err) throw err;
            var dbo = db.db();

            var lobbyObj = {name: name, game:game}

            dbo.collection("lobbylist").insertOne(lobbyObj, function(err, res) {
                if(err) throw err;
                console.log("A lobby has been created");
                db.close();
            })
            
        })
    }

    getAllLobby() {
        return new Promise((resolve, reject) => {
            this._mongoClient.connect(this._uri, function(err, db) {
                if (err) reject(err)
                var dbo = db.db();
                dbo.collection("lobbylist").find({}).toArray(function(err, result) {
                    if(err) reject(err);
                    resolve(result)
                    db.close();
                })
            })

        })
    }

    register(moduleName) {
        this[moduleName.name] = new moduleName(this);
    }
}

module.exports = Database;