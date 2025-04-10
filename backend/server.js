const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

// Temporary in-memory storage
let posts = [];
let nextId = 1;

// Create a new post
app.post('/blogapi/posts', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newPost = { id: nextId++, title, content };
  posts.unshift(newPost); // adds to the top like ORDER BY DESC
  res.status(201).json(newPost);
});

// Fetch all posts
app.get('/blogapi/posts', (req, res) => {
  res.json(posts);
});

// Delete a post
app.delete('/blogapi/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = posts.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  posts.splice(index, 1);
  res.json({ message: 'Post deleted' });
});

// Update a post
app.put('/blogapi/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  post.title = title;
  post.content = content;
  res.json(post);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
