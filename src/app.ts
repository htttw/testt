import express from "express";
import session from "express-session";
import cors from "cors";
import dirPath from "path";
import multer from "multer";
import fs from "fs";

import { auth } from "./middlewares";
import * as routes from "./routes";
import config from "./utils/config";

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import socketRouter from "./socketRoutes";

class App {
  public server = express();
  public socketServer: http.Server;
  public io!: SocketIOServer;

  constructor() {
    this.server = express();
    this.socketServer = http.createServer(this.server);
    this.session();
    this.initSocketIO();
    this.middlewares();
    this.routes();
  }

  session() {
    this.server.use(
      session({ secret: config.secret, resave: true, saveUninitialized: true })
    );
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(
      multer({
        storage: multer.diskStorage({
          destination: function (req, file, cb) {
            const { store }: any = req.headers;
            let folterStore: any = store;
            if (parseInt(store) <= 9) {
              folterStore = `0${folterStore}`;
            }
            let destination = dirPath.join(
              __dirname,
              `../input/${folterStore}`
            );
            fs.mkdirSync(destination, { recursive: true });

            cb(null, destination);
          },
          filename: async (req, file, cb) => {
            const { store }: any = req.headers;
            let folterStore: any = store;
            if (parseInt(store) <= 9) {
              folterStore = `0${folterStore}`;
            }
            const newFiles = await fs.promises.readdir(`input/${folterStore}`);

            let name = newFiles.length;
            let numSum = "0";
            if (newFiles.length > 9) {
              numSum = "";
            }
            cb(null, numSum + name + ".jpg".toString());
          },
        }),
        dest: dirPath.join(__dirname, "../input"),
      }).fields([{ name: "image" }, { name: "store" }])
    );
  }

  routes() {
    this.server.use(express.static("input"));
    this.server.use("/api/image", auth, routes.ImageRouter);
    this.server.use("/api/user", auth, routes.UserRouter);
  }
  initSocketIO() {
    this.io = new SocketIOServer(this.socketServer, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection", (socket: any) => {
      socket.on("listConnectedStore", (data: any) => {
        this.io.emit("listRequestStore", data);
      });

      socket.on("updateStore", async (data: any) => {
        socketRouter.imageSocket.sendImageUsers(this.io, data);
      });

      socket.on("listUser", (data: any) => {
        this.io.emit("storeConnected", data);
      });

      socket.on("permissionUpdateStore", (data: any) => {
        this.io.emit("permissionUpdateStoreClient", data);
      });

      socket.on("resImageUsers", (data: any) => {
        this.io.emit("resetSliderUser", data);
      });
    });
  }
}

export default new App().socketServer;
