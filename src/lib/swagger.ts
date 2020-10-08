import swaggerJsDoc = require("swagger-jsdoc");
import * as fs from "fs";
import * as path from "path";

const options = {
	swaggerDefinition: {
		info: {
			version: "0.0.1",
			title: "Enlight",
			description: "Enlight API",
		},
		host: "localhost:4051",
		// host: "unitaemin.run.goorm.io/enlight",
		basePath: "/",
	},
	apis: ["**/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerPath: string = path.resolve(__dirname, `../Swagger`, `./`);
const dirs = fs.readdirSync(swaggerPath);
for (const [index, fileName] of dirs.entries()) {
	const definitionsName = fileName.replace(".model.json", "");
	swaggerSpec.definitions[definitionsName] = require(`../Swagger/${fileName}`);
}
export { swaggerSpec };
