import express from 'express'
import db from '../db'
const app = express.Router()


app.post('/posts', async (req, res) => {
    const { title, content } = req.body;
    const post = await db.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    res.json(post);
  });

  app.get('/posts', async (req, res) => {
    const posts = await db.post.findMany({
      include: {
        author: true,
      },
    });
    res.json(posts);
  });

  app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await db.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });

  app.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    res.json(post);
  });

  app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await db.post.delete({
      where: {
        id,
      },
    });
    res.status(204).end();
  });

  export default app