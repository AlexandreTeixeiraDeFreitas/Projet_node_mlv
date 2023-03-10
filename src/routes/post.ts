import express from 'express'
import db from '../db'
import { body, validationResult } from "express-validator";
const app = express.Router()

app.get('/post', async (req, res) => {
  try {
    const posts = await db.post.findMany({
    where: {
      authorId: req.user.id,
    },
    include: {
      // author: true,
      comments: true,
    },
    });
    return res.status(200).json(posts)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
  })

  app.post('/post', 
  body('title').exists().isString().notEmpty(),
  body('content').exists().isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, content } = req.body;
    try {
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
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating post');
    }
});


  // app.get('/posts', async (req, res) => {
 
  //   const posts = await db.post.findMany({
  //     include: {
  //       // author: true,
  //       comments: true,
  //     },
  //   });
  //   res.json(posts);
  // });



  app.get('/posts/', async (req, res) => {
    try {
      let posts;
      const { from } = req.query;
      if (from && !isNaN(Number(from))) {
        posts = await db.post.findMany({
          where: {
            createdAt: {
              gte: new Date(Number(from) * 1000),
            },
          },
          include: {
            // author: true,
            comments: true,
          },
        });
      } else {
        posts = await db.post.findMany({
          include: {
            author: true,
            comments: true,
          },
        });
      }
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const post = await db.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        comments: true,
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });

  app.put('/post/:id', body('title').exists().isString().notEmpty(), body('content').exists().isString().notEmpty(), async (req, res) => {
    validationResult(req).throw()
    const { title, content } = req.body;
    const post = await db.post.findUnique({ where: { id: req.params?.id } });
  
    if (!post) {
      return res.sendStatus(404);
    }
  
    if (req.user.role === 'ADMIN' || req.user.id === post.authorId) {
      const updatedPost = await db.post.update({
        where: {
          id: req.params?.id
        },
        data: {
          title,
          content,
        },
      });
      res.json(updatedPost);
    } else {
      res.sendStatus(403);
    }
  });
  

  app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    const post = await db.post.findUnique({ where: { id } });
  
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (req.user.role === 'ADMIN' || req.user.id === post.authorId) {
      await db.post.delete({
        where: {
          id,
        },
      });
      return res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  });

  export default app