/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch')
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const AWS = require('aws-sdk');

const gqlEndpoint = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const region = process.env['REGION'];

const client = new AWSAppSyncClient({
  url: gqlEndpoint,
  region: region,
  auth: {
      type: 'AWS_IAM',
      credentials: AWS.config.credentials
  },
  disableOffline: true,
});

const updateStatus = async function (variables) {
  // Query
  const getStatus = gql(`
    query GetStatus($id: ID!) {
      getStatus(id: $id) {
        _version
      }
    }
  `);
  const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $status: String, $stopDate: AWSTimestamp, $_version: Int!) {
      updateStatus(input: {
        id: $id
        status: $status
        stopDate: $stopDate
        _version: $_version
      }) {
        __typename
        id
        status
        owner
        description
        src_url
        recordingEnabled
        recordingFileUri
        transcriptionEnabled
        transcriptionStatus
        transcriptionMediaFileUri
        transcriptFileUri
        broadcastEnabled
        broadcastRtmpUri
        startDate
        stopDate
        _version
        _deleted
        _lastChangedAt
      }
    }
  `);
  // Check current _version
  await client.query({ variables: variables, query: getStatus, fetchPolicy: 'network-only' })
    .then((data) => {
        variables._version = data.data.getStatus._version;
    })
    .catch((err) => console.log(JSON.stringify(err)));    
  // Update
  const data = await client.mutate({ variables: variables, mutation: updateStatus })
    .then((data) => console.log(JSON.stringify(data)))
    .catch((err) => console.log(JSON.stringify(err)));
  return data
};

exports.handler = async (event) => {
    console.log(JSON.stringify(event))
    const {name: executionName, status, startDate, stopDate} = event.detail;
    const variables = {
        id: executionName,
        status: status,
        stopDate: stopDate,
    };
    const data = await updateStatus(variables);
    return data;
};
