import * as functions from "firebase-functions";
import { store } from "./database";

export const save = functions.https.onRequest((request, response) => {
  const event = {
    // Client-provided values
    uid: request.body.uid,
    client: request.body.client,
    key: request.body.key,
    value: request.body.value,

    // Optional (TODO: make it required like the other fields)
    sent: request.body.sent,

    // Additional values
    received: new Date().toISOString()
  };

  // Validate data
  if (!event.uid || !event.client || !event.key || !event.value) {
    response.status(400).send("Bad Request");
    return;
  }

  // Store data
  store(event)
    .then(() => {
      response.send("OK");
    })
    .catch(() => {
      response.status(500).send("Internal Server Error");
    });
});
