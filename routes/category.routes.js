const router = require('express').Router()
const bodyParser = require('body-parser')

const CategoryModel = require('../models/CategoryModel')

router.get('/get-all', async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        res.json(categories)
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/add-category', bodyParser.json(), async (req, res) => {
    try {
        const { name, tasks } = req.body
        if ( name.length === 0 ) {
            return res.status(500).json({ message: 'Пустое имя категории' })
        }

        const cursor = await CategoryModel.findOne({ name })
        if ( cursor ) {
            return res.status(500).json({ message: 'Категория с таким именем уже существует' })
        }

        await CategoryModel({name, tasks: tasks.map(({name, description}) => ({name, description}))}).save()
        res.json({ message: 'Категория сохранена' })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update-category', bodyParser.json(), async (req, res) => {
    try {
        const { id, category } = req.body
        const { name, tasks } = category
        if ( name.length === 0 ) {
            return res.status(500).json({ message: 'Пустое имя категории' })
        }

        await CategoryModel.findByIdAndUpdate(id, {name, tasks: tasks.map(({name, description}) => ({name, description}))})
        res.json({ message: 'Категория обновлена' })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-category-by-id', bodyParser.json(), async (req, res) => {
    try {
        const { id } = req.body
        const category = await CategoryModel.findById(id)
        res.json(category)
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/remove-category', bodyParser.json(), async (req, res) => {
    try {
        const { id } = req.body
        await CategoryModel.findByIdAndDelete(id)
        res.json({ message: 'Категория удалена' })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router