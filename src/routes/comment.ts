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

  app.put('/comment/:id',
    body('content').exists().isString().notEmpty(), 
    body('postId').exists().isString().notEmpty(),
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    
    const { content, postId } = req.body;
    
    const comment = await db.comment.findUnique({ where: { id: req.user.id } });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
  
    if (req.user.role === 'ADMIN' || req.user.id === comment.authorId) {
      const updatedComment = await db.comment.update({
        where: { id: req.user.id },
        data: { content, postId },
      });
      res.json({ message: 'Comment updated successfully', updatedComment });
    } else {
      res.status(403).json({ message: 'You are not authorized to update this comment' });
    }
  });
  

app.delete('/comment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await db.comment.findUnique({ where: { id } });

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }
  if (req.user.role === 'ADMIN' || req.user.id === comment.authorId) {
    await db.comment.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
});


  export default app