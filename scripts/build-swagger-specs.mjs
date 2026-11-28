import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// Собирает api/*.yaml в docs/swagger-ui/specs.js: js-yaml разрешает якоря
// и алиасы, которые Swagger UI и AsyncAPI UI не читают напрямую.

const apiDir = path.resolve("api");
const outFile = path.resolve("docs", "swagger-ui", "specs.js");

const openapiFiles = [
  "catalog-service.yaml",
  "inventory-service.yaml",
  "booking-service.yaml",
  "pickup-service.yaml",
  "notification-service.yaml",
];
const asyncapiFiles = ["booking-events.asyncapi.yaml"];

function load(file) {
  return yaml.load(fs.readFileSync(path.join(apiDir, file), "utf8"));
}

const openapi = {};
for (const file of openapiFiles) {
  openapi[file.replace(/\.yaml$/, "")] = load(file);
}
const asyncapi = {};
for (const file of asyncapiFiles) {
  asyncapi[file.replace(/\.asyncapi\.yaml$/, "")] = load(file);
}

const banner = `// Сгенерировано scripts/build-swagger-specs.mjs из api/*.yaml. Не редактировать вручную.
// Регенерация: npm install && npm run build:docs
`;
const data = `window.OPENAPI_SPECS = ${JSON.stringify(openapi)};
window.ASYNC_API_SPECS = ${JSON.stringify(asyncapi)};
`;
fs.writeFileSync(outFile, banner + data);
console.log(`Wrote ${outFile}: ${openapiFiles.length} OpenAPI + ${asyncapiFiles.length} AsyncAPI specs`);
