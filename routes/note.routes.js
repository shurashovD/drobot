const router = require('express').Router()
const mongoose = require('mongoose')
const parser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const { copyFile, rm } = require('fs/promises')
const path = require('path')
const config = require('config')

const MasterModel = require('../models/MasterModel')
const NoteModel = require('../models/NoteModel')
const CompetitionModel = require('../models/CompetitionModel')
const CategoryModel = require('../models/CategoryModel')
const TestModel = require('../models/TestModel')
const UserModel = require('../models/UserModel')

const COMP_ST = require('../types/competitionStatuses')
const ROLE = require('../types/refereeRoles')

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'tmp'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: photoStorage })
const photosUpload = upload.array('photo', 10)

const commentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'tmp'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const commentUpload = multer({ storage: commentStorage })
const commentUploadHandler = commentUpload.array('comment', 20)

router.post('/add-note', parser.json(), async (req, res) => {
    try {
        const { name, mail, category, rfid } = req.body.data
        let { masterId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        // нет запущенного мероприятия;
        if ( !competition ) {
            return res.status(500).json({ message: 'Нет запущенного мероприятия' })
        }

        const notes = await NoteModel.find({ competitionId: competition._id })
        const stage = competition.stages.find(({categories}) => categories.some(item => item.toString() === category.toString())) ?? [category]
        const lastNumberInCurrentCompetition = notes
            .filter(note => stage.some(item => item.toString() === note.category.toString()))
            .sort((a, b) => b.number - a.number)[0]?.number ?? 0

        // метка занята;
        if ( notes.some(item => (item.rfid === rfid && item.completed === false)) ) {
            return res.status(500).json({ message: 'Метка занята' })
        }
        
        // мастер уже зарегистророван в текущей категории;
        if (notes.some(item => (item.master?.toString() === masterId?.toString() && item.category.toString() === category.toString()))) {
            return res.status(500).json({ message: 'Мастер уже зарегистрирован в текущей категории' })
        }

        // создание мастера, если нет доступного masterId;
        let master = await MasterModel.findById(masterId)
        if ( !master ) {
            if ( !master ) {
                const candidate = await MasterModel.findOne({ name })
                if ( candidate ) {
                    return res.status(500).json({ message: 'Мастер с таким именем уже есть. Выберите его из выпадающего списка при регистрации' })
                }
                master = await MasterModel({name, mail}).save()
                masterId = master._id
            }
        }

        await NoteModel({
            competitionId: competition._id,
            master: masterId,
            number: lastNumberInCurrentCompetition + 1,
            category, rfid
        }).save()
        return res.json({ message: 'Участник зарегистрирован с номером ' + (lastNumberInCurrentCompetition + 1) })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-note-by-rfid', parser.json(), async (req, res) => {
    try {
        const { rfid } = req.body
        const notes = await NoteModel.aggregate([
            { $match: { rfid } },
            { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'fromCategories' } },
            { $lookup: { from: 'masters', localField: 'master', foreignField: '_id', as: 'fromMasters' } },
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", {
                category: { $arrayElemAt: [ "$fromCategories", 0 ] },
                master: { $arrayElemAt: [ "$fromMasters", 0 ] }
            } ] } } }
        ])
        if ( notes[0] ) {
            return res.json(notes[0])
        }
        return res.status(500).json({ message: 'Участник не найден...' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.use('/get-note-for-referee', parser.json(), async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    try {
        const { rfid } = req.body
        const note = await NoteModel.findOne({ rfid, completed: false })
        if ( !note ) {
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'errorReceivingPart')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'errorReceivingPart'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }
        const tasks = await TestModel.find({ testCategoryKey: note.category })
        res.json({ note, tasks })
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.post('/get-note-by-number', parser.json(), async (req, res) => {
    try {
        const { number, category } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            return res.status(500).json({ message: 'Нет запущенного мероприятия' })
        }
        
        const notes = await NoteModel.aggregate([
            {
                $match: { number: parseInt(number), competitionId: competition._id, category }
            },
            {
                $lookup: {
                    from: 'masters',
                    localField: 'master',
                    foreignField: '_id',
                    as: 'master'
                }
            }
        ])
    
        if ( notes[0] ) {
            return res.json(notes[0])
        }
        return res.status(500).json({ message: 'Участник не найден...' })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/upload-photos', photosUpload, async (req, res) => {
    try {
        const data = JSON.parse(req.body.note)
        const noteId = data._id
        const photos = data.photos

        const note = await NoteModel.findById(noteId)

        if ( req.files?.length > 0 && !note ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            res.status(500).json({ message: 'Ошибка! Фотографии не сохранены...' })
        }

        const delList = []
        for ( let i in note.photos ) {
            const photoSrc = note.photos[i]
            if ( !photos.some(item => item === photoSrc) ) {
                try {
                    await rm(path.join(__dirname, '..', 'static', 'uploads', noteId.toString(), path.basename(photoSrc)))
                }
                catch {}
                delList.push(photoSrc)
            }
        }
        note.photos = note.photos.filter(item => !delList.some(el => el === item))

        if ( req.files?.length > 0 ) {
            try {
                await new Promise((resolve, reject) => {
                    fs.access(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), fs.constants.F_OK, err => {
                        if ( err ) {
                            fs.mkdir(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), err => {
                                if ( err ) {
                                    reject()
                                }
                                else {
                                    resolve()
                                }
                            })
                        }
                        else {
                            resolve()
                        }
                    })
                })
            }
            catch {
                return res.status(500).json({ message: 'Ошибка создания каталога участника' })
            }

            const photos = []
            for ( let i in req.files ) {
                const file = req.files[i]
                try {
                    await copyFile(
                        path.join(__dirname, '..', 'tmp', file.originalname),
                        path.join(__dirname, '..', 'static', 'uploads', noteId.toString(), file.originalname)
                    )
                    await rm(path.join(__dirname, '..', 'tmp', file.originalname))
                    photos.push(`/static/uploads/${noteId.toString()}/${file.originalname}`)
                }
                catch (e) {
                    console.log(e)
                    await rm(path.join(__dirname, '..', 'tmp', file.originalname))
                }
            }
            note.photos = note.photos.concat(photos)
        }
        await note.save()
        return res.json({ message: 'Фотографии сохранены' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/set-hygienical-score', commentUploadHandler, async (req, res) => {
    try {
        const { data } = req.body
        const { userId } = JSON.parse(data)
        const { value } = JSON.parse(data).note.hygienicalScore
        const noteId = JSON.parse(data).note._id
        const user = await UserModel.findById(userId)
        if ( !user ) {
            return res.status(500)
        }
        
        const note = await NoteModel.findById(noteId)

        if ( req.files?.length > 0 && !note ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            res.status(500).json({ message: 'Ошибка! Оценка не сохранена...' })
        }

        if ( req.files?.length > 0 ) {
            try {
                await new Promise((resolve, reject) => {
                    fs.access(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), fs.constants.F_OK, err => {
                        if ( err ) {
                            fs.mkdir(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), err => {
                                if ( err ) {
                                    reject()
                                }
                                else {
                                    resolve()
                                }
                            })
                        }
                        else {
                            resolve()
                        }
                    })
                })
            }
            catch {
                return res.status(500).json({ message: 'Ошибка создания каталога участника' })
            }

            const file = req.files[0]
            try {
                await copyFile(
                    path.join(__dirname, '..', 'tmp', file.originalname),
                    path.join(__dirname, '..', 'static', 'uploads', noteId.toString(), `${user.name}.webm`)
                )
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            catch (e) {
                console.log(e)
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            note.hygienicalScore = {...note.toObject().hygienicalScore, comment: `/static/uploads/${noteId.toString()}/${user.name}.webm`}
        }
        note.hygienicalScore = {...note.toObject().hygienicalScore, value}
        await note.save()
        return res.json({ message: 'Оценка принята' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/set-previous-score', commentUploadHandler, async (req, res) => {
    try {
        const { data } = req.body
        const { userId } = JSON.parse(data)
        const { value } = JSON.parse(data).note.previousScore
        const noteId = JSON.parse(data).note._id
        const user = await UserModel.findById(userId)
        if ( !user ) {
            return res.status(500)
        }
        
        const note = await NoteModel.findById(noteId)

        if ( req.files?.length > 0 && !note ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            res.status(500).json({ message: 'Ошибка! Оценка не сохранена...' })
        }

        if ( req.files?.length > 0 ) {
            try {
                await new Promise((resolve, reject) => {
                    fs.access(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), fs.constants.F_OK, err => {
                        if ( err ) {
                            fs.mkdir(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), err => {
                                if ( err ) {
                                    reject()
                                }
                                else {
                                    resolve()
                                }
                            })
                        }
                        else {
                            resolve()
                        }
                    })
                })
            }
            catch {
                return res.status(500).json({ message: 'Ошибка создания каталога участника' })
            }

            const file = req.files[0]
            try {
                await copyFile(
                    path.join(__dirname, '..', 'tmp', file.originalname),
                    path.join(__dirname, '..', 'static', 'uploads', noteId.toString(), `${user.name}.webm`)
                )
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            catch (e) {
                console.log(e)
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            note.previousScore = {...note.toObject().previousScore, comment: `/static/uploads/${noteId.toString()}/${user.name}.webm`}
        }
        note.previousScore = {...note.toObject().previousScore, value}
        await note.save()
        return res.json({ message: 'Оценка принята' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/set-referee-scores', commentUploadHandler, async (req, res) => {

    try {
        const { scores, userId, noteId } = JSON.parse(req.body.data)

        const note = await NoteModel.findById(noteId)
        if ( !note ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            res.status(500).json({ message: 'Ошибка! Запись не найдена...' })
        }

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            return res.status(500).json({ message: 'Нет запущенного мероприятия' })
        }

        if (
            !competition.categories
            .find(({category}) => category.toString() === note.category.toString())
            ?.referees.some(({referee}) => referee.toString() === userId.toString())
        ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            return res.status(500).json({ message: 'Судья не допущен к судейству данной категории' })
        }

        if ( req.files?.length > 0 ) {
            try {
                await new Promise((resolve, reject) => {
                    fs.access(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), fs.constants.F_OK, err => {
                        if ( err ) {
                            fs.mkdir(path.join(__dirname, '..', 'static', 'uploads', noteId.toString()), err => {
                                if ( err ) {
                                    reject()
                                }
                                else {
                                    resolve()
                                }
                            })
                        }
                        else {
                            resolve()
                        }
                    })
                })
            }
            catch {
                return res.status(500).json({ message: 'Ошибка создания каталога участника' })
            }
        }

        const user = await UserModel.findById(userId)
        const category = await CategoryModel.findById(note.category)
        const oldRefereeScores = note.scores.find(({referee}) => referee.toString() === userId.toString())?.refereeScores ?? []
        const refereeScores = []
        for (let key in scores) {
            const oldComment = oldRefereeScores.find(({test}) => test.toString() === key)?.comment
            const fileOriginalname = `${noteId.toString()}_${userId.toString()}_${key}.webm`
            const taskName = category.tasks.find(({_id}) => _id.toString() === key)?.name ?? '_'
            const commentName = `${user.name}_${taskName}.webm`
            if ( req.files?.some(file => file.originalname === fileOriginalname) ) {
                await copyFile(
                    path.join(__dirname, '..', 'tmp', fileOriginalname),
                    path.join(__dirname, '..', 'static', 'uploads', noteId.toString(), commentName)
                )
                await rm(path.join(__dirname, '..', 'tmp', fileOriginalname))
                refereeScores.push({
                    test: mongoose.Types.ObjectId(key),
                    value: scores[key].value,
                    comment: `/static/uploads/${noteId.toString()}/${commentName}`
                })
            }
            else {
                if ( oldComment ) {
                    refereeScores.push({
                        test: mongoose.Types.ObjectId(key),
                        value: scores[key].value,
                        comment: oldComment
                    })
                }
                else {
                    refereeScores.push({
                        test: mongoose.Types.ObjectId(key),
                        value: scores[key].value
                    })
                }
            }
        }

        const index = note.scores.findIndex(({referee}) => referee.toString() === userId.toString())
        if ( index === -1 ) {
            note.scores.push({ referee: userId, refereeScores })
        }
        else {
            note.scores.splice(index, 1, { referee: userId, refereeScores })
        }
        if (
            competition.categories
            .find(({category}) => category.toString() === note.category.toString())
            ?.referees.length === note.scores.length
        ) {
            note.completed = true
            note.refereeTotal = note.scores
                .reduce((arr, {refereeScores}) => arr.concat(refereeScores), [])
                .reduce((sum, {value}) => sum + value, 0)
            note.total = note.refereeTotal + note.previousScore.value + note.hygienicalScore.value
            note.middle = Math.round(1000 * note.total / (note.scores.length + 2) / category.tasks.length) / 1000
        }
        note.lastReferee = userId
        await note.save()
        res.json({ message: 'Оценка принята' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-result', parser.json(), async (req, res) => {
    try {
        const { screenId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        if ( !competition ) {
            return res.status(500).json({ message: 'Нет запущенного мероприятия' })
        }

        const screen = competition.screens.find(({screen}) => screen.toString() === screenId.toString())
        if ( !screen ) {
            console.log('Экран не найден')
            return res.status(500).json({ message: 'Экран не найден' })
        }

        const notes = await NoteModel.aggregate([
            { $match: { competitionId: competition._id } },
            { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'fromCategories' } },
            { $lookup: { from: 'masters', localField: 'master', foreignField: '_id', as: 'fromMasters' } },
            { $replaceRoot: { newRoot: { $mergeObjects: [ "$$ROOT", {
                category: { $arrayElemAt: [ "$fromCategories", 0 ] },
                master: { $arrayElemAt: [ "$fromMasters", 0 ] }
            } ] } } }
        ])

        const users = await UserModel.find()
        const categories = await CategoryModel.find()

        const rows = notes
            .filter(({category}) => screen.categories.some(item => item.toString() === category.toString()))
            .filter( ({updatedAt}) => updatedAt >= ( Math.floor((Date.now / 1000) - 60) ) )
            .sort((a, b) => a.updatedAt - b.updatedAt)
            .slice(-4)
            .map(note => {
                const name = note.master.name ?? ''
                const referee = users.find(({_id}) => _id.toString() === note.lastReferee.toString())
                const scores = note.scores
                    .find(({referee}) => referee.toString() === note.lastReferee.toString())
                    ?.refereeScores.map(item => {
                        const test = categories
                            .find(({_id}) => _id.toString() === note.categoryId.toString())
                            ?.tasks.find(({_id}) => _id.toString() === item.test.toString())
                            ?.name ?? ''
                        return { test, value: item.value }
                    }) ?? []
                return { _id, name, referee, scores }
            })

        const tables = screen.categories.map(categoryId => {
            const category = categories.find(({_id}) => _id.toString() === categoryId.toString()).name
            const data = notes
                .filter(({category, completed}) => completed && category.toString() === categoryId.toString())
                .map(({_id, master, total}) => ({ _id, name: master.name, total }))
                .sort((a, b) => b.total - a.total)
            return { category, data }
        })

        const complete = notes
            .filter(({category}) => screen.categories.some(item => item.toString() === category.toString()))
            .filter( ({updatedAt}) => updatedAt >= ( Math.floor((Date.now / 1000) - 15) ) )
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 1)
            .map(note => {
                const scores = note.scores.map(score => {
                    const referee = users.find(({_id}) => _id.toString() === score.referee.toString())?.name ?? 'Имя судьи'
                    const refereeScores = score.refereeScores(item => ({
                        ...item, test: categories
                            .find(({_id}) => _id.toString() === note.category.toString())
                            ?.tasks.find(({_id}) => _id.toString() === item.test.toString())
                            ?.name ?? 'Критерий'
                    }))
                    return { referee, refereeScores }
                })
                return { _id: note._id, name: note.master.name, scores }
            })[0]

        res.json({ complete, rows, tables })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: e })
    }
})

router.use('/get-final-result', parser.json(), async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    try {
        const { screenId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        if ( !competition ) {
            log.error('Попытка получения экрана без запущенного мероприятия')
            return res.status(500).json({ title: '', result: [] })
        }

        const { category, final } = competition.screens?.find(item => item.screenId.toString() === screenId.toString()) ?? {}
        const { refereeSetting } = competition
        if ( !category ) {
            log.error(`Не удалось получить категорию для экрана ${screenId}`)
            return res.status(500).json({ title: '', result: [] })
        }

        if ( category === 'OFF' ) {
            return res.json({ title: '', result: [] })
        }

        const users = await UserModel.find()
        const masters = await MasterModel.find()

        const allReferees = refereeSetting.find(item => item.category === category)?.referees ?? []
        const targetReferees = final ? allReferees.filter(({role}) => role === ROLE.referee) : allReferees.filter(({hide, role}) => (!hide && (role === ROLE.referee)))

        const notes = await NoteModel.find({ competitionId: competition._id, category, completed: true })

        const result = notes.map(note => {
            const name = masters.find(({_id}) => _id.toString() === note.master.toString())?.name ?? 'Master'

            const scores = targetReferees.map(({refereeId}) => {
                const name = users.find(({_id}) => _id.toString() === refereeId.toString())?.name ?? 'Referee'
                const scoresByCurrReferee = note.scores.find(score => score.refereeId.toString() === refereeId.toString())?.refereeScores ?? []
                const value = scoresByCurrReferee.reduce((sum, item) => sum + item.value, 0)
                return { name, value }
            })

            const total = scores.reduce((sum, item) => sum + item.value, 0)

            return { noteId: note._id, name, scores, total }
        }).sort((a, b) => b.total - a.total).splice(0, final ? 4 : 5)
        
        res.json({ category, final, result })
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

module.exports = router