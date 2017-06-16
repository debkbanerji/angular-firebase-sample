# Angular Firebase Project Sample

This is a sample project off of which to build Firebase applications with authentication and realtime database support using [AngularFire2](https://github.com/angular/angularfire2).

Made with ♥ by Deb Banerji

## Setup

### Dependencies

In order to build the project, you will need both [Node.js](https://nodejs.org/en/) and the Node Package Manager (which can be installed alongside Node.js).

You will also need the [Angular CLI](https://github.com/angular/angular-cli) which can be installed through npm by running the following command:

```
npm install -g @angular/cli
```

Using `-g` will install the command line interface globally, allowing you to use the `ng` command, which is required to run the development server, as well as build the project.

After you have installed npm, run `npm install` in order to install the remaining dependencies.

### Firebase Setup

In order to run the project, you will need to create a Firebase project from the [Firebase console](https://console.firebase.google.com/)
You will also need to enable Google authentication. You can also alter the code if you want to use another sign in provider.
Note that if you are running the application anywhere other than `localhost` you will need to allow login from other URLS through the Firebase Console.

Then create `src/app/config/firebase-config.ts` and fill it out according to the credentials taken from the Firebase console. You can get the config object by clicking "Add Firebase to your web app"

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
#### Publishing Rules

The default Firebase realtime database rules are as follows:
```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
For increased security and performance, it is recommended that you replace these rules with those defined in `firebase-database-rules.json`.

For faster (albeit less secure) development, you can also replace the rules with:
```
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

### Replacing Placeholders

All placeholders in the application which should be replaced by your own information have been marked by `TODO: replace`.
The exception is `package.json` and `dist-utility-files/package.json` as JSON does not allow for comments. Don't forget to update those.

#### `TODO: Update package.json files`

Also, don't forget to replace the content of this `README.md` file with your own.

#### `TODO: Replace`

## Starting The Application

You can start a development server by running `npm start` and navigating to `http://localhost:4200/` The app will automatically reload if you change any of the source files.
Note that this is simply a wrapper around `ng serve`.

## Building The Application

You can create a production build of the application in the `dist` folder by running the `build` npm script:

`npm run build`

This is a wrapper around the `ng build -prod` command which creates a production build of the application. It also copies over both a `package.json` file (for npm) and a `server.js` file.
This server file will run the application on `http://localhost:3000/`.

You can use `npm run messy-build` in order to build the application without the production flag, which may be necessary if you are running into errors while building.

If you only want the static files, without the server and package files, you can simply run `ng build` yourself. If you do this, you can also run `node distribution-server.js` in order to test the build.

## Using The Angular CLI

You can use the [Angular CLI](https://github.com/angular/angular-cli) to aid development by running the `ng` command.

### Development server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
