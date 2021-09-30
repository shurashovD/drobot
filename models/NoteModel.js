const { model, Types, Schema } = require('mongoose')

const noteSchema = new Schema(
    {
        category: { type: Types.ObjectId, ref: 'Category' },
        competitionId: { type: Types.ObjectId, ref: 'Competition' },
        completed: { type: Boolean, default: false },
        hygienicalScore: {
            value: { type: Number, default: 0 }, comment: String
        },
        lastReferee: { type: Types.ObjectId, ref: 'User' },
        master: { type: Types.ObjectId, ref: 'Master' },
        middle: { type: Number, default: 0 },
        number: Number,
        photos: [String],
        previousScore: {
            value: { type: Number, default: 0 }, comment: String
        },
        refereeTotal: { type: Number, default: 0 },
        rfid: String,
        scores: [
            {
                referee: { type: Types.ObjectId, ref: 'User' },
                refereeScores: [
                    {
                        test: { type: Types.ObjectId, ref: 'Test' },
                        value: { type: Number, default: 0 },
                        comment: String
                    }
                ]
            }
        ],
        total: { type: Number, default: 0 },
    },
    {
        timestamps: { currentTime: () => Math.floor((Date.now / 1000)) }
    }
)

module.exports = model('Note', noteSchema)