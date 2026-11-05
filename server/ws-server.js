import http from 'http';
import fs from 'fs'
import path from 'path'
import { WebSocketServer } from 'ws'

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;

// Reglas del juego
const TOTAL_ROUNDS = Number(process.env.ROUNDS) || 5;
const GUESS_SECONDS = Number(process.env.GUESS_SECONDS) || 20;
const MAX_POINTS = 1000;
const POINTS_LOST_PER_YEAR = 50; // 20 años de diferencia o más = 0 puntos
const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear();

// Más cerca del año real = más puntos
const scoreFor = (guess, answer) =>
  Math.max(0, MAX_POINTS - Math.abs(guess - answer) * POINTS_LOST_PER_YEAR);


const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // 1. Manejar páginas principales
  const pages = {
    '/': '../app/views/client.html',
    '/host': '../app/views/host.html',
  };
  

  const file = pages[urlPath];
  if (file) {
    return fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error interno');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  }

  // 2. Manejar archivos estáticos (CSS, JS, imágenes en /public)
  if (urlPath.startsWith('/public/')) {
    const filePath = path.join(__dirname, '..', 'app', urlPath);
    
    // Validar extensión para el Content-Type correcto
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    return fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('Archivo no encontrado');
      }
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  }

  // 3. Si no encaja en nada
  res.writeHead(404);
  res.end('Not Found');
});

const wss = new WebSocketServer({ server });

// rooms: code -> {
//   host: ws,
//   players: Map<ws, { name, score }>,
//   phase: 'lobby' | 'between' | 'guessing' | 'over',
//   round: number de rondas ya empezadas,
//   current: { song, endsAt, guesses: Map<ws, number>, timer } | null
// }
const rooms = new Map();

function newCode() {
  let code;
  do {
    code = String(Math.floor(1000 + Math.random() * 9000));
  } while (rooms.has(code));
  return code;
}

function send(ws, msg) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
}

function playerNames(room) {
  return [...room.players.values()].map((p) => p.name);
}

