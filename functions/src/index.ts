import * as functions from "firebase-functions";
import { store } from "./database";

export const save = functions.https.onRequest((request, response) => {
  const batchedLogs = request.body.logs;

  if (!batchedLogs || batchedLogs.length === 0) {
    response.status(400).send("Bad Request");
    return;
  }

  for (const log of batchedLogs) {
    // Validate data
    if (!log.uid || !log.version || !log.key || !log.value || !log.lsn) {
      response.status(400).send("Bad Request");
      return;
    }

    // Add timestamp
    log.received = new Date().toISOString();
  }

  // Store data
  store(batchedLogs)
    .then(() => {
      response.send("OK");
    })
    .catch(error => {
      response.status(500).send(error);
    });
});
