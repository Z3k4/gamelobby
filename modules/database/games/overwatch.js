class OverwatchData {
    constructor(Database) {
        let gameObj = {}
        gameObj.uniqueName = "overwatch"
        gameObj.gameName = "Overwatch"
        gameObj.gameEmoji = '😂'
        gameObj.gameModes = [
            {name:'RANKED', slots : 6, roles : {'TANK': undefined, 'TANK':undefined, 'SUPPORT':undefined, 'SUPPORT':undefined, 'DAMAGE':undefined, 'DAMAGE':undefined}},
            {name:'NORMAL', slots : 6, roles : {'TANK': undefined, 'TANK':undefined, 'SUPPORT':undefined, 'SUPPORT':undefined, 'DAMAGE':undefined, 'DAMAGE':undefined}},
            /*{name:'ARAM', slots : 5, roles : {'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined, 'SLOT' : undefined}},
            {name:'FLEX', slots : 5, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},
            {name:'RANKED', slots : 2, roles : {'TOP': undefined, 'MID':undefined, 'JUNGLE':undefined, 'SUPPORT':undefined, 'ADC':undefined}},*/
        ]


        
        Database.Tools.registerGame(gameObj);

    }
}

module.exports = OverwatchData;