// Tabla de posiciones ordenada por puntaje (la lleva el servidor, el host solo la muestra)
function leaderboard(room) {
  return [...room.players.values()]
    .map((p) => ({ name: p.name, score: p.score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

function broadcast(room, msg) {
  for (const player of room.players.keys()) send(player, msg);
}

// Cierra la ronda: calcula puntos, avisa a los jugadores y al host
function endRound(room) {
  const cur = room.current;
  if (!cur) return;
  clearTimeout(cur.timer);
  room.current = null;

  const { song } = cur;
  const results = [];
  for (const [ws, player] of room.players) {
    const guess = cur.guesses.get(ws) ?? null; // null = no contestó
    const points = guess === null ? 0 : scoreFor(guess, song.year);
    player.score += points;
    results.push({ name: player.name, guess, diff: guess === null ? null : Math.abs(guess - song.year), points, score: player.score });
  }

  const board = leaderboard(room);
  const last = room.round >= TOTAL_ROUNDS;
  room.phase = last ? 'over' : 'between';

  for (const [ws, player] of room.players) {
    const mine = results.find((r) => r.name === player.name);
    send(ws, {
      type: 'round_end',
      round: room.round,
      total: TOTAL_ROUNDS,
      year: song.year,
      song: { name: song.name, artist: song.artist },
      guess: mine.guess,
      points: mine.points,
      score: mine.score,
      rank: board.findIndex((b) => b.name === player.name) + 1,
      last,
    });
  }

  send(room.host, {
    type: 'round_result',
    round: room.round,
    total: TOTAL_ROUNDS,
    song: { name: song.name, artist: song.artist, year: song.year },
    results: results.sort((a, b) => b.points - a.points),
    leaderboard: board,
    last,
  });

}

function notifyHost(room) {
  send(room.host, { type: 'players', players: playerNames(room) });
}

wss.on('connection', (ws) => {
  ws.role = null;
  ws.code = null;

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    // El anfitrión crea una sala
    if (msg.type === 'create_room') {
      const code = newCode();
      rooms.set(code, { host: ws, players: new Map(), phase: 'lobby', round: 0, current: null });
      ws.role = 'host';
      ws.code = code;
      send(ws, { type: 'room_created', code });
      return;
    }

    // Un cliente se une con código + nombre
    if (msg.type === 'join') {
      const code = String(msg.code || '').trim();
      const name = String(msg.name || '').trim().slice(0, 20);
      const room = rooms.get(code);

      if (!room) return send(ws, { type: 'error', message: 'Sala no encontrada' });
      if (room.phase !== 'lobby') return send(ws, { type: 'error', message: 'La partida ya empezó' });
      if (!name) return send(ws, { type: 'error', message: 'Escribe un nombre' });
      if (playerNames(room).some((n) => n.toLowerCase() === name.toLowerCase())) {
        return send(ws, { type: 'error', message: 'Ese nombre ya está en uso' });
      }

      room.players.set(ws, { name, score: 0 });
      ws.role = 'player';
      ws.code = code;
      send(ws, { type: 'joined', name, code });
      notifyHost(room);
      return;
    }

    // El anfitrión inicia el juego: resetea puntajes y avisa a los jugadores.
    // Después el host pide la canción a la API y manda 'round' por cada ronda.
    if (msg.type === 'start' && ws.role === 'host') {
      const room = rooms.get(ws.code);
      if (!room || room.players.size === 0) return;
      if (room.phase !== 'lobby' && room.phase !== 'over') return;
      for (const p of room.players.values()) p.score = 0;
      room.phase = 'between';
      room.round = 0;
      broadcast(room, { type: 'started', total: TOTAL_ROUNDS });
      send(ws, { type: 'game_started', total: TOTAL_ROUNDS, seconds: GUESS_SECONDS });
      return;
    }

    // El host ya tiene la canción sonando: abre la ventana de respuestas
    if (msg.type === 'round' && ws.role === 'host') {
      const room = rooms.get(ws.code);
      if (!room || room.phase !== 'between' || room.round >= TOTAL_ROUNDS) return;
      const year = Number(msg.song?.year);
      if (!Number.isInteger(year)) return;

      room.round += 1;
      room.phase = 'guessing';
      const endsAt = Date.now() + GUESS_SECONDS * 1000;
      room.current = {
        song: { name: String(msg.song.name || ''), artist: String(msg.song.artist || ''), year },
        endsAt,
        guesses: new Map(),
        timer: setTimeout(() => endRound(room), GUESS_SECONDS * 1000),
      };
      // Los jugadores NO reciben el año ni el nombre de la canción
      broadcast(room, { type: 'round_start', round: room.round, total: TOTAL_ROUNDS, seconds: GUESS_SECONDS, endsAt, min: MIN_YEAR, max: MAX_YEAR });
      send(ws, { type: 'round_started', round: room.round, total: TOTAL_ROUNDS, seconds: GUESS_SECONDS, endsAt });
      return;
    }

    // Tras mostrar el resultado de la última ronda, el host pasa a la pantalla final
    if (msg.type === 'show_final' && ws.role === 'host') {
      const room = rooms.get(ws.code);
      if (!room || room.phase !== 'over') return;
      const final = { type: 'game_over', leaderboard: leaderboard(room) };
      broadcast(room, final);
      send(ws, final);
      return;
    }

    // Un jugador manda su año (una sola respuesta por ronda)
    if (msg.type === 'guess' && ws.role === 'player') {
      const room = rooms.get(ws.code);
      const cur = room?.current;
      if (!cur || room.phase !== 'guessing' || Date.now() > cur.endsAt) return;
      const year = Number(msg.year);
      if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) return;
      if (cur.guesses.has(ws)) return;

      cur.guesses.set(ws, year);
      send(ws, { type: 'guess_ok', year });
      send(room.host, { type: 'guess_count', answered: cur.guesses.size, total: room.players.size });

      // Si ya contestaron todos no hace falta esperar los 20 s
      if (cur.guesses.size >= room.players.size) endRound(room);
      return;
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.code);
    if (!room) return;

    if (ws.role === 'host') {
      // Si se va el host, se cierra la sala
      clearTimeout(room.current?.timer);
      broadcast(room, { type: 'room_closed' });
      rooms.delete(ws.code);
    } else if (ws.role === 'player') {
      room.players.delete(ws);
      notifyHost(room);
      // Si el que se fue era el último pendiente de contestar, cierra la ronda
      const cur = room.current;
      if (cur) {
        cur.guesses.delete(ws);
        if (room.players.size === 0 || cur.guesses.size >= room.players.size) endRound(room);
        else send(room.host, { type: 'guess_count', answered: cur.guesses.size, total: room.players.size });
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Host:     http://localhost:${PORT}/host`);
  console.log(`Clientes: http://localhost:${PORT}/`);
});