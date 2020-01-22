const router = require('express').Router()
const snippetHelper = require('../helpers/snippetHelper')
const filterHelper = require('../helpers/filterHelper')
const fileHelper = require('../helpers/fileHelper')


router.get('/snippets', (req, res) => {
    const filter = filterHelper.prepareSnippet(req.query)
    snippetHelper.find(filter)
        .then((snippets) => res.send(snippets))
        .catch(err => res.sendStatus(500))
})

router.post('/snippets/create', (req, res) => {
    const { userFilename, category, code, description } = req.body
    const snippet = snippetHelper.create(userFilename, category, description, code)

    fileHelper.write(snippet.pathToFile, code)
        .then(async () => {
            await snippet.save()
            res.sendStatus(201)
        })
        .catch(err => res.status(500).json({ message: err.message }))
})

router.delete('/snippets/:id', (req, res) => {
    snippetHelper.remove(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(err => res.sendStatus(500))
})

module.exports = router