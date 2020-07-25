class Exist {
    constructor(moduleManager) {

    }

    handle(args) {
        let moduleManager = args.moduleManager;
        let user = args.user;

        return new Promise((resolve, reject) => {
            moduleManager.Database._mongoClient.connect(moduleManager.Database._uri, function(err, db) {
                if(err) reject(err);

                var dbo = db.db();

                dbo.collection("users").findOne({userID: user.id}, function(err, result) {
                    if(err) reject(err);

                    db.close();

                    if(result) {
                        resolve(true);
                    }

                    resolve(false)
                })
            })
        })
    }
}

module.exports = Exist;