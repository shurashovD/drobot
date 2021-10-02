const router = require('express').Router()
const parser = require('body-parser')

const CompetitionModel = require('../models/CompetitionModel')
const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')

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