const Discord = require('discord.js')
const token = "NzMxODU2OTI2NTQzMTgzOTMy.Xw8O7Q.zIp0weig4Ovg0Axdu7LlaDzs9o8";

const bot = new Discord.Client();

const modulemanager = require('./modules/modulemanager/base')

const ModuleManager = new modulemanager(bot);

bot.login(token);

bot.on('ready', () => {
    console.log("Serveur connecté");
})


//var lobby = []

bot.on('message', (msg) => {
    /*let txt = msg.content.toLowerCase();

    let createCMD = ">create";
    //console.log(txt.substring(0, createCMD.length))
    
    */
    
})

