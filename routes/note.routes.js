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

router.get('/get-all-in-current-competition', parser.json(), async (req, res) => {
    try {
        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const notes = await NoteModel.find({ competitionId: competition._id })

        const result = notes.map(note => {
            const category = categories.find(({_id}) => _id.toString() === note.category.toString())
            const master = masters.find(({_id}) => _id.toString() === note.master.toString())
            return { ...note.toObject(), category, master }
        })

        res.json(result)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.get('/get-avail-to-register', parser.json(), async (req, res) => {
    try {
        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const notes = await NoteModel.find({
            competitionId: competition._id,
            rfid: { $exists: false },
            myModel: { $eq: true },
            completed: { $ne: true }
        })

        const result = notes.map(note => {
            const category = categories.find(({_id}) => _id.toString() === note.category.toString())
            const master = masters.find(({_id}) => _id.toString() === note.master.toString())
            return { ...note.toObject(), category, master }
        })

        res.json(result)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-all', parser.json(), async (req, res) => {
    try {
        const { competitionId } = req.body
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const notes = await NoteModel.find({ competitionId: mongoose.Types.ObjectId(competitionId) })

        const result = notes.map(note => {
            const category = categories.find(({_id}) => _id.toString() === note.category.toString())
            const master = masters.find(({_id}) => _id.toString() === note.master.toString())
            return { ...note.toObject(), category, master }
        })

        res.json(result)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/add-note', parser.json(), async (req, res) => {
    try {
        const { name, mail, category, rfid } = req.body.data
        let { masterId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        // ?????? ?????????????????????? ??????????????????????;
        if ( !competition ) {
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
        }

        const notes = await NoteModel.find({ competitionId: competition._id })
        const stage = competition.stages.find(({categories}) => categories.some(item => item.toString() === category.toString())) ?? [category]
        const lastNumberInCurrentCompetition = notes
            .filter(note => stage.some(item => item.toString() === note.category.toString()))
            .sort((a, b) => b.number - a.number)[0]?.number ?? 0

        // ?????????? ????????????;
        if ( notes.some(item => (item.rfid === rfid && item.completed === false)) ) {
            return res.status(500).json({ message: '?????????? ????????????' })
        }
        
        // ???????????? ?????? ?????????????????????????????? ?? ?????????????? ??????????????????;
        if (notes.some(item => (item.master?.toString() === masterId?.toString() && item.category.toString() === category.toString()))) {
            return res.status(500).json({ message: '???????????? ?????? ?????????????????????????????? ?? ?????????????? ??????????????????' })
        }

        // ???????????????? ??????????????, ???????? ?????? ???????????????????? masterId;
        let master = await MasterModel.findById(masterId)
        if ( !master ) {
            if ( !master ) {
                const candidate = await MasterModel.findOne({ name })
                if ( candidate ) {
                    return res.status(500).json({ message: '???????????? ?? ?????????? ???????????? ?????? ????????. ???????????????? ?????? ???? ?????????????????????? ???????????? ?????? ??????????????????????' })
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
        return res.json({ message: '???????????????? ?????????????????????????????? ?? ?????????????? ' + (lastNumberInCurrentCompetition + 1) })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/prev-register', parser.json(), async (req, res) => {
    try {
        const { competitionId } = req.body
        const prevNote = req.body.note

        const competition = await CompetitionModel.findById(competitionId)

        if ( !competition ) {
            return res.status(500).json({ message: '?????????????????????? ???? ??????????????' })
        }

        let notesByMaster = await NoteModel.find({ master: prevNote.master._id, competitionId: competition._id })
        for ( let i in notesByMaster ) {
            const note = notesByMaster[i]
            if ( !prevNote.categories.some(({category}) => category.toString() === note.category.toString()) ) {
                await NoteModel.findByIdAndDelete(note._id)
            }
        }
        for ( let i in prevNote.categories ) {
            const category = prevNote.categories[i].category
            const myModel = prevNote.categories[i].myModel
            if ( !notesByMaster.some(note => note.category.toString() === category.toString()) ) {
                await NoteModel({ competitionId: competition._id, master: prevNote.master._id, category, myModel }).save()
            }
        }
        notesByMaster = await NoteModel.find({ master: prevNote.master._id, competitionId: competition._id })
        for ( let i in notesByMaster ) {
            const note = notesByMaster[i]
            note.myModel = prevNote.categories.find(({category}) => category.toString() === note.category.toString())?.myModel ?? false
            note.save()
        }

        const notes = await NoteModel.find({ competitionId: competition._id })

        const stages = competition.toObject().stages
            .map(stage => {
                const stageNotes = notes.filter(({category}) => stage.categories.some(item => category.toString() === item.toString()))
                return { stage, stageNotes }
            })
            .sort((a, b) => b.stageNotes.length - a.stageNotes.length)

        const stageTables = stages.reduce((result, item) => {
            const copy = result.slice()
            for ( let i in item.stageNotes ) {
                const note = item.stageNotes[i]
                const myStageNumber = item.stage.number
                const myStage = copy.find(({number}) => number === myStageNumber)
                if ( myStage.tables.some(table => table?.toString() === note.master.toString()) ) {
                    continue
                }
                const notesByMaster = notes.filter(({master}) => master.toString() === note.master.toString())
                const masterStageNumbers = competition.toObject().stages
                    .filter(({categories}) => {
                        return categories.some(cId => {
                            return notesByMaster.some(n => {
                                if ( n.category.toString() === cId.toString() ) {
                                    return true
                                }
                                return false
                            })
                        })
                    })
                    .map(({number}) => number)
                const index = myStage.tables.findIndex((table, i) => {
                    if (table === null) {
                        const myStages = copy.filter(({number}) => masterStageNumbers.some(num => num === number))
                        if ( myStages.every(({tables}) => tables[i] === null) ) {
                            return true
                        }
                    }
                    return false
                })
                copy.forEach(({number, tables}) => {
                    if ( masterStageNumbers.some(item => item === number) ) {
                        tables[index] = note.master._id
                    }
                })
            }
            return copy
        }, stages.map(({stage}) => ({ number: stage.number, tables: Array.from({ length: stages[0].stageNotes.length }, () => null) })))

        for ( let i in notes ) {
            const note = notes[i]
            note.number = stageTables.find(item => item.tables.some(table => table?.toString() === note.master.toString()))
                .tables.findIndex(item => item?.toString() === note.master.toString()) + 1
            await note.save()
        }

        return res.json({ message: '???????????????? ??????????????????????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/set-rfid', parser.json(), async (req, res) => {
    try {
        const { category, phone, rfid, noteId, random } = req.body

        const note = await NoteModel.findById(noteId)
        if ( !random && note.rfid?.length > 0 ) {
            return res.status(500).json({ message: '?? ?????????????? ?????? ???????????????? ???????????????? ?? ?????????????? ??????????????????????' })
        }

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
        }

        let cursor = await NoteModel.findOne({ competitionId: competition._id, completed: false, rfid })
        if ( cursor ) {
            return res.status(500).json({ message: '?????????? ????????????' })
        }

        if ( random ) {
            const notes = await NoteModel.find({
                competitionId: competition._id,
                category: mongoose.Types.ObjectId(category),
                rfid: { $exists: false },
                myModel: { $ne: true }
            })
            if ( notes.length === 0 ) {
                return res.status(500).json({ message: '????????????! ?????? ?????????????????? ???????????????? ?? ???????????? ??????????????????...' })
            }
            const randomIndex = Math.floor(Math.random() * notes.length)
            const note = notes[randomIndex]
            note.rfid = rfid
            note.phone = phone
            await note.save()
            return res.json({ message: `??????????????????. ?????????? ?????????? ??????????????: ${note.number}` })
        }

        note.rfid = rfid
        note.phone = phone
        await note.save()

        return res.json({ message: `??????????????????. ?????????? ?????????? ??????????????: ${note.number}` })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-by-master', parser.json(), async (req, res) => {
    try {
        const { competitionId, masterId } = req.body
        const categories = await CategoryModel.find()
        const master = await MasterModel.findById(masterId)
        const notes = await NoteModel.find({ competitionId: mongoose.Types.ObjectId(competitionId), master: master._id })

        const result = notes.map(note => {
            const category = categories.find(({_id}) => _id.toString() === note.category.toString())
            return { ...note.toObject(), category, master }
        })

        res.json(result)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/rm-by-master', parser.json(), async (req, res) => {
    try {
        const { competitionId, masterId } = req.body
        await NoteModel.deleteMany({ competitionId, master: masterId })
        res.json({ message: '???????????????? ????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-note-by-rfid', parser.json(), async (req, res) => {
    try {
        const { rfid } = req.body
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const note = await NoteModel.findOne({ rfid, completed: false })
        if ( !note ) {
            return res.status(500).json({ message: '???????????? ??????????' })
        }
        const category = categories.find(({_id}) => _id.toString() === note.category.toString())
        const master = masters.find(({_id}) => _id.toString() === note.master.toString())
        note.category = category
        note.master = master
        return res.json(note)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-note-by-number', parser.json(), async (req, res) => {
    try {
        const { number, category } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
        }
        
        const note = await NoteModel.findOne({ category: mongoose.Types.ObjectId(category), number })
        if ( !note ) {
            return res.json({ none: true })
        }
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const result = note.toObject()
        result.category = categories.find(({_id}) => _id.toString() === note.category.toString())
        result.master = masters.find(({_id}) => _id.toString() === note.master.toString())
        return res.json(result)
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-note-for-hygienical', parser.json(), async (req, res) => {
    try {
        const { number, category } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
        }
        
        const note = await NoteModel.findOne({ category: mongoose.Types.ObjectId(category), number, rfid: {$exists: true}, completed: false })
        if ( !note ) {
            return res.json({ none: true })
        }
        const categories = await CategoryModel.find()
        const masters = await MasterModel.find()
        const result = note.toObject()
        result.category = categories.find(({_id}) => _id.toString() === note.category.toString())
        result.master = masters.find(({_id}) => _id.toString() === note.master.toString())
        return res.json(result)
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
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
            res.status(500).json({ message: '????????????! ???????????????????? ???? ??????????????????...' })
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
                return res.status(500).json({ message: '???????????? ???????????????? ???????????????? ??????????????????' })
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
        return res.json({ message: '???????????????????? ??????????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/set-hygienical-score', commentUploadHandler, async (req, res) => {
    try {
        const { data } = req.body
        const { userId } = JSON.parse(data)
        const { hygienicalScore, previousScore } = JSON.parse(data).note
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
            res.status(500).json({ message: '????????????! ???????????? ???? ??????????????????...' })
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
                return res.status(500).json({ message: '???????????? ???????????????? ???????????????? ??????????????????' })
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
        note.hygienicalScore = {...note.toObject().hygienicalScore, value: hygienicalScore.value, referee: userId}
        note.previousScore = {...note.toObject().previousScore, value: previousScore.value, referee: userId}
        await note.save()
        return res.json({ message: '???????????? ??????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
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
            res.status(500).json({ message: '????????????! ???????????? ???? ??????????????????...' })
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
                return res.status(500).json({ message: '???????????? ???????????????? ???????????????? ??????????????????' })
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
        note.previousScore = {...note.toObject().previousScore, value, referee: userId}
        await note.save()
        return res.json({ message: '???????????? ??????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
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
            res.status(500).json({ message: '????????????! ???????????? ???? ??????????????...' })
        }

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })
        if ( !competition ) {
            for ( let i in req.files ) {
                const file = req.files[i]
                await rm(path.join(__dirname, '..', 'tmp', file.originalname))
            }
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
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
            return res.status(500).json({ message: '?????????? ???? ?????????????? ?? ?????????????????? ???????????? ??????????????????' })
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
                return res.status(500).json({ message: '???????????? ???????????????? ???????????????? ??????????????????' })
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
            ?.referees.filter(({role}) => role === ROLE.referee)
            ?.length === note.scores.length
        ) {
            note.completed = true
            note.refereeTotal = note.scores
                .reduce((arr, {refereeScores}) => arr.concat(refereeScores), [])
                .reduce((sum, {value}) => sum + value, 0)
            note.total = note.refereeTotal + note.previousScore.value + note.hygienicalScore.value
            note.middle = Math.round(1000 * note.total / (note.scores.length + 1.2) / category.tasks.length) / 1000
        }
        note.lastReferee = userId
        await note.save()
        res.json({ message: '???????????? ??????????????' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: '??????-???? ?????????? ???? ??????...' })
    }
})

router.post('/get-result', parser.json(), async (req, res) => {
    try {
        const { screenId } = req.body

        const competition = await CompetitionModel.findOne({ status: COMP_ST.started })

        if ( !competition ) {
            return res.status(500).json({ message: '?????? ?????????????????????? ??????????????????????' })
        }

        const screen = competition.screens.find(({screen}) => screen.toString() === screenId.toString())
        if ( !screen ) {
            console.log('?????????? ???? ????????????')
            return res.status(500).json({ message: '?????????? ???? ????????????' })
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
                    const referee = users.find(({_id}) => _id.toString() === score.referee.toString())?.name ?? '?????? ??????????'
                    const refereeScores = score.refereeScores(item => ({
                        ...item, test: categories
                            .find(({_id}) => _id.toString() === note.category.toString())
                            ?.tasks.find(({_id}) => _id.toString() === item.test.toString())
                            ?.name ?? '????????????????'
                    }))
                    return { referee, refereeScores }
                })
                const hygienicalName = users.find(({_id}) => _id.toString() === note.hygienicalScore.referee?.toString())?.name
                const hygienical = hygienicalName ? { name: hygienicalName, value: note.hygienicalScore.value } : null
                const previousName = users.find(({_id}) => _id.toString() === note.previousScore.referee?.toString())?.name
                const previous = hygienicalName ? { name: previousName, value: note.previousScore.value } : null
                return { _id: note._id, name: note.master.name, scores, hygienical, previous }
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
            log.error('?????????????? ?????????????????? ???????????? ?????? ?????????????????????? ??????????????????????')
            return res.status(500).json({ title: '', result: [] })
        }

        const { category, final } = competition.screens?.find(item => item.screenId.toString() === screenId.toString()) ?? {}
        const { refereeSetting } = competition
        if ( !category ) {
            log.error(`???? ?????????????? ???????????????? ?????????????????? ?????? ???????????? ${screenId}`)
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

router.get('/get-evalution', async (req, res) => {
    try {
        const categories = [
            /*{ id: '6155f8b6217dc7c1d9cf9079', name: '?????????????? ????????????????????' },   
            { id: '6155f9a8217dc7c1d9cf90aa', name: '???????????????????? ????????????' },
            { id: '6155f354217dc7c1d9cf8f8a', name: '??????????: ??????????' },
            { id: '6155f50f98e45cfa72ec9714', name: '??????????: ??????????' },
            { id: '6155f52998e45cfa72ec9715', name: '??????????: ?????????? ????????' },
            { id: '6155fe25217dc7c1d9cf90df', name: '????????: ??????????' },
            { id: '6155fe6f97366a2ec9495d04', name: '????????: ??????????' },*/
            { id: '6155fe7897366a2ec9495d05', name: '????????: ?????????? ????????' },
            { id: '6155f687217dc7c1d9cf9055', name: '?????????????? ?? ??????????????????????' },    
            { id: '615600c8217dc7c1d9cf9194', name: '??????????????' }
        ]
        const gp = [
            {
                name: '??????????',
                categories: [
                    '6155f354217dc7c1d9cf8f8a',
                    '6155fe25217dc7c1d9cf90df'
                ] 
            },
            {
                name: '??????????',
                categories: [
                    '6155f50f98e45cfa72ec9714',
                    '6155fe6f97366a2ec9495d04'
                ] 
            },
            {
                name: '?????????? ????????',
                categories: [
                    '6155f52998e45cfa72ec9715',
                    '6155fe7897366a2ec9495d05'
                ] 
            },
            {
                name: '??????????????',
                categories: [
                    '615600c8217dc7c1d9cf9194'
                ] 
            }
        ]
        const notes = await NoteModel.find({ completed: true })
        const masters = await MasterModel.find()
        const main = categories.map(category => {
            const pedestal = notes.filter(note => note.category.toString() === category.id.toString())
                .map(note => {
                    const refereesScores = note.scores.reduce((arr, {refereeScores}) => arr.concat(refereeScores.map(({value}) => value)), [50, 0])
                    const value = refereesScores.reduce((sum, item) => sum + item, 0) / refereesScores.length
                    const { name } = masters.find(({_id}) => _id.toString() === note.master.toString())
                    return { name, value, photo: note.photos }
                })
                .sort((a, b) => b.value - a.value)
                /*.slice(0, 5)*/
                .map(item => ({ ...item, value: item.value }))
            return { category: category.name, pedestal }
        })
        const grandPree = gp.map(gpItem => {
                //?????????????????? ????, ?????? ???????? ?? ????????????????
            const { name, value } = notes.filter(({category}) => gpItem.categories.some(item => item.toString() === category.toString()))
                // ???????????????? ????, ?? ???????? ???????? ?????? ???????? ?????????????????? ?????????? ????????????????;
                .filter(note => {
                    return notes
                        .filter(({category}) => category.toString() !== '615600c8217dc7c1d9cf9194')
                        .some(item => (item._id.toString() !== note._id.toString()) && item.master.toString() === note.master.toString())
                })
                .map(note => {
                    const {name} = masters.find(({_id}) => _id.toString() === note.master.toString())
                    const values = notes.filter(({_id, master}) => (master.toString() === note.master.toString()) && (_id.toString() !== note._id.toString()))
                        .filter(({category}) => (gpItem.name === '??????????????') || (category.toString() !== '615600c8217dc7c1d9cf9194'))
                        .map(note => {
                            const refereesScores = note.scores.reduce((arr, {refereeScores}) => arr.concat(refereeScores.map(({value}) => value)), [50, 0])
                            return refereesScores.reduce((sum, item) => sum + item, 0) / refereesScores.length
                        })
                    const refereesScores = note.scores.reduce((arr, {refereeScores}) => arr.concat(refereeScores.map(({value}) => value)), [50, 0])
                    const value = refereesScores.reduce((sum, item) => sum + item, 0) / refereesScores.length + Math.max(...values)
                    return { name, value }
                })
                .sort((a, b) => b.value - a.value)[0]
            return { grandPreeName: gpItem.name, winnerName: name, winnerScore: Math.round(1000 * value) / 1000 }
        })
        res.json({main, grandPree})
    }
    catch (e) {
        console.log(e);
        res.json([])
    }
})

module.exports = router