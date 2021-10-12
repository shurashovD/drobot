const router = require('express').Router()

const NoteModel = require('../models/NoteModel')
const MasterModel = require('../models/MasterModel')
const UserModel = require('../models/UserModel')

router.use('/', async (req, res) => {
    try {
        const categories = [
            { id: '6155f8b6217dc7c1d9cf9079', name: 'Волоски аппаратные' },   
            { id: '6155f9a8217dc7c1d9cf90aa', name: 'Перекрытие бровей' },
            { id: '6155f354217dc7c1d9cf8f8a', name: 'Брови: Юниор' },
            { id: '6155f50f98e45cfa72ec9714', name: 'Брови: Профи' },
            { id: '6155f52998e45cfa72ec9715', name: 'Брови: Профи ПЛЮС' },
            { id: '6155fe25217dc7c1d9cf90df', name: 'Губы: Юниор' },
            { id: '6155fe6f97366a2ec9495d04', name: 'Губы: Профи' },
            { id: '6155fe7897366a2ec9495d05', name: 'Губы: Профи ПЛЮС' },
            { id: '6155f687217dc7c1d9cf9055', name: 'Стрелка с растушёвкой' },    
            { id: '615600c8217dc7c1d9cf9194', name: 'Эксперт' }
        ]
        const gp = [
            {
                name: 'Юниор',
                categories: [
                    '6155f354217dc7c1d9cf8f8a',
                    '6155fe25217dc7c1d9cf90df'
                ] 
            },
            {
                name: 'Профи',
                categories: [
                    '6155f50f98e45cfa72ec9714',
                    '6155fe6f97366a2ec9495d04'
                ] 
            },
            {
                name: 'Профи ПЛЮС',
                categories: [
                    '6155f52998e45cfa72ec9715',
                    '6155fe7897366a2ec9495d05'
                ] 
            },
            {
                name: 'Эксперт',
                categories: [
                    '615600c8217dc7c1d9cf9194'
                ] 
            }
        ]
        const notes = await NoteModel.find({ completed: true })
        const masters = await MasterModel.find()
        const users = await UserModel.find()
        const main = categories.map(category => {
            const pedestal = notes.filter(note => note.category.toString() === category.id.toString())
                .map(note => {
                    const refereesScores = note.scores.reduce((arr, {refereeScores}) => arr.concat(refereeScores.map(({value}) => value)), [50, 0])
                    let value = refereesScores.reduce((sum, item) => sum + item, 0) / refereesScores.length
                    if (
                        note._id.toString() === '61589decb5d10c0aeb027d12'
                        || note._id.toString() === '6158a66bb5d10c0aeb02dbae'
                    ) {
                        value += 0.001
                    }
                    const { name } = masters.find(({_id}) => _id.toString() === note.master.toString())
                    const referees = note.scores.map(({referee, refereeScores}, index) => {
                        const name = users.find(({_id}) => _id.toString() === referee?.toString())?.name || `Судья ${index+1}`
                        const total = refereeScores.reduce((sum, item) => sum + item.value, 0)
                        return { name, total }
                    })
                    return { id: note._id, name, value, referees }
                })
                .sort((a, b) => b.value - a.value)
                /*.slice(0, 5)*/
                .map((item, index) => ({ ...item, value: Math.round(1000 * item.value) / 1000, place: index + 1 }))
            return { category: category.name, pedestal }
        })/*
        const grandPree = gp.map(gpItem => {
                //отобраные те, кто есть в основных
            const { name, value } = notes.filter(({category}) => gpItem.categories.some(item => item.toString() === category.toString()))
                // отобраны те, у кого есть еще одна категория кроме эксперта;
                .filter(note => {
                    return notes
                        .filter(({category}) => category.toString() !== '615600c8217dc7c1d9cf9194')
                        .some(item => (item._id.toString() !== note._id.toString()) && item.master.toString() === note.master.toString())
                })
                .map(note => {
                    const {name} = masters.find(({_id}) => _id.toString() === note.master.toString())
                    const values = notes.filter(({_id, master}) => (master.toString() === note.master.toString()) && (_id.toString() !== note._id.toString()))
                        .filter(({category}) => (gpItem.name === 'Эксперт') || (category.toString() !== '615600c8217dc7c1d9cf9194'))
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
        })*/
        res.render('index', {main})
    }
    catch (e) {
        console.log(e);
        res.render('index', {error: 'Ошибка'})
    }
})

module.exports = router