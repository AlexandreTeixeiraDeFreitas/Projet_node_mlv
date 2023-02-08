import express from 'express'
import * as dotenv from 'dotenv'
import { protect } from './modules/auth'
import userRouter from './routes/user'
import postRouter from './routes/post'
import commentRouter from './routes/comment'
import { createNewUser, signIn } from './handlers/user'
import { body, validationResult } from "express-validator";
import Cors from 'cors'

dotenv.config()

const app = express()
app.use(Cors())
app.use(express.json())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

app.use('/api', protect, [
  userRouter,
  postRouter,
  commentRouter
])

app.post('/sign-up', body('username').exists().isString().notEmpty(), body('name').exists().isString().notEmpty(), body('password').exists().isString().notEmpty(), createNewUser)
app.post('/sign-in', body('username').exists().isString().notEmpty(), body('password').exists().isString().notEmpty(), signIn)

app.listen(1234, () => {
  console.log('Listening on port 1234')
})