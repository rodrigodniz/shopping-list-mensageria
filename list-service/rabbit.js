const amqp = require("amqplib");

let channel = null;

async function connectRabbit() {
  if (channel) return channel;

  const amqpUrl = process.env.AMQP_URL;
  if (!amqpUrl) {
    throw new Error("AMQP_URL not defined in environment variables");
  }

  console.log("Conectando ao RabbitMQ...");
  const connection = await amqp.connect(amqpUrl);
  channel = await connection.createChannel();

  await channel.assertExchange("shopping_events", "topic", { durable: true });

  console.log("RabbitMQ conectado com sucesso!");
  return channel;
}

async function publishEvent(routingKey, message) {
  const ch = await connectRabbit();
  ch.publish("shopping_events", routingKey, Buffer.from(JSON.stringify(message)), {
    persistent: true,
    contentType: "application/json"
  });
  console.log("Evento publicado:", routingKey, message);
}

module.exports = { publishEvent };
