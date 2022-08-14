# coord-playground
Test project for displaying random coordinates on a map. To draw a rectangle box for the random coordinates to appear in, click with right mouse button and drag on the map. 5 random points will appear as markers inside the selected rectangle.

![Screenshot](https://imgur.com/LmDuREL.png)

## Project Setup

Node.js v16 is recommended.
```
git clone git@github.com:Bielwenass/coord-playground.git
cd ./coord-playground
```
In the `frontend` directory, rename (or copy) `.env.example` to `.env` and paste your Mapbox API token.

### Backend

To start locally:
```
cd ./backend
npm i
npm run dev
```

To Build:
```
cd ./backend
npm i
npm run build
```

### Frontend

To start locally:
```
cd ./frontend
npm i
npm run start
```

To Build:
```
cd ./frontend
npm i
npm run build
```
