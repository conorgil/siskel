/**
 * Module for interacting with the database
 */

import admin = require("firebase-admin");
import functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const collection = db.collection("logs");

/**
 * Store the given documents in the logs collection
 * @param logs an array of log entries to be stored
 */
export const store = function(logs: Object[]) {
  // Use batch for atomic writes
  const batch = db.batch();

  for (const log of logs) {
    const newLogRef = collection.doc();
    batch.set(newLogRef, log);
  }

  return batch.commit();
};
