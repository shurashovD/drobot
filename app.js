const https = require('https')
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const fs = require('fs')
const path = require('path')
const dictionaryModel = require('./models/DictionaryModel')
const hbs = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: 'hbs'
})

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
            /*if ( process.env.NODE_ENV === 'production' ) {
                const options = {
                    cert: fs.readFileSync(path.join(__dirname, 'sslcert', 'fullchain.pem')),
                    key: fs.readFileSync(path.join(__dirname, 'sslcert', 'privkey.pem'))
                }
                https.createServer(options, app).listen(443, () => {
                    console.log(`Server is running on PORT ${PORT}...`)
                })
            }
            else {
                console.log(`Server is running on PORT ${PORT}...`)
            }*/
            console.log(`Server is running on PORT ${PORT}...`)
        })
    }
    catch (e) {
        console.log(e);
    }
}

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/categories', require('./routes/category.routes'))

app.use('/api/users', require('./routes/user.routes'))

app.use('/api/competitions', require('./routes/competition.routes'))

app.use('/api/masters', require('./routes/master.routes'))

app.use('/api/notes', require('./routes/note.routes'))

app.use(express.static(path.join(__dirname, 'static')))

app.use('/', require('./routes/result.routes'))

//app.use('/results', require('./routes/result.routes'))

start()