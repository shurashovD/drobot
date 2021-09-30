const router = require('express').Router()
const parser = require('body-parser')

const CompetitionModel = require('../models/CompetitionModel')
const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')

const COMPETITION_STATUSES = require('../types/competitionStatuses')
const COMPETITION_ROLES = require('../types/refereeRoles')

/*
router.get('/get-currrent-info', (req, res) => {
    try {
        res.json([])
    }
    catch (e) {
        log.error(e)
        return res.status(500).json({ message: 'Ошибка на сервере' })
    }
})*/

router.get('/get-all', async (req, res) => {
    try {
        const result = await CompetitionModel.find()
        res.json(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-competition-by-id', parser.json(), async (req, res) => {
    try {
        const competition = await CompetitionModel.findById(req.body.id).exec()
        if ( !competition ) {
            return res.status(500).json({ message: 'Ошибка получения мероприятия' })
        }
        const users = await UserModel.find().exec()
        const categories = await CategoryModel.find().exec()
        
        const result = {
            ...competition.toObject(),
            categories: competition.categories.map(item => {
                const category = categories.find(({_id}) => _id.toString() === item.category.toString()) ?? {}
                const referees = item.referees.map(refereeItem => {
                    const referee = users.find(({_id}) => _id.toString() === refereeItem.referee.toString()) ?? {}
                    return {...referee.toObject(), role: refereeItem.role}
                })
                return { category, referees }
            }),
            screens: competition.screens.map(item => {
                const screen = users.find(({_id}) => _id.toString() === item.screen.toString())
                const categs = item.categories.map(id => categories.find(({_id}) => _id.toString() === id.toString()))
                return { screen, categories: categs, role: item.role }
            })
        }

        res.json(result)
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/add-competition', parser.json(), async (req, res) => {
    try {
        const { competition } = req.body
        await CompetitionModel(competition).save()
        res.status(201).json({ message: 'Мероприятие создано' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update-competition', parser.json(), async (req, res) => {
    try {
        const { competition, id } = req.body
        await CompetitionModel.findByIdAndUpdate(id, competition)
        res.status(201).json({ message: 'Мероприятие обновлено' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

/*
router.use('/add-user-to-settings', parser.json(), async (req, res) => {
    try {
        const { category, userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        competition.refereeSetting.find(item => item.category === category).referees.push({
            refereeId: userId,
            role: COMPETITION_ROLES.referee,
            hide: false
        })
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error('/api/competiions/add-user-to-settings', e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/remove-user-from-settings', parser.json(), async (req, res) => {
    try {
        const { category, userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.refereeSetting.map(item => {
            return (item.category === category) ?
                {
                    category: item.category,
                    referees: item.referees.filter(({refereeId}) => refereeId.toString() !== userId.toString())
                }
                : item
        })
        competition.refereeSetting = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/settings-hide-referee', parser.json(), async (req, res) => {
    try {
        const { category, userId, competitionId, hide } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.refereeSetting.map(item => {
            return (item.category === category) ?
                {
                    category: item.category,
                    referees: item.referees.map(item => {
                        if (item.refereeId.toString() === userId.toString()) {
                            return {
                                _id: item._id,
                                refereeId: item.refereeId,
                                role: item.role,
                                hide
                            }
                        }
                        return item
                    })
                }
                : item
        })
        competition.refereeSetting = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/settings-set-role', parser.json(), async (req, res) => {
    try {
        const { category, userId, competitionId, role } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.refereeSetting.map(item => {
            return (item.category === category) ?
                {
                    category: item.category,
                    referees: item.referees.map(item => {
                        if (item.refereeId.toString() === userId.toString()) {
                            return {
                                _id: item._id,
                                refereeId: item.refereeId,
                                hide: item.hide,
                                role
                            }
                        }
                        return item
                    })
                }
                : item
        })
        competition.refereeSetting = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/settings-set-screen-category', parser.json(), async (req, res) => {
    try {
        const { category, userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.screens.map(item => (
            (item.screenId.toString() === userId.toString()) ? {...item._doc, category, final: false} : item
        ))
        competition.screens = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/settings-set-screen-role', parser.json(), async (req, res) => {
    try {
        const { role, userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.screens.map(item => (
            (item.screenId.toString() === userId.toString()) ? {...item._doc, role, final: false} : item
        ))
        competition.screens = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})


router.use('/settings-set-screen-final', parser.json(), async (req, res) => {
    try {
        const { userId, competitionId, final } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.screens.map(item => (
            (item.screenId.toString() === userId.toString()) ? {...item._doc, final} : item
        ))
        competition.screens = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/remove-screen-from-settings', parser.json(), async (req, res) => {
    try {
        const { userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        const result = competition.screens.filter(({screenId}) => screenId.toString() !== userId.toString())
        competition.screens = result
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/add-user-to-screens', parser.json(), async (req, res) => {
    try {
        const { userId, competitionId } = req.body
        const competition = await CompetitionModel.findById( competitionId )
        competition.screens.push({
            screenId: userId,
            role: COMPETITION_ROLES.screen,
            final: false
        })
        await competition.save()
        res.json({})
    }
    catch (e) {
        log.error('/api/competiions/add-user-to-settings', e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/settings-set-state', parser.json(), async (req, res) => {
    try {
        const { status, competitionId } = req.body
        await CompetitionModel.findByIdAndUpdate(competitionId, { status })
        res.json({})
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})
*/
router.post('/remove-competition', parser.json(), async (req, res) => {
    try {
        await CompetitionModel.deleteOne({_id: req.body.id})
        return res.json({ message: 'Мероприятие удалено' })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Ошибка удаления мероприятия' })
    }
})

module.exports = router