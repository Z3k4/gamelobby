class Create {
    constructor(moduleManager) {

    }

    handle(args) {
        let moduleManager = args.moduleManager;
        let user = args.user;
        let lobbyID = args.lobbyID;


        let userObj = {}
        userObj.userID = user.id;
        userObj.userName = {} 
        userObj.onLobby = lobbyID;

        

        moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
            if(err) throw err;
            var dbo = db.db();

            dbo.collection("users").insertOne(userObj, function(err, result) {
                if(err) throw err;

                db.close();
            })

        })
    }
}

module.exports = Create;