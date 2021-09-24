const router = require('express').Router()
const parser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const config = require('config')

const transporter = require('nodemailer').createTransport(config.transport)

const log = require('../handlers/logger')

const MasterModel = require('../models/MasterModel')
const NoteModel = require('../models/NoteModel')
const CompetitionModel = require('../models/CompetitionModel')
const TestModel = require('../models/TestModel')
const UserModel = require('../models/UserModel')

const COMP_ST = require('../types/competitionStatuses')
const ROLE = require('../types/refereeRoles')

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'photos'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.random(100) + path.extname(file.originalname))
    }
})
const upload = multer({ storage: photoStorage })
const photosUpload = upload.fields([{name: 'beforePhoto'}, {name: 'afterPhoto'}])

const commentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'comments'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.random(100) + path.extname(file.originalname))
    }
})
const commentUpload = multer({ storage: commentStorage })
const commentUploadHandler = commentUpload.array('comment')

const rmFile = filePath => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, err => {
            if ( !err ) {
                fs.rm(filePath, err => {
                    if ( err ) {
                        reject(err)
                    }
                    resolve()
                })
            }
            resolve()
        })
    })
}

const renameFile = (filePath, newPath) => {
    return new Promise((resolve, reject) => {
        fs.rename(filePath, newPath,
            err => {
                if ( err ) {
                    reject(err)
                }
                resolve()
            }
        )
    })
}

