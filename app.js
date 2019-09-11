const path = require('path')




let config = require('./config/default')
if (process.env.NODE_ENV === 'development') {
    config = require('./config/development')
} else if (process.env.NODE_ENV === 'production') {
    config = require('./config/production')
} 

global.GLOBAL_PATH = path.resolve(__dirname)
global.CONFIG = config
global.MODELS = require(GLOBAL_PATH + '/db/models')


// ------------------------------------------------------------------------------
// TASK SCHEDULER
// ------------------------------------------------------------------------------
const scraper = require("./scraper")
const cron = require('cron')

// run for first time
// for development only, production use scheduler
if (process.env.NODE_ENV !== 'production') {
    scraper.run()
} 


new cron.CronJob({
    cronTime: '00 22 01 * * *', //runs everyday at 22.01
    onTick: scraper.run,
    start: false,
    timeZone: 'Asia/Jakarta'
})


