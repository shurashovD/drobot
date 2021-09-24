const { model, Schema } = require('mongoose')

const userSchema = new Schema({
    login: { type:  String, unique: true, required: true },
    pass: { type: String, required: true },
    avatar: String,
    name: { type: String, unique: true, required: true }
})

module.exports = model('User', userSchema)