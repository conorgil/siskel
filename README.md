Simple Serverless Keyed Event Log
=================================

## What problem does this solve?
You have an app and want to send data (e.g., events, logs, etc.) to an append-only database. You don't want to integrate any database connectors or other libraries into the app; you just want to make an HTTPS request and forget about it.


## What does this project provide?
This is the code for a [Firebase](https://firebase.google.com) project that provides an integrated solution to this problem. Specifically, it defines:

- an [HTTP-triggered function](https://firebase.google.com/docs/functions/http-events) providing endpoint you can query with your data
- the [database](https://firebase.google.com/docs/firestore/) (i.e., the configuration for it) where the data gets stored
- a [hosted](https://firebase.google.com/docs/hosting) webpage that allows quick access to the data
- a script that lets you download the data (and that you can use a starting point for more complicated data processing)

With Firebase, you have the option of the function running under a custom domain name that you bring in.


## Usage
### Storing data
To store data, make a POST request to `https://your_project_url/save` with the following fields:

- `value`, the data you want to store
- `key`, the key you want to use to identify this data (it need not be unique). For example, this could be the type of the event you're logging.
- `uid`, an identifier for the user associated with this event
- `client`, an identifier for the client issuing this request (e.g., the app version)

These fields are required, but the data types are not enforced. Especially useful for `value`, they can be nested JSON objects.

#### No authentication
**Anyone can write to the database.** Requests are neither authenticated nor validated. It is assumed that you have an ex post facto way of identifying valid requests.


## Previewing data
To see your data on a webpage, go to `https://your_project_url/get`. You will need to authenticate with a whitelisted email (see Setup below).


## Downloading data
A Python script for printing the contents of the database is provided in the `client` directory.

To run it, you will need to:

1. Install the `firebase-admin` dependency into your Python environment. (A [Pipfile](https://docs.pipenv.org/) is provided for your convenience.)
2. [Create a service account](https://cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances) and obtain its JSON key file
3. Place the key file in the `client` directory as `key.json` (or, conversely, update the script with the path to the file)


## Setup
Here are the instructions for setting up your own instance of this application.

0. Clone this repo
1. Modify `firestore.rules` to whitelist the email address(es) you want to be able to access the data through a webpage. Authentication will be done (as with everything else) by [Firebase](https://firebase.google.com/docs/auth). You can also skip this step and only use the command-line client (see above).
2. In the top level of the repo, run `npm install` to get `firebase-tools`
3. Run `npx firebase login` to log in
4. Go to the [Firebase console](https://console.firebase.google.com) and *Add project*
5. Once you've created the project, go to the *Authentication* product dashboard, click on *Sign-in method*, and enable the *Email/Password* option. (I also use the *Email link* option.)
6. Go to the *Database* dashboard and provision a database.
7. Run `npx firebase use --add` and select the project you just created. (`default` is a reasonable choice for the alias, when you're prompted for it.)
8. Go into the `functions` directory and run `npm install` there
9. Back in the root of the repo, run `npx firebase deploy`.

When the deploy is finished, the command will display the "Hosting URL." This is URL to use for storing and retrieving data (just remember to append `/save` or `/get`).

### Adding a custom domain
If you'd like to use your own domain for the URL (rather than the one provided by Firebase), you can follow these steps:

1. In the [Firebase console](https://console.firebase.google.com), select your project, and go to the *Hosting* dashboard.
2. Click the *Connect domain* button and follow the instructions. You'll need to update the DNS settings of your domain.
3. Go to the *Authentication* product dashboard, click on *Sign-in method*, and scroll down to *Authorized domains*. Add the (sub)domain you want to use.
4. After some time, you should be able to use your domain instead of the Firebase subdomain.

(These instructions were current at the time of writing, but the UI may have changed in the meantime.)

