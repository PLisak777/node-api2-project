const express = require('express');
const db = require('../data/db');
const router = express.Router();

// POST to /api/posts with title and contents
router.post('/', (req, res) => {
	const body = req.body;
	if (body.title && body.contents) {
		db.insert(req.body)
			.then((response) => {
				db.findById(response.id).then((newPost) => {
					res.status(201).json(newPost[0]);
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: 'There was an error while saving the post to the database',
				});
			});
	} else {
		res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.',
		});
	}
});

// POST to /:id/comments
router.post('/:id/comments', (req, res) => {
	const body = req.body;
	const { id } = req.params;

	if (body.text) {
		db.findById(id)
			.then((result) => {
				if (result.length === 0) {
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					});
				} else {
					body.post_id = id;
					db.insertComment(body).then((comment) => {
						db.findCommentById(comment.id).then((response) => {
							if (response.length === 0) {
								throw new Error('Something went wrong');
							} else {
								res.status(201).json(response[0]);
							}
						});
					});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: 'There was an error while saving the comment to the database',
				});
			});
	} else {
		res
			.status(400)
			.json({ errorMessage: 'Please provide text for the comment.' });
	}
});

// GET from /api/posts
router.get('/', (req, res) => {
	db.find()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ error: 'The posts information could not be retrieved.' });
		});
});

// GET from /api/posts/:id
router.get('/:id', (req, res) => {
	const { id } = req.params;

	db.findById(id)
		.then((response) => {
			if (response.length === 0) {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			} else {
				res.status(200).json(response);
			}
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ error: 'The post information could not be retrieved.' });
		});
});

router.get('/:id/comments', (req, res) => {
	const { id } = req.params;

	db.findById(id)
		.then((response) => {
			if (response.length === 0) {
				res
					.status(404)
					.json({ message: 'The post with the specified ID does not exist.' });
			} else {
				db.findPostComments(id).then((postComments) => {
					res.status(200).json(postComments);
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res
				.status(500)
				.json({ error: 'The comments information could not be retrieved.' });
		});
});

module.exports = router;
