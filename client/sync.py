#!/usr/bin/env python

"""
A script for downloading all data from the database
"""

import json
import pprint
import sqlite3

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

COLLECTION = "logs"
KEY_FILE = "key.json"
LOCAL_DB = "database.db"

CREATE_TABLE = """CREATE TABLE IF NOT EXISTS "events" ("id" VARCHAR(32) NOT NULL PRIMARY KEY, "uid" VARCHAR(32) NOT NULL, "client" VARCHAR(32) NOT NULL, "received" TEXT NOT NULL, "sent" TEXT NOT NULL, "key" VARCHAR(64) NOT NULL, "value" JSON NOT NULL)"""


def main():
    connection = sqlite3.connect(LOCAL_DB)
    cursor = connection.cursor()

    # Set up table if it doesn't exist
    cursor.execute(CREATE_TABLE)

    # Do we have data stored there already?
    cursor.execute("SELECT MAX(received) FROM events")
    latest = cursor.fetchone()[0]

    cred = credentials.Certificate(KEY_FILE)
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    collection = db.collection(COLLECTION)

    if latest:
        docs = collection.where("received", ">=", latest).stream()
    else:
        docs = collection.stream()

    events = []
    i = 0
    for doc in docs:
        print(i)
        doc_as_dict = doc.to_dict()

        keys = ["uid", "client", "received", "sent", "key"]
        values = [doc.id]

        for key in keys:
            values.append(doc_as_dict.get(key, ""))

        values.append(json.dumps(doc_as_dict["value"]))

        events.append(values)

        i += 1

    cursor.executemany(
        "INSERT OR IGNORE INTO events VALUES (?, ?, ?, ?, ?, ?, ?)", events
    )
    connection.commit()


if __name__ == "__main__":
    main()
