const amqp = require("amqplib");

async function start() {
  try {
    const AMQP_URL = process.env.AMQP_URL;

    if (!AMQP_URL) {
      throw new Error("AMQP_URL não definida nas variáveis de ambiente!");
    }

    console.log("Conectando ao RabbitMQ (CloudAMQP)...");
    const conn = await amqp.connect(AMQP_URL);
    const ch = await conn.createChannel();

    const exchange = "shopping_events";
    const queue = "q.analytics";
    const routingKey = "list.checkout.#";

    await ch.assertExchange(exchange, "topic", { durable: true });
    await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(queue, exchange, routingKey);

    console.log("📊 Analytics Worker conectado.");
    console.log("Aguardando eventos...");

    ch.consume(queue, (msg) => {
      if (!msg) return;

      const event = JSON.parse(msg.content.toString());

      const listId = event.list?.id;
      const items = event.list?.items || [];

      const total = items.reduce((acc, item) => {
        const qty = item.qty ?? 1;
        const price = item.price ?? 0;
        return acc + qty * price;
      }, 0);

      console.log(
        `📈 Atualizando dashboard: lista ${listId} total calculado = R$ ${total.toFixed(
          2
        )}`
      );

      ch.ack(msg);
    });
  } catch (err) {
    console.error("Erro no worker:", err);
    process.exit(1);
  }
}

start();
