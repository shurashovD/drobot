const router = require('express').Router()

router.use('/get-dictionary', (req, res) => {
    res.json(global.dictionary)
})

module.exports = router