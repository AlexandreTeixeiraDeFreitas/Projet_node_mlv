import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import db from "../db";
export interface JWTUser {
  id: string;
  username: string;
  role: string;
}

export const createJWT = (user: JWTUser) => {
  const token = jwt.sign({
    id: user.id,
    name: user.username,
    role: user.role,
  }, (process.env.JWT_SECRET as string))
  return token
}

export const protect: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, (process.env.JWT_SECRET as string)) as JWTUser
    req.user = payload
    console.log(req.user);
    
    return next()
  } catch(e) {
    console.error(e)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const protectAdmin: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const [, token] = bearer.split(' ')

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const payload = jwt.verify(token, (process.env.JWT_SECRET as string)) as JWTUser
    req.user = payload

    if (req.user.role !== 'ADMIN') {
      return res.status(401).json({
        message: 'You are not authorized to perform this action'
      });
    }

    return next()
  } catch(e) {
    console.error(e)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}


export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10)
}

export const comparePassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

