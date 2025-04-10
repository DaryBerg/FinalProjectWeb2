const express = require('express');
const server = express();
const cors = require('cors');
const portNumber = 3000;

// Middleware setup
server.use(cors());
server.use(express.json());

// CORS Configuration
server.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

// In-memory post store
let postStorage = [];
let uniqueId = 1;

// Route to create a new blog post
server.post('/blogapi/posts', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const blogPost = {
    id: uniqueId++,
    title,
    content
  };

  postStorage.unshift(blogPost); // Most recent at the top
  res.status(201).json(blogPost);
});

// Route to retrieve all posts
server.get('/blogapi/posts', (req, res) => {
  res.json(postStorage);
});

// Route to delete a post by ID
server.delete('/blogapi/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const position = postStorage.findIndex(entry => entry.id === postId);

  if (position === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  postStorage.splice(position, 1);
  res.json({ message: 'Post deleted' });
});

// Route to update an existing post
server.put('/blogapi/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;

  const existingPost = postStorage.find(entry => entry.id === postId);
  if (!existingPost) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  existingPost.title = title;
  existingPost.content = content;
  res.json(existingPost);
});

// Start the server
server.listen(portNumber, () => {
  console.log(`Blog server is live at http://localhost:${portNumber}`);
});