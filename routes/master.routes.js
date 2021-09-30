const router = require('express').Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const parser = require('body-parser')

const MasterModel = require('../models/MasterModel')

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
          res.status(500).json({ message: 'Такое имя уже есть' })
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

      res.status(201).json({ message: 'Мастер создан' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
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

module.exports = router