class JoinFunc {
    constructor(moduleManager) {

    }

    handle(args) {
        let moduleManager = args.moduleManager;
        let user = args.user;
        let lobbyID = args.lobbyID

        moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
            if (err) throw err;

            var dbo = db.db();

            dbo.collection("users").updateOne({userID : user.id}, { $set: {onLobby: lobbyID}}, function(err, result) {
                if(err) throw err;

                
            })
        })
    }
}

module.exports = JoinFunc;