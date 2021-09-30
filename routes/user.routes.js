const router = require('express').Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const parser = require('body-parser')
const md5 = require('md5')

const UserModel = require('../models/UserModel')

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
        const users = await UserModel.find({login: {$ne: 'ADMIN'}})
        res.json(users)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/add-user', upload.single('avatar'), async (req, res) => {
    try {
      const { name, login, pass } = req.body

      let candidate = await UserModel.findOne({ login })
      if ( candidate ) {
          if ( req.file ) {
              await fs.rm(path.join(__dirname, '..', 'static', 'avatars', req.file.filename))
          }
          res.status(500).json({ message: 'Такой логин уже есть' })
      }

      candidate = await UserModel.findOne({ name })
      if ( candidate ) {
          if ( req.file ) {
              await fs.rm(path.join(__dirname, '..', 'static', 'avatars', req.file.filename))
          }
          res.status(500).json({ message: 'Такое имя уже есть' })
      }

      const user = await UserModel({ name, login, pass: md5(pass) }).save()
      if ( req.file ) {
        const newName = user._id + path.extname(req.file.filename)
        await new Promise((resolve, reject) => {
          fs.rename(
            path.join(__dirname, '..', 'static', 'avatars', req.file.filename),
            path.join(__dirname, '..', 'static', 'avatars', newName),
            err => {
            if ( err ) {
              reject(err)
            }
            resolve()
          })
        })
        
        user.avatar = '/static/avatars/' + newName
        await user.save()
      }

      res.status(201).json({ message: 'Пользователь создан' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-user-by-id', parser.json(), async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.id)
        res.json(user)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update-user', upload.single('avatar'), async (req, res) => {
    try {
        const { name, login, pass, _id, avatar } = req.body

        if ( login.length === 0 ) {
          return res.status(500).json({ message: 'Пустой логин' })
        }

        const user = await UserModel.findById(_id)
        let cursor = await UserModel.findOne({ login, _id: {$ne: mongoose.Types.ObjectId(_id)} })
        if ( cursor ) {
            return res.status(500).json({ message: 'Такой логин уже есть' })
        }

        if ( name.length > 0 ) {
            cursor = await UserModel.findOne({ name, _id: {$ne: mongoose.Types.ObjectId(_id)} })
            if ( cursor ) {
                return res.status(500).json({ message: 'Такое имя уже есть' })
            }
        }

        if ( user.avatar && (req.file || avatar === 'null') ) {
            const filePath = path.join(__dirname, '..', 'static', 'avatars', path.basename(user.avatar))
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
            user.avatar = null
        }

        if ( req.file ) {
            const newName = user._id + path.extname(req.file.filename)
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
            user.avatar = '/static/avatars/' + newName
        }
        user.name = name
        user.login = login
        if ( pass.length > 0 ) {
            user.pass = md5(pass)
        }
        await user.save()

        res.status(201).json({ message: 'Пользователь изменен' })
    }
    catch (e) {
        console.log(e) 
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/remove-user', parser.json(), async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.id)
        if ( user.avatar ) {
            const filePath = path.join(__dirname, '..', 'static', 'avatars', path.basename(user.avatar))
            fs.access(filePath, fs.constants.F_OK, err => {
                if ( !err ) {
                    fs.rm(filePath, err => {
                        if ( err ) {
                            console.log('/api/users/remove-user', 'Ошибка удаления аватара', filePath)
                        }
                    })
                }
            })
        }
        await UserModel.deleteOne({_id: req.body.id})
        res.json({ message: 'Пользователь удален' })
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.use('/get-user-by-name-fragment', parser.json(), async (req, res) => {
  try {
    const result = await UserModel.find()
    const response = result.filter(({name}) => name.toLowerCase().includes(req.body.fragment.toLowerCase()))
    res.json(response)
  }
  catch (e) {
    log.error('/api/users/get-user-by-name-fragmen', e)
    res.status(500).json({ message: 'SERVER ERROR' })
  }
})

module.exports = router