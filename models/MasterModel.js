const { model, Schema } = require('mongoose')

const masterSchema = new Schema({
    name: String,
    mail: String,
    avatar: String,
    link: String,
})

module.exports = model('Master', masterSchema)