class Client {
  constructor(name, socket, color) {
    this.name = name;
    this.id = socket.id;
    this.color = color;
    this.socket = socket;
    this.chatroom = null;
  }
}

export default Client;
