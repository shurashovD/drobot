const router = require('express').Router()
const mongoose = require('mongoose')

const Test = require('../models/TestModel')

router.use('/get-categories', (req, res) => {
    const categories = Test.find()
})

module.exports = router