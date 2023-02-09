# IPSSI - Express

## Installation
Install dependencies

```bash
$ pnpm i
```

Make sure you define `DATABASE_URL` in your `.env` file
Make sure you define `JWT_SECRET` in your `.env` file

Launch migration on you database

```bash
$ pnpm prisma migrate dev
```

## Development

```bash
$ pnpm dev
```


Launch Prisma studio 
```bash
$ pnpm prisma studio
```


Sign-up
```bash
/sign-up

POST:
{
    "username": "username",
    "name": "name",
    "password": "password"
}
```

Sign-in
```bash
/sign-in

POST:
{
    "username": "username",
    "password": "password"
}
```

get user && put user
```bash
/api/user

PUT:
{
    "name": "name",
    "password": "password"
}
```

info sur tous les user
```bash
/api/users
```

get user (ADMIN) && put user (ADMIN) && delete user (ADMIN)
```bash
/api/user/:id

PUT:
{
    "name": "name",
    "password": "password"
}
```
un post pour créer un post
```bash
/api/post
/api/post?from=1612767057
POST:
{
    "title": "title",
    "content": "content"
}
```
get posts sur tous les posts avec tous les comments
```bash
/api/posts
```

get post && put post && delete post
```bash
/api/post/:id

PUT:
{
    "title": "title",
    "content": "content"
}
```
get sur tous les comments
```bash
/api/comments
```

post comment pour créer un commentaire
```bash
/api/comment

POST:
{
    "content": "content",
    "postId": "postId"
}
```

get comment && put comment && delete comment
```bash
/api/comment/:id

PUT:
{
    "content": "content"
}
```
