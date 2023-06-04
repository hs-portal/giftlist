Welcome!

To set up this template, we will first need to make some configurations!

## Step 1 ##
Create new expo project ( npx create-expo-app [appname]), then copy over/replace files with HS App Template files, and run 'npm install'

## Step 2 ##
Create new Mongo App (App Services -> Create App From Template -> React.js + Realm Web Boilerplate), then update RealmApp.js, providing new App ID
--setup sync

## Step 3 ##
Initial configurations will be needed in app.json; Scheme (for routing back to app after auth),
name/slug, and package name (com.organisation.appname). Remove 'extra->eas->projectID' object, this will get added back in later. 
Rename 'name' in package.json, and in package-lock.json

## Step 4 ##
Create new google webapp, configure oAuth consent screen (external) - provide app name, support/dev email,
add scopes - email and profile, add test users, save. Create oAuth credentials - type:android,
package name: com.hotsource.appname, and provide sha-1 fingerprint - see https://docs.expo.dev/guides/google-authentication/#create-client-ids .
Add clientID provided, to providers->AuthProvider and modify redirectUri scheme to match one defined in app.json

## Step 5 ##
Time to build! Run npx prebuild --clean to prebuild the app, then npx expo run:android to run the app in an emulator.
To finalise Google Auth, run a test google login and obtain the console logged idToken. 
Pass the encoded token here: https://jwt.io/ , and copy the 'aud' string from the payload. Back in Mongo, Select the relevant app->Authentication,
enable JWT, and edit like so: Provider Enabled: true, Verification Method: JWK URI, JWK URI: https://www.googleapis.com/oauth2/v3/certs,
Metadata fields: email:name, email:email, and Audience: aud string gathered above. Save/Deploy. WHilst in authentication, ensure
email/name is also enabled. 

## Step 6 ##
WHilst still in Mongo, we need to set up device sync. Settings as follow:
Type: Partition-based. Cluster: AtlasCluster (this is subject to change). Dev mode enable (whilst still defining schemas etc) Partition Key: '_partition' - type:string (subject to change)
Permissions: (For now): 'Users can only read and write their own data. Save and redeploy. Schemas are defined in the schemas.js file. Changes here
will cause headaches with the device sync, hence the reccomendation to leave dev mode enabled for now...

## Step 8 ##
We are going to need decent error reporting, particularly at apk build time. Head over to sentry.io and create a new project. 
## Configure DSN for sentry config in app/index.js, and project name in sentry section (hooks) in app.js - See the following guide:
https://docs.expo.dev/guides/using-sentry/ for more info

## Step 9 ##
Time to actually build the app! Code away, and when ready to build an apk to test production build, follow step 10.

## Step 10 ##
Build packages will be configured here: eas.json. Need to write more on this process, (aka come back to this later!)


##NOTES

Replacing material kit with react-native-paper
npm install react-native-paper
npm install react-native-safe-area-context

https://callstack.github.io/react-native-paper/docs/guides/getting-started

babel.config.js:

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};