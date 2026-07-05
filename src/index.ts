import cors from 'cors';
import express, { Express } from 'express';
import * as errorHandler from './middlewares/errorHandler';
import globalError from './middlewares/globalErrorHandler';
import { Database, port,hostUrl } from './config';
import { proxyRouter } from './routes';
import { createServer, Server as HTTPServer } from 'http';


class Server {
  private app: Express;

  constructor() {
    this.app = express();
    this.configureServer();
  
  }

 private configureServer() {
  
   this.app.set("port", port);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));

  this.app.use("/images", express.static("public/images"));

  this.app.get("/", (req, res) => {
    res.send("Welcome to Pets Backend");
  });

  this.app.use("/api", proxyRouter.map());

  // Error handlers 
  this.app.use(errorHandler.genericErrorHandler);
  this.app.use(errorHandler.methodNotAllowed);
  this.app.use(errorHandler.notFound);
  this.app.use(globalError);
}

  private async connectDB() {
    await Database.connect();
  }


   public start() {
    this.connectDB();
    this.app.listen(this.app.get("port"), () =>
      console.log(`App running on PORT ${port}, Host URL:${hostUrl}`),
    );
  }

}

const server = new Server();
server.start();
