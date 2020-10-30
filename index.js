const express = require('express');
const postsRouter = require('./posts/posts-router');

const PORT = 5000;

const server = express();

server.use(express.json());
server.use('/api/posts', postsRouter);

server.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
