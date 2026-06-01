// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// NOTE: OAuth credentials below have been redacted before publishing this
// snapshot to a public repository. Replace each REDACTED-* placeholder with a
// value loaded from a secret store before running the legacy frontend locally.
export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  googleClientId: 'REDACTED-google-oauth-client-id',
  googleClientSecret: 'REDACTED-google-oauth-client-secret',
  facebookAppId: 'REDACTED-facebook-app-id',
  OwnerId: '2',
  defaultDP: 'assets/img/avatar-other.png'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
