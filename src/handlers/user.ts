import { RequestHandler } from "express";
import db from "../db";
import { body, validationResult } from "express-validator";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";

export const createNewUser: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()
    if (!(req.body.username && req.body.password)) {
      return res.status(400).json({ message: 'Invalid body provided' })
    }
  
    const hash = await hashPassword(req.body.password)
    const user = await db.user.create({
      data: {
        username: req.body.username,
        password: hash,
        name:  req.body.name
      }
    })
  
    const token = createJWT(user)
    return res.status(201).json({ token })
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: e?.toString() || 'An error occured' })
  }
}

export const signIn: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()
    if (!(req.body.username && req.body.password)) {
      return res.status(400).json({ message: 'Invalid body provided' })
    }

    const user = await db.user.findUnique({
      where: {
        username: req.body.username
      }
    })

    if (user) {
      const isValid = await comparePassword(req.body.password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      const token = createJWT(user)
      return res.status(200).json({ token })
    } 

    return res.status(404).json({ message: 'This user doesn\'t exists' })
  } catch(e) {
    console.error(e)
    return res.status(400).json({ error: e?.toString() || 'An error occured during signIn' })
  }
}
// export const isAdmin: RequestHandler = (req, res, next) => {
//   const userId = req.user.id;
//   db.user({ id: userId }).then((user) => {
//     if (user.role === "ADMIN") {
//       req.user = user;
//       next();
//     } else {
//       return res.status(401).send("Access Denied");
//     }
//   });
// };