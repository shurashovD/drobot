const router = require('express').Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const parser = require('body-parser')

const MasterModel = require('../models/MasterModel')
const NoteModel = require('../models/NoteModel')
const CompetitionModel = require('../models/CompetitionModel')
const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'static', 'avatars'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.random(100) + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.get('/get-all', async (req, res) => {
    try {
        const masters = await MasterModel.find()
        res.json(masters)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-master-by-id', parser.json(), async (req, res) => {
    try {
        const master = await MasterModel.findById(req.body.id)
        res.json(master)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/add-master', upload.single('avatar'), async (req, res) => {
    try {
      const { name, mail, link } = req.body

      const cursor = await MasterModel.findOne({ name })
      if ( cursor ) {
          if ( req.file ) {
              await fs.rm(path.join(__dirname, '..', 'static', 'avatars', req.file.filename))
          }
          return res.status(500).json({ message: 'Такое имя уже есть' })
      }

      const master = await MasterModel({ name, mail, link }).save()

      if ( req.file ) {
            const newName = master._id + path.extname(req.file.filename)
            await new Promise((resolve, reject) => {
                fs.rename(
                    path.join(__dirname, '..', 'static', 'avatars', req.file.filename),
                    path.join(__dirname, '..', 'static', 'avatars', newName),
                    err => {
                        if ( err ) {
                            reject(err)
                        }
                        resolve()
                    }
                )
            })
            
            master.avatar = '/static/avatars/' + newName
            await master.save()
      }

      return res.status(201).json({ message: 'Мастер создан' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update-master', upload.single('avatar'), async (req, res) => {
    try {
        const { name, mail, link, _id, avatar } = req.body

        if ( name.length === 0 ) {
          return res.status(500).json({ message: 'Пустое имя' })
        }

        const master = await MasterModel.findById(_id)
        const cursor = await MasterModel.findOne({ name, _id: {$ne: mongoose.Types.ObjectId(_id)} })
        if ( cursor ) {
            return res.status(500).json({ message: 'Такое имя уже есть' })
        }

        if ( master.avatar && (req.file || avatar === 'null') ) {
            const filePath = path.join(__dirname, '..', 'static', 'avatars', path.basename(master.avatar))
            await new Promise((resolve, reject) => {
                fs.access(filePath, fs.constants.F_OK, err => {
                    if ( !err ) {
                        fs.rm(filePath, err => {
                            if ( err ) {
                                reject('Ошибка удаления старого аватара')
                            }
                            resolve()
                        })
                    }
                })
            })
            master.avatar = null
        }

        if ( req.file ) {
            const newName = master._id + path.extname(req.file.filename)
            await new Promise((resolve, reject) => {
                fs.rename(
                    path.join(__dirname, '..', 'static', 'avatars', req.file.filename),
                    path.join(__dirname, '..', 'static', 'avatars', newName),
                    err => {
                        if ( err ) {
                            reject(err)
                        }
                        resolve()
                    }
                )
            })
            master.avatar = '/static/avatars/' + newName
        }
        master.name = name
        master.mail = mail
        master.link = link

        await master.save()

        res.status(201).json({ message: 'Мастер изменен' })
    }
    catch (e) {
        console.log(e) 
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/remove-master', parser.json(), async (req, res) => {
    try {
        const master = await MasterModel.findById(req.body.id)
        if ( master.avatar ) {
            const filePath = path.join(__dirname, '..', 'static', 'avatars', path.basename(master.avatar))
            fs.access(filePath, fs.constants.F_OK, err => {
                if ( !err ) {
                    fs.rm(filePath, err => {
                        if ( err ) {
                            console.log('Ошибка удаления аватара', filePath)
                        }
                    })
                }
            })
        }
        await MasterModel.deleteOne({_id: req.body.id})
        res.json({ message: 'Мастер удален' })
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/login', parser.json(), async (req, res) => {
    try {
        const { mail } = req.body
        if ( !mail || mail === '' ) {
            return res.status(500).json({ message: 'Пустая почта' })
        }
        const master = await MasterModel.findOne({ mail })
        if ( !master ) {
            return res.status(500).json({ message: 'Мастер с такой почтой не найден' })
        }
        return res.json(master.toObject())
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-comments', parser.json(), async (req, res) => {
    try {
        const { id } = req.body
        const notesByMaster = await NoteModel.find({ master: mongoose.Types.ObjectId(id) })
        const competitionsId = Array.from(new Set(notesByMaster.map(({competitionId}) => competitionId)))
            .map(item => mongoose.Types.ObjectId(item))

        const competitions = await CompetitionModel.find({ _id: { $in: competitionsId } })
        const users = await UserModel.find()
        const categories = await CategoryModel.find()
        const result = competitions.map(({_id, name}) => {
            const comments = notesByMaster.filter(({competitionId}) => competitionId.toString() === _id.toString())
                .map(item => {
                    const category = categories.find(({_id}) => _id.toString() === item.category.toString())
                    if ( !category ) {
                        return null
                    }

                    const items = item.scores.reduce((arr, {referee, refereeScores}) => {
                        const refereeName = users.find(({_id}) => _id.toString() === referee.toString() )?.name ?? ''
                        const elements = refereeScores.map(({_id, test, comment}) => {
                            const taskName = category.tasks.find(({_id}) => _id.toString() === test.toString())?.name ?? ''
                            return { _id, refereeName, taskName, link: comment }
                        }).filter(({link}) => !!link)
                        return arr.concat(elements)
                    }, [])
                    return { _id: item.category, categoryName: category.name, items }
                })
            return { _id, competition: name, comments }
        })
        return res.json(result)    
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router