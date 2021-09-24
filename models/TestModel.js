const { model, Schema } = require('mongoose')

const testSchema = new Schema({
    testNameKey: String,
    testDescriptionKey: String,
    testCategoryKey: String,
})

module.exports = model('Test', testSchema)