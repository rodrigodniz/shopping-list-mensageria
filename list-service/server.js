const express = require("express");
const { publishEvent } = require("./rabbit");
const uuid = require("uuid").v4;


const app = express();
app.use(express.json());


app.post("/lists/:id/checkout", async (req, res) => {
  const listId = req.params.id;


  const event = {
    eventId: uuid(),
    eventType: "list.checkout.completed",
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    list: {
      id: listId,
      items: [
        { id: "ITEM1", qty: 2, price: 5.50 },
        { id: "ITEM2", qty: 1, price: 12.90 }
      ]
    },
    user: {
      id: "USER1",
      email: "user@email.com"
    }
  };

  await publishEvent("list.checkout.completed", event);

  return res.status(202).json({
    status: "accepted",
    message: "Checkout processado de forma assíncrona",
    eventId: event.eventId
  });
});

app.listen(3000, () =>
  console.log("List Service rodando na porta 3000…")
);
