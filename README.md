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
```

Sign-in
```bash
/sign-in
```

get user && put user
```bash
/api/user
```

info tous les user
```bash
/api/users
```

get user && put user && delete user (ADMIN)
```bash
/api/user/:id
```
get des post du user && post post
```bash
/api/post
```
get posts sur tous les posts avec tous les comments
```bash
/api/posts
```

get post && put post && delete post
```bash
/api/post/:id
```
get sur tous les comments
```bash
/api/comments
```

get comment && post comment && put comment && delete comment
```bash
/api/comment/:id
```
