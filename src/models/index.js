// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Status } = initSchema(schema);

export {
  Status
};