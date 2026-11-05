import express from 'express';
import cors from 'cors';
import { getRandomTrack } from './utils/itunes.js';

const PORT = process.env.API_PORT || 4000;
const app = express();

// CORS: la página del host vive en otro puerto (el del websocket), así que es otro origen.
// Con `true` se acepta el origen que haga la petición (cómodo en desarrollo).
// En producción pon ALLOWED_ORIGIN, por ejemplo https://tu-dominio.com
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || true }));

// Canción aleatoria con preview de ~30 s
app.get('/random-song', async (req, res) => {
  try {
    const track = await getRandomTrack();
    res.json(track);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Running`);
});