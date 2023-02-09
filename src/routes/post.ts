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

app.post('/post', body('title').exists().isString().notEmpty(), body('content').exists().isString().notEmpty(), async (req, res) => {
  validationResult(req).throw()
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
          author: true,
        },
      });
    } else {
      posts = await db.post.findMany({
        include: {
          author: true,
        },
      });
    }
    res.json(posts);
  });
  
  
  
  
  



  app.get('/post/:id', async (req, res) => {
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
      return res.sendStatus(404);
    }
    if (req.user.role === 'ADMIN' || req.user.id === post.authorId) {
      await db.post.delete({
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