import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.use(cors());

app.get('/random', (req: Request, res: Response) => {
  const latA = Number(req.query.latA);
  const lngA = Number(req.query.lngA);
  const latB = Number(req.query.latB);
  const lngB = Number(req.query.lngB);
  const count = Number(req.query.count);

  if ([latA, lngA, latB, lngB, count].some((e) => e === NaN)) {
    res.status(422).send('latA, lngA, latB, lngB and count should be defined and numerical');
    return;
  }
  if ([latA, latB].some((e) => e < -90 || e > 90)) {
    res.status(422).send('latitudes should be between -90 and 90');
    return;
  }
  if (count <= 0 || count > 100) {
    res.status(422).send('Count should be between 1 and 100');
    return;
  }

  const points = [];

  // Generate random points
  for (let i = 0; i < count; i += 1) {
    let lng = Math.random() * (lngB - lngA) + lngA;

    // Normalize longitude if it's out of range
    if (lng < -180) {
      lng = lng % 360 < -180 ? lng % 360 + 360 : lng % 360;
    }
    if (lng > 180) {
      lng = lng % 360 > 180 ? lng % 360 - 360 : lng % 360;
    }

    points.push({
      // Latitide doesn't wrap, no need to normalize
      lat: Math.random() * (latB - latA) + latA,
      lng
    })
  }

  res.status(200).send(points);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
