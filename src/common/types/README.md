# Common types

Common types are files that only contain typescript definitions and are named using the `<filename>.d.ts` notation.

**_Note:_** Those common typescript definitions **are not exported using the barrel export pattern** because it is important to keep the context of the types' imports based on their file names.
