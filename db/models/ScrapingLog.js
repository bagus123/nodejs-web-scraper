let mongoose = require('mongoose')
let Schema = mongoose.Schema

module.exports = function (conn) {

    const scrapingLogSchema = new Schema({
        source: {
            type: String,
            required: true,
            trim: true
        },
        url: {
            type: String,
            required: true,
        },
        page: {
            type: Number,
            required: true,
        }

    })


    const ScrapingLog = conn.model("ScrapingLog", scrapingLogSchema)
    return ScrapingLog
}
