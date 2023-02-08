import express from 'express'
import db from '../db'
const app = express.Router()



app.post('/comments', async (req, res) => {
    const { content, authorId, postId } = req.body;
    const comment = await db.comment.create({
      data: {
        content,
        author: {
          connect: {
            id: req.user.id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
    res.json(comment);
  });

  app.get('/comments', async (req, res) => {
    if (req.user.role === 'ADMIN') {
        const comments = await db.comment.findMany({
        include: {
            author: true,
            post: true,
        },
        });
        res.json(comments);
    } else {
        res.sendStatus(403);
    }
  });

  app.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const comment = await db.comment.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        post: true,
      },
    });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  });

  app.patch('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await db.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
    res.json(comment);
  });

  app.delete('/comments/:id', async (req, res) => {
    const { id } = req.params;
    await db.comment.delete({
      where: {
        id,
      },
    });
    res.status(204).end();
  });

  export default app