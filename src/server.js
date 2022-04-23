import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import ChatManager from './chatManager';

const app = require('express')();

app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());

dotenv.config();

const { log } = console;

const options = {
  path: '/chat',
  serverClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
};

const server = require('http').createServer(app);

const $io = require('socket.io')(server, options);

app
  .get('/', (_req, res) => {
    res.send('Welcome to Trim_Chat');
  })
  .post('/auth', (req, res) => {
    const { password } = req.body;
    const salt = bcrypt.genSaltSync(8);
    if (!password) return res.status(401).json({ status: 401 });
    const confirmPassword = bcrypt.compareSync(
      `${password}${process.env.SECRET_KEY}`,
      bcrypt.hashSync(`${process.env.pass}${process.env.SECRET_KEY}`, salt),
    );

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
  socket.on('Register', (name, callback) => callback(chatManager.createNewUser(name, socket, colors[random()])));

  socket.on('Create chatroom', (chatroom, callback) => callback(chatManager.createChatRoom(socket.id, chatroom)));

  socket.on('Join chatroom', (chatroom, callback) => callback(chatManager.joinChatRoom(socket.id, chatroom)));

  socket.on('Delete chatroom', (chatroom, callback) => callback(chatManager.deleteChatRoom(chatroom, socket.id)));

  socket.on('Leave chatroom', (_, callback) => callback(chatManager.leaveChatRoom(socket.id)));

  socket.on('disconnect', () => chatManager.deleteUser(socket.id));

  socket.once('error', error => log(`${socket.id} had this error - ${error}`));

  socket.on('View chatroom members', callback => callback(chatManager.getAllUsersInChatRoom(socket.id)));

  socket.on('List all chatrooms', (callback) => {
    const response = chatManager.getAllChatRooms();
    callback(response);
  });

  socket.on('Chatroom message', (message, callback) => {
    const result = chatManager.sendMessageToRoom(message, socket.id, $io);
    if (result) callback(result);
  });

  socket.on('Direct message', ({ receipient, mssg }, callback) => {
    const result = chatManager.sendADirectMessage(
      mssg,
      socket.id,
      receipient,
      $io,
    );
    if (result) callback(result);
  });
});

process.on('uncaughtException', err => log('uncaught exception', err));
process.on('unhandledRejection', err => log('unhandled rejection', err));

const port = process.env.PORT || 2018;

server.listen(port, () => {
  log('App listening on port', port);
});
