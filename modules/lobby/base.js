class Lobby {

    constructor(moduleManager) {
        
        this.register(require('./create'), moduleManager);
        this.register(require('./search'), moduleManager);
        this.register(require('./join'), moduleManager);
    }

    register(moduleName, moduleManager) {
        this[moduleName.name] = new moduleName(moduleManager);

    }
}

module.exports = Lobby;