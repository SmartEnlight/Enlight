import * as express from "express";
import * as morgan from "morgan";
import * as compression from "compression";
import * as helmet from "helmet";
import * as cors from "cors";
import * as http from "http";
import passport from "./lib/passport";
import { swaggerSpec } from "./lib/swagger";

const swaggerUi = require("swagger-ui-express");
export const admin = require("firebase-admin");
const serviceAccount = require("./Config/serviceAccount.json");
import Router from "./Router";
class App {
	public app: express.Application;
	public server;

	constructor() {
		this.app = express();
		this.middlewareInit();
		this.routerInit();
		this.server = http.createServer(this.app);
	}
	private middlewareInit() {
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json({ limit: "30mb" }));
		this.app.use(morgan(process.env.NODE_MORGAN));
		this.app.use(compression());
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(express.static("public"));
		this.app.use(passport.Init());
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		});
	}
	private routerInit() {
		this.app.use(Router);
		this.app.get("/swagger.json", function (req, res) {
			res.setHeader("Content-Type", "application/json");
			res.send(swaggerSpec);
		});
		var options = {
			swaggerOptions: {
				// url: [`http://localhost:4051/swagger.json`],
				url: [`https://unitaemin.run.goorm.io/enlight/swagger.json`],
			},
		};
		this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(null, options));

		this.app.use(this.autoErrorHandler());
	}
	private autoErrorHandler() {
		return (err, req: express.Request, res: express.Response, next: express.NextFunction) => {
			err.status = err.status || 500;
			err.message = err.message;
			console.log("error", err.message);
			res.status(err.status).send({ result: false, message: err.message });
		};
	}
}

export default App;
