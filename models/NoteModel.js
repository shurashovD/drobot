const { model, Types, Schema } = require('mongoose')

const noteSchema = new Schema({
    competitionId: { type: Types.ObjectId, ref: 'Competition' },
    number: Number,
    master: { type: Types.ObjectId, ref: 'Master' },
    category: String,
    beforePhoto: String,
    afterPhoto: String,
    rfid: String,
    completed: { type: Boolean, default: false },
    scores: [
        {
            refereeId: { type: Types.ObjectId, ref: 'Referee' },
            refereeScores: [
                {
                    testId: { type: Types.ObjectId, ref: 'Test' },
                    value: Number,
                    comment: String
                }
            ]
        }
    ],
    hyhienicalScore: {
        value: Number, comment: String
    }
})

module.exports = model('Note', noteSchema)