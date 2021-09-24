const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const path = require('path')
const dictionaryModel = require('./models/DictionaryModel')

const app = express()

const start = async () => {
    const PORT = config.get('PORT') || 5000
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        global.dictionary = await dictionaryModel.find()
        app.listen(PORT, () => {
            console.log(`Server is running on PORT ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e);
    }
}

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/categories', require('./routes/category.routes'))

//app.use('/api/dictionary', require('./routes/dictionary.router'))

app.use('/api/users', require('./routes/user.routes'))

app.use('/api/competitions', require('./routes/competition.routes'))

//app.use('/api/masters', auth, require('./routes/master.routes'))

//app.use('/api/notes', auth, require('./routes/note.routes'))

//app.use('/results', require('./routes/result.routes'))

app.use('/admin/', express.static(path.join(__dirname, 'admin', 'build')))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

start()