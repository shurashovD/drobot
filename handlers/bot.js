const TelegramBot = require('node-telegram-bot-api')
const config = require('config')
const path = require('path')

const NoteModel = require('../models/NoteModel')
const MasterModel = require('../models/MasterModel')
const CompetitionModel = require('../models/CompetitionModel')

const token = config.get('tg-token')
const bot = new TelegramBot(token, {polling: true})

const state = new Map()

const start = () => {
    bot.on('message', async msg => {
        const chatId = msg.chat.id
        if (!state.get(chatId)) {
            const competitions = await CompetitionModel.find()
            const buttons = competitions.map(({name}) => name)
            state.set(chatId, { step: 'get_competition' })
            setTimeout(() => {
                state.delete(chatId)
            }, 300 * 1000)
            return bot.sendMessage(msg.chat.id, "Выберите мероприятие", {
                    "reply_markup": { "keyboard": [buttons] }
                }
            )
        }

        if ( state.get(chatId).step === 'get_competition' ) {
            const competition = await CompetitionModel.findOne({name: msg.text})
            if ( !competition ) {
                const competitions = await CompetitionModel.find()
                const buttons = competitions.map(({name}) => name)
                state.set(chatId, { step: 'get_competition' })
                setTimeout(() => {
                    state.delete(chatId)
                }, 300 * 1000)
                return bot.sendMessage(msg.chat.id, "Выберите мероприятие:", {
                    "reply_markup": {
                        "keyboard": [buttons]
                        }
                    }
                )
            }
            state.set(chatId, {
                step: 'get_mail',
                competitionId: competition._id
            })
            return bot.sendMessage(chatId, 'Введите почту, указанную при регистрации.')
        }

        if ( state.get(chatId).step === 'get_mail' ) {
            const master = await MasterModel.findOne({ mail: msg.text })
            if ( !master ) {
                return bot.sendMessage(chatId, 'Мастер с такой почтой не найден.')
            }
            const notes = await NoteModel.find({ competitionId: state.get(chatId).competitionId, master: master._id })
            const result = notes.reduce((arr, {scores}) => arr.concat(scores), [])
                .reduce((arr, {refereeScores}) => arr.concat(refereeScores), [])
                .map(({comment}) => comment)
                .filter(item => typeof item !== 'undefined')
                .map(item => `https://drobot-digital.ru${item.slice(7)}`)
            console.log(result[0])
            return bot.sendMessage(chatId, result[0])
        }

        bot.sendMessage(chatId, 'Нераспознанная команда')
    })
}

module.exports = start
