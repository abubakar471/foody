# code/foody-application/.env.local

```
MONGO_URI=mongodb://backend:27017/foody

REDIS_URL=redis://redis:6379

UPSTASH_REDIS_REST_URL="<your upstash redis url>"

UPSTASH_REDIS_REST_TOKEN="<your upstash redis rest token>"

AUTH_GITHUB_ID=<your github oauth app id>

AUTH_GITHUB_SECRET="<your github oauth app secret>"

AUTH_SECRET="<your auth secret key>"

```

---

# Seeding the MongoDB Database 

For development: (In code/foody-application/.env.local)

```
MONGO_URI="mongodb://backend:27017/foody"
```
and run the containers

```
docker compose up --build
```

For production: (First seed the database)

```
MONGO_URI="<your mongodb atlas uri>"
```

and to seed the database run this command inside code/foody-application/ directory, where the seed-atlas.js is

```
node --env-file=.env.local seed-atlas.js
```