router.use('/add-note', parser.json(), async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    try {
        const { name, mail, category, rfid } = req.body
        let { masterId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        // нет запущенного мероприятия;
        if ( !competition ) {
            log.error('Попытка регистрации участника без запущенного мероприятия')
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'nonStartedCompetition')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'nonStartedCompetition'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }

        const notes = await NoteModel.find({ competitionId: competition._id })
        const lastNumberInCurrentCompetition = notes.sort((a, b) => b.number - a.number)[0]?.number ?? 0

        // метка занята;
        if ( notes.some(item => (item.rfid === rfid && item.completed === false)) ) {
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'rfidBisy')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'rfidBisy'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }
        
        // мастер уже зарегистророван в текущей категории;
        if (notes.some(item => (item.master?.toString() === masterId?.toString() && item.category === category))) {
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'partExistInCurrentCategory')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'partExistInCurrentCategory'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }

        // создание мастера, если нет доступного masterId;
        let master = await MasterModel.findById(masterId)
        if ( !master ) {
            if ( !master ) {
                const candidate = await MasterModel.findOne({ name })
                if ( candidate ) {
                    const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'registerMasterNameBisy')).phrase
                    const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'registerMasterNameBisy'))?.phrase ?? enMessage
                    return res.status(500).json({ message })
                }

                master = await MasterModel({
                    name, mail,
                    avatar: '/api/users/get-avatar/undef.jpeg',
                }).save()
                masterId = master._id
            }
        }

        await NoteModel({
            competitionId: competition._id,
            master: masterId,
            number: lastNumberInCurrentCompetition + 1,
            category, rfid
        }).save()
        return res.json({ message: lastNumberInCurrentCompetition + 1 })
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.use('/get-note-by-rfid', parser.json(), async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    try {
        const { rfid } = req.body
        const note = await NoteModel.findOne({ rfid, completed: false })
        if ( !note ) {
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'errorReceivingPart')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'errorReceivingPart'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }
        return res.json(note)
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
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

router.use('/get-note-by-number', parser.json(), async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    try {
        const { number } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            log.error('Попытка получения участника без запущенного мероприятия')
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'nonStartedCompetition')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'nonStartedCompetition'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }

        const note = await NoteModel.findOne({ number, competitionId: competition._id })
        res.json(note)
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.use('/upload-photo', photosUpload, async (req, res) => {
    const { noteId } = req.body
    const acceptLanguage = (req.headers['accept-language'])

    try {
        const note = await NoteModel.findById(noteId)

        if ( req.files && note ) {
            const beforePhoto = req.files['beforePhoto']?.[0]
            const afterPhoto = req.files['afterPhoto']?.[0]

            if ( beforePhoto ) {
                const beforePhotoNewName = noteId + '_before' + path.extname(beforePhoto.filename)
                await renameFile(
                    path.join(__dirname, '..', 'uploads', 'photos', path.basename(beforePhoto.filename)),
                    path.join(__dirname, '..', 'uploads', 'photos', beforePhotoNewName)
                )
                note.beforePhoto = '/api/notes/get-photo/' + beforePhotoNewName
            }

            if ( afterPhoto ) {
                const afterPhotoNewName = noteId + '_after' + path.extname(afterPhoto.filename)
                await renameFile(
                    path.join(__dirname, '..', 'uploads', 'photos', path.basename(afterPhoto.filename)),
                    path.join(__dirname, '..', 'uploads', 'photos', afterPhotoNewName)
                )
                note.afterPhoto = '/api/notes/get-photo/' + afterPhotoNewName
            }
            await note.save()
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'uploadPhotoComplete')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'uploadPhotoComplete'))?.phrase ?? enMessage
            return res.json({ message })
        }

        if ( req.files && !note ) {
            const beforePhoto = req.files['beforePhoto'][0]
            const afterPhoto = req.files['afterPhoto'][0]
            if ( beforePhoto ) {
                const filePath = path.join(__dirname, '..', 'uploads', 'photos', path.basename(beforePhoto.filename))
                await rmFile(filePath)
            }
            if ( afterPhoto ) {
                const filePath = path.join(__dirname, '..', 'uploads', 'photos', path.basename(afterPhoto.filename))
                await rmFile(filePath)
            }
            throw new Error(`Фотографии получены. Не найдена запись по id: ${noteId}`)
        }
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.use('/get-photo', (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', 'photos', path.basename(req.path))
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                throw new Error(`Ошибка отдачи фотографии ${req.path}`)
            }
            res.set('Cache-control', 'private, max-age=0, no-cache, must-revalidate').sendFile(filePath)
        })
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/get-comment', (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', 'comments', path.basename(req.path))
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                throw new Error(`Ошибка отдачи комментария ${req.path}`)
            }
            res.set('Cache-control', 'private, max-age=0, no-cache, must-revalidate').sendFile(filePath)
        })
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/set-hyhienical-score', commentUploadHandler, async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    const { noteId, value } = req.body

    try {
        const note = await NoteModel.findById(noteId)
        if ( !note ) {
            throw new Error(`Ошибка получения записи при сохранении данных гигиениста. NoteId=${noteId}`)
        }

        if ( req.files ) {
            const comment = req.files?.[0]

            if ( comment ) {
                const commentNewName = noteId + '_hyhienical.webm'
                await renameFile(
                    path.join(__dirname, '..', 'uploads', 'comments', path.basename(comment.filename)),
                    path.join(__dirname, '..', 'uploads', 'comments', commentNewName)
                )
                note.hyhienicalScore.comment = '/api/notes/get-comment/' + commentNewName
            }

            note.hyhienicalScore.value = value ?? 0
            await note.save()
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'pointsAreCounted')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'pointsAreCounted'))?.phrase ?? enMessage
            return res.json({ message })
        }
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.use('/set-referee-scores', commentUploadHandler, async (req, res) => {
    const acceptLanguage = (req.headers['accept-language'])
    const { noteId, tasks } = req.body
    const refereeId = req.headers.authorization?.split(' ')[1]

    try {
        const note = await NoteModel.findById(noteId)
        if ( !note ) {
            throw new Error(`Ошибка получения записи при сохранении данных гигиениста. NoteId=${noteId}`)
        }

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        // нет запущенного мероприятия;
        if ( !competition ) {
            log.error('Попытка регистрации участника без запущенного мероприятия')
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'nonStartedCompetition')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'nonStartedCompetition'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }

        if (!competition.refereeSetting.find(({category}) => category === note.category)?.referees.some(item => item.refereeId.toString() === refereeId.toString())) {
            log.error(`Попытка отсудить участника без допуска. Судья: ${refereeId}. Мероприятие: ${competition._id}`)
            const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'refereeNotAccess')).phrase
            const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'refereeNotAccess'))?.phrase ?? enMessage
            return res.status(500).json({ message })
        }

        const tasksArr = JSON.parse(tasks)
        for ( let i in tasksArr ) {
            const { _id, value} = tasksArr[i]
            const newScore = note.scores.find(score => score.refereeId.toString() === refereeId.toString()) ?? { refereeId, refereeScores: [] }
            const newRefereeScore = newScore.refereeScores.find(({testId}) => testId.toString() === _id.toString()) ?? { testId: _id, value }
            newRefereeScore.value = value

            const file = req.files?.find(({originalname}) => originalname === `${_id}.webm`)
            if ( file ) {
                await renameFile(file.path, path.join(__dirname, '..', 'uploads', 'comments', `${noteId}_${refereeId}_${file.originalname}`))
                newRefereeScore.comment = `/api/notes/get-comment/${noteId}_${refereeId}_${file.originalname}`
            }

            newScore.refereeScores = newScore.refereeScores.filter(({testId}) => testId.toString() !== _id.toString()).concat(newRefereeScore)
            note.scores = note.scores.filter(score => score.refereeId.toString() !== refereeId.toString()).concat(newScore)
        }

        const referees = competition.refereeSetting.find(({category}) => category === note.category).referees ?? []
        const roleFilterReferees = referees.filter(({role}) => role === ROLE.referee)
        note.completed = roleFilterReferees.every(referee => note.scores.some(score => score.refereeId.toString() === referee.refereeId.toString()))

        await note.save()
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'pointsAreCounted')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'pointsAreCounted'))?.phrase ?? enMessage
        res.json({ message })

        if ( note.completed ) {
            const attachments = []
            scores.forEach(score => {
                const { refereeScores } = score
                refereeScores.forEach(item => {
                    if ( Boolean(item.comment) )
                    attachments.push({ path: item.comment })
                })
            })

            if ( Boolean(note.beforePhoto) ) attachments.push({ path: note.beforePhoto })
            if ( Boolean(note.afterPhoto) ) attachments.push({ path: note.afterPhoto })
            if ( Boolean(note.hyhienicalScore.comment) ) attachments.push({ path: note.hyhienicalScore.comment })

            const master = MasterModel.findById(note.master.toString())

            await transporter.sendMail({...config.mailData, attachments, text: master?.mail })
        }
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

router.use('/get-result', parser.json(), async (req, res) => {
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
        }).sort((a, b) => b.total - a.total)
        
        res.json({ category, final, result })
    }
    catch (e) {
        log.error(e)
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
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