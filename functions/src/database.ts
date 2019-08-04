/**
 * Module for interacting with the database
 */

import admin = require("firebase-admin");
import functions = require("firebase-functions");

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const collection = db.collection("logs");

/**
 * Store the given document in the logs collection
 * @param document an object populated with the values to store
 */
export const store = function(document: Object) {
  return collection.add(document);
};
