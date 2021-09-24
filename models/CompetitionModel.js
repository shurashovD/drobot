const { model, Schema, Types } = require('mongoose')
const { feathering } = require('../types/categoryTypes')
const { screen } = require('../types/refereeRoles')

const competitionSchema = new Schema({
    competitionName: String,
    competitionPlace: String,
    competitionDate: {
        from: Date,
        to: Date
    },
    status: String,
    refereeSetting: [
        {
            category: String,
            referees: [
                {
                    refereeId: { type: Types.ObjectId, ref: 'User' },
                    role: String,
                    hide: Boolean
                }
            ]
        }
    ],
    screens: [
        {
            screenId: { type: Types.ObjectId, ref: 'User' },
            final: { type: Boolean, default: false },
            category: { type: String, default: feathering },
            role: { type: String, default: screen }
        }
    ]
})

module.exports = model('Competition', competitionSchema)