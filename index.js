const cron = require("node-cron");
const data = require("./data/archivo.json");
const axios = require("axios");
const express = require("express");

// Genera un número aleatorio entre 1 y 5
function getRandomObject() {
  const min = 1;
  const max = 500;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función mensaje
const mensaje = async () => {
  return JSON.stringify(data[getRandomObject()]);
};

// Enviar un mensaje programado de texto a Whatsapp
async function sendWhatsapp(message) {
  const phone = "+57305556644"; // Ingresa tu número de teléfono aquí
  const apikey = "8571244444"; // Ingresa tu clave de API personal api.callmebot.com

  const url = `https://api.callmebot.com/whatsapp.php?source=php&phone=${phone}&text=${encodeURIComponent(
    message
  )}&apikey=${apikey}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

// Programa una tarea para que se ejecute a las horas especificadas
const scheduleCronJob = (cronTime) => {
  cron.schedule(
    cronTime,
    async () => {
      try {
        const result = await mensaje();
        await sendWhatsapp(result);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "America/Bogota", // Zona horaria de Colombia
    }
  );
};

// Programar múltiples tareas de cron
const cronTimes = [
  "00 06 * * *",
  "10 08 * * *",
  "05 08 * * *",
  "07 08 * * *",
  "04 10 * * *",
  "02 10 * * *",
  "00 17 * * *",
  "28 17 * * *",
];
cronTimes.forEach(scheduleCronJob);

// Mantén el proceso en ejecución
setInterval(() => {}, 1 << 30);

// CREA UN SERVER CON EXPRESS PARA QUE SEA ACCESIBLE POR LA INTERNET
const server = express();
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// CREA UNA RUTA PARA QUE SEA ACCESIBLE
server.get("/", async (request, response) => {
  try {
    const result = await mensaje(); ///mensaje ramdom
    console.log(result);
    await sendWhatsapp(result); //envia el mensaje
    response.send(result);
  } catch (error) {
    console.error("Error:", error);
    response.status(500).send("Error al enviar el mensaje");
  }
});
