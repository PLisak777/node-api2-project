const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/', (req, res) => {
    const body = req.body
    if (body.title && body.contents) {
        db.insert(req.body)
        .then(response => {
            db.findById(response.id)
            .then(newPost => {
                res.status(201).json(newPost[0])
            })
        })
        .catch(err => {
            res.status(500).json({error: 'There was an error while saving the post to the database'})
        })
    }
    else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

module.exports = router;