const NoteModel = require('../models/NoteModel')

const mapper = async () => {
    const notes = await NoteModel.find()
    for ( let i in notes ) {
        const scores = notes[i].scores.map(item => {
            const refereeScores = item.refereeScores.map(item => {
                if ( item.comment ) {
                    let commentArr = item.comment.split('/')
                    if ( commentArr[1] === 'static' ) {
                        commentArr.splice(1, 1)
                    }
                    const comment = commentArr.join('/')
                    console.log(comment);
                    return { ...item.toObject(), comment }
                }
                return item
            })
            return { ...item.toObject(), refereeScores }
        })
        notes[i].scores = scores
        await notes[i].save()
    }
}

module.exports = mapper