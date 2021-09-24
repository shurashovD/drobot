const { model, Schema } = require('mongoose')

const dictionarySchema = new Schema({
    lang: String,
    key: String,
    phrase: String
})

module.exports = model('Dictionary', dictionarySchema)