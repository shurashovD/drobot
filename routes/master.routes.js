const router = require('express').Router()
const MasterModel = require('../models/MasterModel')

const log = require('../handlers/logger')

router.use('/get-all-masters', async (req, res) => {
    try {
        const masters = await MasterModel.find()
        res.json(masters)
    }
    catch (e) {
        log.error(e)
        const acceptLanguage = (req.headers['accept-language'])
        const enMessage = global.dictionary.find(({lang, key}) => (lang === 'EN' && key === 'serverError')).phrase
        const message = global.dictionary.find(({lang, key}) => (lang === acceptLanguage && key === 'serverError'))?.phrase ?? enMessage
        return res.status(500).json({ message })
    }
})

module.exports = router