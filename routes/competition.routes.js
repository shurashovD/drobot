const router = require('express').Router()
const parser = require('body-parser')

const CompetitionModel = require('../models/CompetitionModel')

const UserModel = require('../models/UserModel')

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

router.get('/get-all-competitions', async (req, res) => {
    try {
        const result = await CompetitionModel.find()
        res.json(result)
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})
/*
router.use('/get-competition-by-id', parser.json(), async (req, res) => {
    try {
        const competition = await CompetitionModel.findById(req.body.id)
        const users = await UserModel.find()
        
        const refereeSetting = competition.refereeSetting.map(({category, referees}) => ({
            category,
            referees: referees.map(({refereeId, role, hide}) => {
                const { _id, name, login, avatar } = users.find(({_id}) => _id.toString() === refereeId.toString())
                return {
                    _id, name, login, role, hide,
                    avatar: avatar ?? '/api/users/get-avatar/undef.jpeg'
                }
            })
        }))

        const screens = competition.screens?.map(item => {
            const {name, login, avatar} = users.find(({_id}) => _id.toString() === item.screenId.toString()) ?? {}
            return {...item._doc, name, login, avatar: avatar ?? '/api/users/get-avatar/undef.jpeg'}
        }) ?? []

        result = {
            _id: competition._id,
            competitionName: competition.competitionName,
            competitionPlace: competition.competitionPlace,
            competitionDate: competition.competitionDate,
            status: competition.status,
            refereeSetting, screens
        }

        res.json(result)
    }
    catch (e) {
        log.error(e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

router.use('/create-competition', parser.json(), async (req, res) => {
    try {
        const status = COMPETITION_STATUSES.created
        const { competitionName, competitionPlace, competitionDate } = req.body
        const refereeSetting = [
            {
                category: 'arrow',
                referees: []
            },
            {
                category: 'lips',
                referees: []
            },
            {
                category: 'feathering',
                referees: []
            },
            {
                category: 'hairTechnology',
                referees: []
            },
            {
                category: 'Microblading',
                referees: []
            }
        ]
        await CompetitionModel({ competitionName, competitionPlace, competitionDate, status, refereeSetting, screen: [] }).save()
        res.status(201).json({ message: 'Мероприятие создано' })
    }
    catch (e) {
        log.error('/api/competitions/create-competition', e)
        res.status(500).json({ message: 'SERVER ERROR' })
    }
})

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

router.use('/remove-competition', parser.json(), async (req, res) => {
  try {
    await CompetitionModel.deleteOne({_id: req.body.id})
    res.json({})
  }
  catch (e) {
    log.error(e)
    res.status(500).json({ message: 'Ошибка удаления мероприятия' })
  }
})
*/
module.exports = router