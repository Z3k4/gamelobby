class User {

    constructor(moduleManager) {
        
        this.register(require('./editfunc'), moduleManager);
        ///this.register(require('./checkfunc'), moduleManager);
        this.register(require('./joinfunc'), moduleManager);
        this.register(require('./exist'), moduleManager);
        this.register(require('./create'), moduleManager);


    }

    register(moduleName, moduleManager) {
        this[moduleName.name] = new moduleName(moduleManager);

    }
}

module.exports = User;