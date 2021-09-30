const router = require('express').Router()
const md5 = require('md5')
const parser = require('body-parser')

const User = require('../models/UserModel')
const CompetitionModel = require('../models/CompetitionModel')

const COMP_STATUS = require('../types/competitionStatuses')

router.use('/login', parser.json(), async (req, res) => {
    try {
        const {login, pass} = req.body
        const user = await User.findOne({login, pass: md5(pass)}).exec()
        if (user) {
            if ( login === 'ADMIN' ) {
                return res.json(user)
            }
            const competition = await CompetitionModel.findOne({ status: COMP_STATUS.started })
            if ( competition ) {
                const role = competition.categories
                    .reduce((arr, {referees}) => arr.concat(referees), [])
                    .find(({referee}) => referee.toString() === user._id.toString())?.role
                if ( role ) {
                    return res.json({...user._doc, role})
                }

                const screen = competition.screens.find(({screen}) => screen.toString() === user._id.toString())
                if ( screen ) {
                    return res.json({...user._doc, role: screen.role})
                }
                const message = 'Судья не допущен к судейству данной категории'
                return res.status(400).json({ message })
            }
            const message = 'Нет запущенного мероприятия'
            return res.status(400).json({ message })
        }
        else {
            const message = 'Неверные данные'
            return res.status(401).json({ message })
        }
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router