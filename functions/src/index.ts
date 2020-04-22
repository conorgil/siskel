import * as functions from "firebase-functions";
import { store } from "./database";

export const save = functions.https.onRequest((request, response) => {
  const body = request.body;
  console.log(`Body = ${JSON.stringify(body)}`);

  const event = Object.assign({}, body, {
    receivedAt: new Date().toISOString()
  });

  const requiredFields: string[] = [
    // A key used to identify the value in this event (it need not be unique).
    // For example, this could be the type of the event.
    'key',

    // The data that the client wants to store in the database.
    'value',

    // An identifier for the user associated with this event.
    'uid',

    // An identifier for the client issuing this request (e.g., the app
    // version). Think of this as the client user-agent.
    'clientVersion',

    // Timestamp for when the client generated the event. NOTE: This should be
    // when the event actually occurred on the client and NOT when it was sent
    // to the server.
    'timestamp',

    // The timestamp for when the server received this event from the client.
    'receivedAt'
  ];

  // Validate data
  const missingFields = [];
  for (const fieldName of requiredFields) {
    // Unsafe casting to get around type error:
    // https://stackoverflow.com/a/57192972.
    if (event[fieldName] === undefined) {
      missingFields.push(fieldName);
    }
  }

  if (missingFields.length > 0) {
    const errorMsg = `Missing required fields: [${missingFields.join(', ')}]`;
    response.status(400).send(errorMsg);
  }

  // Store data
  store(event)
    .then(() => {
      response.sendStatus(200);
    })
    .catch((e) => {
      response.sendStatus(500);
      console.log(`Error saving to the DB. Request: ${body}. Error: ${e}.`);
    });
});
