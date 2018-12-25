import io from 'socket.io';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const server = require('express')();
const http = require('http').Server(server);

server.use(cors());
server.use(helmet());
server.use(urlencoded({ extended: false }));
server.use(json());

dotenv.config();
const { log } = console;

const options = {
  path: '/chat',
  serverClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
};

const $io = io(http, options);

server.get('/', (req, res) => {
  res.send('Welcome to Trim_Chat');
});

server.post('/auth', (req, res) => {
  const salt = bcrypt.genSaltSync(8);
  const passKey = `${process.env.pass}${process.env.SECRET_KEY}`;
  const hashPassKey = bcrypt.hashSync(passKey, salt);

  if (!req.body.password) {
    return res.status(401).json({
      status: 401,
    });
  }

  const { password } = req.body;
  const userPass = `${password}${process.env.SECRET_KEY}`;
  const confirmPassword = bcrypt.compareSync(userPass, hashPassKey);

  if (confirmPassword) {
    return res.status(200).json({
      status: 200,
      message: 'Success',
    });
  }
  return res.status(403).json({
    status: 403,
    message: 'Fail',
  });
});

const colors = ['red', 'blue', 'yellow', 'green', 'magenta', 'cyan', 'gray'];

const random = () => Math.floor(Math.random() * (colors.length - 1));

const sockets = [];

$io.on('connection', (socket) => {
  const { id } = socket;
  const color = colors[random()];
  sockets.push({ id, color });

  log('user connected', id);
  socket.broadcast.emit('user connected', id);

  socket.on('Join Chatroom', (name) => {
    const [obj] = sockets.filter(item => item.id === id);
    obj.name = name;
  });

  socket.on('message', (msg) => {
    if (msg === '') return;
    const [obj] = sockets.filter(item => item.id === id);
    const { name, color: cl } = obj;
    socket.broadcast.emit('message', { name, msg, cl });
  });
});

process.on('uncaughtException', err => log('uncaught exception', err));
process.on('unhandledRejection', err => log('unhandled rejection', err));

const port = process.env.PORT || 2018;

http.listen(port, () => {
  log('App listening on port', port);
});
