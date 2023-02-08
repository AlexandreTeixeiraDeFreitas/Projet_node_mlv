import express from 'express'
import db from '../db'
const app = express.Router()

app.get('/users', async (req, res) => {
  try {
    console.log(req.user.role);
    
    if (req.user.role === 'ADMIN') {
      const users = await db.user.findMany();
      res.json(users);
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'An error ocurred' });
  }
})


app.get('/user', async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        username: true,
        role: true
      }
    })
    return res.status(200).json(user)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})


app.put('/user', async (req, res) => {
  try {
    if (!req.body.name)  {
      return res.status(400).json({ message: 'Invalid body provided' })
    }
    const updatedUser = await db.user.update({
      where: {
        id: req.user.id
      },
      data: {
        name: req.body.name
      }
    })

    return res.status(200).json(updatedUser)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})
app.put('/user/:id', async (req, res) => {
  try {
    if (!req.params.id)  {
      return res.status(400).json({ message: 'Invalid body provided' })
    }

    if (req.user.role === 'ADMIN') {
      const users = await db.user.findMany();
      res.json(users);
      const updatedUser = await db.user.update({
        where: {
          id: req.user.id
        },
        data: {
          name: req.body.name
        }
      })

      return res.status(200).json(updatedUser)
    } else {
      res.sendStatus(403);
    }
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})

app.delete('/user/:id', async (req, res) => {
  try {
    if (req.user.role === 'ADMIN') {
      const users = await db.user.findMany();
      res.json(users);
      const { id } = req.params;
      const deleteUser = await db.user.delete({
          where: {
          id,
          },
      });

      return res.status(200).json(deleteUser)
    } else {
      res.sendStatus(403);
    }
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: 'An error ocurred' })
  }
})

export default app


