# Angular Firebase Project Skeleton

This project is a sample project off of which to build Firebase applications with authentication and realtime database support using [AngularFire2](https://github.com/angular/angularfire2)

It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.3.

## Firebase Setup

In order to run the sample, you will need to create a firebase project from the [console](https://console.firebase.google.com/) and enable Google authentication. You can also alter the code if you want to use another sign in provider.

Then create `src/app/config/firebase-config.ts` and fill it out according to the credentials taken from the firebase console. You can get the config object by clicking "Add Firebase to your web app"

The contents of the file should look similar to this:
```
export const config = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'YOUR_AUTH_DOMAIN_HERE',
  databaseURL: 'YOUR_DATABASE_URL_HERE',
  projectId: 'YOUR_PROJECT_ID_HERE',
  storageBucket: 'YOUR_STORAGE_BUCKET_HERE',
  messagingSenderId: 'YOUR_MESSENGER_SENDER_ID_HERE'
};
```
### Publishing Rules
The default Firebase realtime database rules are as follows:
```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
For increased security and performance, it is recommended that you replace these rules with those defined in `firebase-database-rules.json`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Run `node distribution-server.js` in order to test the build (runs on `localhost:3000`)

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
