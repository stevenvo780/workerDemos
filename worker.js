import fetch from 'node-fetch';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const calls = require("./calls.json");

let count = 0;
function isKeyExists(obj, key) {
  if (obj[key] == undefined) {
    return false;
  } else {
    return true;
  }
}

async function callAPI() {
  const options = calls[count];
  if (options) {
    if (isKeyExists(options.options.headers, "Content-Type")
      && options.options.headers["Content-Type"] === "application/json"
      && options.options.body) {
      options.options.body = JSON.stringify(options.options.body);
    }

  }
  await fetch(
    options.url,
    options.options
  )
    /* Es importante que se procesen todas las peticiones
    * aunque tengan errores, para que no se quede bloqueado
    */
    .then((response) => {
      callAPIS();
      if (response.status !== 200) {
        console.error(response);
      }
    })
    .catch((err) => console.log(err));
};

function callAPIS() {
  setTimeout(() => {
    count++;
    if (count < calls.length) {
      callAPI();
    }
    // Este valor define la recurrencia entre las peticiones
    // Cambiarlo para cambiar la carga generada a las APIS
  }, 1000);
}

callAPI();
