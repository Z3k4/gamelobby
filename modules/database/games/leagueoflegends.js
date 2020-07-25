class LoLData  {
    constructor(Database) {
        let gameObj = {}
        gameObj.uniqueName = "riotlol"
        gameObj.gameName = "League of Legends"
        gameObj.gameEmoji = '😂'
        gameObj.gameRoles = ['TOP', 'MID', 'JUNGLE', 'SUPPORT', 'ADC']
        gameObj.gameSlots = 5
        gameObj.gameModes = [
            {name:'BLIND', slots : 5, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},
            {name:'NORMAL', slots : 5, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},
            {name:'ARAM', slots : 5, roles : {'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined}},
            {name:'FLEX', slots : 5, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},
            {name:'RANKED', slots : 2, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},
        ]


        
        Database.Tools.registerGame(gameObj);

    }


}

module.exports = LoLData;