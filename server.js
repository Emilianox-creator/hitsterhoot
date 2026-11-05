import http from 'http';
import fs from 'fs'
import path from 'path'
import { WebSocketServer } from 'ws'

const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;

// Páginas estáticas: / (clientes) y /host (anfitrión)
const pages = {
  '/': './views/client.html',
  '/host': './views/host.html',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // 1. Manejar páginas principales
  const pages = {
    '/': './views/client.html',
    '/host': './views/host.html',
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
    const filePath = path.join(__dirname, urlPath);
    
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

// rooms: code -> { host: ws, players: Map<ws, name> }
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
  return [...room.players.values()];
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
      rooms.set(code, { host: ws, players: new Map() });
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
      if (!name) return send(ws, { type: 'error', message: 'Escribe un nombre' });
      if (playerNames(room).some((n) => n.toLowerCase() === name.toLowerCase())) {
        return send(ws, { type: 'error', message: 'Ese nombre ya está en uso' });
      }

      room.players.set(ws, name);
      ws.role = 'player';
      ws.code = code;
      send(ws, { type: 'joined', name, code });
      notifyHost(room);
      return;
    }

    // El anfitrión inicia el juego (siguiente paso del proyecto)
    if (msg.type === 'start' && ws.role === 'host') {
      const room = rooms.get(ws.code);
      if (!room) return;
      for (const player of room.players.keys()) send(player, { type: 'started' });
      return;
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.code);
    if (!room) return;

    if (ws.role === 'host') {
      // Si se va el host, se cierra la sala
      for (const player of room.players.keys()) {
        send(player, { type: 'room_closed' });
      }
      rooms.delete(ws.code);
    } else if (ws.role === 'player') {
      room.players.delete(ws);
      notifyHost(room);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Host:     http://localhost:${PORT}/host`);
  console.log(`Clientes: http://localhost:${PORT}/`);
});