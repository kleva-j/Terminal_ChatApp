class Client {
  constructor(name, socket, color) {
    this.name = name;
    this.id = socket.id;
    this.color = color;
    this.socket = socket;
    this.chatroom = null;
  }

  /**
   * @return {string} the client's current chatroom
   */
  get chatroom() {
    return this.chatroom;
  }

  /**
   * @param {string} chatroom the name of the client chatroom
   */
  set name(chatroom) {
    this.chatroom = chatroom;
  }

  get color() {
    return this.color;
  }

  set color(color) {
    this.color = color;
  }
}

export default Client;
