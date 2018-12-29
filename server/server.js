import io from 'socket.io';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import ChatManager from './chatManager';

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

const chatManager = new ChatManager();

$io.on('connection', (socket) => {
  socket.on('Register', (name, fn) => {
    const color = colors[random()];
    const result = chatManager.createNewUser(name, socket, color);
    fn(result);
  });

  socket.on('Create chatroom', (chatroom, fn) => {
    const result = chatManager.createChatRoom(socket.id, chatroom);
    fn(result);
  });

  socket.on('Join chatroom', (chatroom, fn) => {
    const result = chatManager.joinChatRoom(socket.id, chatroom);
    fn(result);
  });

  socket.on('Delete chatroom', (chatroom, fn) => {
    const result = chatManager.deleteChatRoom(chatroom, socket.id);
    fn(result);
  });

  socket.on('Leave chatroom', (_, fn) => {
    const result = chatManager.leaveChatRoom(socket.id);
    fn(result);
  });

  socket.on('disconnect', () => {
    chatManager.deleteUser(socket.id);
  });

  socket.once('error', (error) => {
    log(`${socket.id} had this error - ${error}`);
  });

  socket.on('View chatroom members', (_, fn) => {
    const members = chatManager.getAllUsersInChatRoom(socket.id).join(', ');
    fn(members);
  });

  socket.on('Get all chatrooms', (_, fn) => {
    const chatrooms = chatManager.serializeChatRooms().join(', ');
    fn(chatrooms);
  });

  socket.on('Chatroom message', (message) => {
    chatManager.sendMessageToRoom(message, socket.id, $io);
  });

  socket.on('Direct message', (message, receiver) => {
    chatManager.sendADirectMessage(message, socket.id, receiver, $io);
  });
});

process.on('uncaughtException', err => log('uncaught exception', err));
process.on('unhandledRejection', err => log('unhandled rejection', err));

const port = process.env.PORT || 2018;

http.listen(port, () => {
  log('App listening on port', port);
});
