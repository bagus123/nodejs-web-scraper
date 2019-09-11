
let mongoose = require('mongoose');
let options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true 
};

let url = CONFIG.mongoDB.url
let conn = mongoose.createConnection(url, options)


const fs = require('fs')
const files = fs.readdirSync('./db/models/');

let models = {}
files.forEach(name => {
    if (!name.match(/\.js$/)) return
    if (name === 'index.js') return
    let model = require('./' + name)(conn)
    models[name.replace('.js', '')] = model
});

module.exports = models
