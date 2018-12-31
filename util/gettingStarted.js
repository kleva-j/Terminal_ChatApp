const { log } = console;

const gettingStarted = () => {
  log(`
    🏁 💐 💮 ---------------- Welcome to Trim_Chat ----------------- 💮 💐 🏁

    How to use app:
      HINT: commands should only be typed inside these '< >'

      CHATROOM: you can create, join, leave or delete a chatroom.
      You are allowed be a member of a single chatroom at a time.

      - to create a chatroom type "<create room (name of chatroom)>"
      - to join a chatroom type "<join (name of chatroom)>"
      - to leave a chatroom type "<leave (name of chatroom)>"
      - to delete a chatroom type "<delete room (name of chatroom)>"
      - to view list of users in a chatroom type "<members>"
      - to view the list of chatrooms type "<rooms>"

      SEND MESSAGES: to send a message you must be a member of a/the chatroom.
      - to send a message in a chatroom you are in, just type the message on you terminal/console
      - to send a direct message to someone in a chatroom you are in. Type "<the message @(the person name)>"
  `);
};

export default gettingStarted;
