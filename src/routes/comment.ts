import express from 'express'
import db from '../db'
import { body, validationResult } from "express-validator";
const app = express.Router()



app.post('/comment', body('content').exists().isString().notEmpty(), body('postId').exists().isString().notEmpty(), async (req, res) => {
  validationResult(req).throw()
  const { content, postId } = req.body;
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

  app.get('/comment/:id', async (req, res) => {
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

app.put('/comment/:id', body('content').exists().isString().notEmpty(), body('postId').exists().isString().notEmpty(), async (req, res) => {
  validationResult(req).throw()
  const { content } = req.body;
  const comment = await db.comment.findUnique({ where: { id: req.params?.id } });

  if (!comment) {
    return res.sendStatus(404);
  }

  if (req.user.role === 'ADMIN' || req.user.id === comment.authorId) {
    const updatedComment = await db.comment.update({
      where: {
        id: req.params?.id,
      },
      data: {
        content,
      },
    });
    res.json(updatedComment);
  } else {
    res.sendStatus(403);
  }
});

  app.delete('/comment/:id', async (req, res) => {
    const { id } = req.params;
    const comment = await db.comment.findUnique({ where: { id } });
  
    if (!comment) {
      return res.sendStatus(404);
    }
    if (req.user.role === 'ADMIN' || req.user.id === comment.authorId) {
      await db.comment.delete({
        where: {
          id,
        },
      });
      res.status(204).end();
    } else {
      res.sendStatus(403);
    }
  });

  export default app