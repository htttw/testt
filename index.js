const httpServer = require("http").createServer();

let messages = [
  {
    colorCode: "aqua",
    name: "cristobal",
    message: "hola",
  },
];

let server = httpServer.listen(process.env.PORT || 3001, () => {
  console.log("...");
});
let io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", function (socket) {
  console.log("usuario conectado", socket.id);

  socket.emit("messagesUsers", messages);

  socket.on("sendMessages", (text) => {
    messages.push({
      name: text.name,
      message: text.message,
      colorCode: text.colorCode,
    });
    console.log(text);
    io.emit("messagesUsers", messages);

    if (messages.length > 200) {
      messages = [
        {
          colorCode: 0,
          name: "Admin",
          message: "chat reset",
        },
      ];
    }
  });

  socket.on("disconnect", (text) => {
    console.log("usuario desconectado");
   socket.disconnect();
  });
});
