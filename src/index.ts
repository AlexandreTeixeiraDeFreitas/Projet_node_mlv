import express from 'express'
import * as dotenv from 'dotenv'
import { protect } from './modules/auth'
import userRouter from './routes/user'
import { createNewUser, signIn } from './handlers/user'

dotenv.config()

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  return res.json({ message: 'Bonsoir' })
})

app.use('/api', protect, [
  userRouter,
])

app.post('/sign-up', createNewUser)
app.post('/sign-in', signIn)

app.listen(1234, () => {
  console.log('Listening on port 1234')
})