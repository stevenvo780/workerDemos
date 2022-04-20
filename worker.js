import fetch from "node-fetch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const calls = require("./calls.json");

function objectHasProperty(obj, property) {
  return obj[property] != undefined;
}

async function makeRequest(requestInfo) {
  stringifyRequestBody(requestInfo);

  try {
    const response = await fetch(requestInfo.url, requestInfo.options);
    if (response.status !== 200) {
      console.log(response);
    }
  } catch (err) {
    console.error(err);
  }
}

function stringifyRequestBody(requestInfo) {
  const { headers, body } = requestInfo.options;
  if (
    objectHasProperty(headers, "Content-Type") &&
    headers["Content-Type"] === "application/json" &&
    !!body
  ) {
    requestInfo.options.body = JSON.stringify(body);
  }
}

function delay(time) {
  return new Promise((res) => {
    setTimeout(() => res(), time);
  });
}

(async function () {
  // Este valor define la recurrencia entre las peticiones
  // Cambiarlo para cambiar la carga generada a las APIS
  const recurrencyTimeBetweenRequests = 1000;
  
  for (const requestInfo of calls) {
    await makeRequest(requestInfo);
    await delay(recurrencyTimeBetweenRequests);
  }
})();
