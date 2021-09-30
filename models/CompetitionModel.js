const { model, Schema, Types } = require('mongoose')
const { created } = require('../types/competitionStatuses')
const { referee, screen } = require('../types/refereeRoles')

const competitionSchema = new Schema({
    name: String,
    status: { type: String, default: created },
    categories: [
        {
            category: { type: Types.ObjectId, ref: 'Category' },
            referees: [
                {
                    referee: { type: Types.ObjectId, ref: 'User' },
                    role: { type: String, default: referee }
                }
            ]
        }
    ],
    screens: [
        {
            screen: { type: Types.ObjectId, ref: 'User' },
            categories: [{ type: Types.ObjectId, ref: 'Category' }],
            role: { type: String, default: screen }
        }
    ],
    stages: [
        {
            number: Number,
            categories: [{ type: Types.ObjectId, ref: 'Category' }]
        }
    ]
})

module.exports = model('Competition', competitionSchema)