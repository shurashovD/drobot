const { model, Types, Schema } = require('mongoose')

const noteSchema = new Schema(
    {
        category: { type: Types.ObjectId, ref: 'Category' },
        competitionId: { type: Types.ObjectId, ref: 'Competition' },
        completed: { type: Boolean, default: false },
        hygienicalScore: {
            comment: String,
            referee: { type: Types.ObjectId, ref: 'User' },
            value: { type: Number, default: 0 },
        },
        lastReferee: { type: Types.ObjectId, ref: 'User' },
        master: { type: Types.ObjectId, ref: 'Master' },
        middle: { type: Number, default: 0 },
        myModel: { type: Boolean, default: false },
        number: Number,
        phone: String,
        photos: [String],
        previousScore: {
            comment: String,
            referee: { type: Types.ObjectId, ref: 'User' },
            value: { type: Number, default: 0 },
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

/*{
        "refereeScores": [{
            "value": 44
        }, {
            "value": 45
        }, {
            "value": 48
        }, {
            "value": 45
        }, {
            "value": 44
        }, {
            "value": 47
        }]
    }, {
        "refereeScores": [{
            "value": 43
        }, {
            "value": 41
        }, {
            "value": 46
        }, {
            "value": 45
        }, {
            "value": 42
        }, {
            "value": 45
        }]
    }, {
        "refereeScores": [{
            "value": 47
        }, {
            "value": 44
        }, {
            "value": 50
        }, {
            "value": 45
        }, {
            "value": 45
        }, {
            "value": 50
        }]
    }, {
        "refereeScores": [{
            "value": 46
        }, {
            "value": 45
        }, {
            "value": 50
        }, {
            "value": 45
        }, {
            "value": 44
        }, {
            "value": 48
        }]
    }, {
        "refereeScores": [{
            "value": 47
        }, {
            "value": 44
        }, {
            "value": 49
        }, {
            "value": 45
        }, {
            "value": 43
        }, {
            "value": 48
        }]
    }*/