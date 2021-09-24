const router = require('express').Router()

const NoteModel = require('../models/NoteModel')
const MasterModel = require('../models/MasterModel')
const UserModel = require('../models/UserModel')

router.get('/', async (req, res) => {
    const Notes = await NoteModel.find({competitionId: '6148ce9a4b4198bbc0028eb8', completed: true})
    const Masters = await MasterModel.find()
    const Users = await UserModel.find()

    const categories = [
        { categoryName: 'feathering' },
        { categoryName: 'arrow' },
        { categoryName: 'lips' },
        { categoryName: 'hairTechnology' },
        { categoryName: 'Microblading' }
    ]

    const parts = categories.map(({categoryName}) => {
        const result = Notes.filter(({category}) => category === categoryName)
            .map(note => {
                const name = Masters.find(({_id}) => _id.toString() === note.master.toString())?.name ?? 'Master'

                const scores = note.scores.map(score => {
                    const referee = Users.find(({_id}) => _id.toString() === score.refereeId.toString())?.name ?? 'Referee'
                    const value = score.refereeScores.reduce((sum, item) => sum + item.value, 0)
                    return { referee, value }
                })

                const total = scores.reduce((sum, item) => sum + item.value, 0)

                return { id: note._id, name, scores, total }
            })
            .sort((a, b) => b.total - a.total)
        return { categoryName, result }
    })

    let body = `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <title>WULOP KZ result</title>
            </head>
            <body>
                <div class="container">
    `

    parts.forEach(({categoryName, result}) => {
        const title = global.dictionary.find(({lang, key}) => (lang === 'RU' && key === categoryName)).phrase
        body += `<h3 class="text-center pt-3">${title}</h3>`
        body += `<div class="accordion" id="c_${categoryName}">`
        result.forEach(({id, name, scores, total}, index) => {
            body += `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="h_${id}">
                        <button class="accordion-button collapsed w-100" type="button" data-bs-toggle="collapse"
                            data-bs-target="#n_${id}" aria-expanded="false" aria-controls="flush-collapseOne">
                                <span class="col-1 text-center">${index + 1}</span>
                                <span class="col-8 col-sm-4">${name}</span>
                                <span class="col-2 text-center">${total}</span>
                        </button>
                    </h2>
                    <div id="n_${id}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                        data-bs-parent="#c_${categoryName}">
                        <div class="accordion-body">
                            <div class="row justify-content-around">
            `
            scores.forEach(({referee, value}) => {
                body += `<div class="col-12 col-sm-auto border rounded bg-light p-2 d-flex justify-content-between">
                    <span>${referee}</span>
                    <span class="ms-2">${value}</span>
                </div>`
            })
            body += `</div></div></div></div>
            `
        })
        body += `</div>`
    })

    body += `
        </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous"></script>
        </body>
        </html>
    `
    res.send(body)
})

module.exports = router