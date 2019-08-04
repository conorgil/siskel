#!/usr/bin/env python

"""
A script for downloading all data from the database
"""

import pprint

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

COLLECTION = "logs"
KEY_FILE = "key.json"


def main():
    # Use a service account
    cred = credentials.Certificate(KEY_FILE)
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    collection = db.collection(COLLECTION)
    docs = collection.stream()

    for doc in docs:
        pprint.pprint(doc.to_dict())


if __name__ == "__main__":
    main()
