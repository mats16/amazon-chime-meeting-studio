// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Status, AccountSettings } = initSchema(schema);

export {
  Status,
  AccountSettings
};