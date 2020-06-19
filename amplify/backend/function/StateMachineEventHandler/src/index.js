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

const updateExecution = gql(`
  mutation UpdateExecution($id: ID!, $status: String) {
    updateExecution(input: {
      id: $id
      status: $status
    }) {
      id
      owner
      collaborators
      collaborationGroups
      description
      status
      src_url
      recordingEnabled
      recordingFileUri
      transcriptionEnabled
      transcriptionLanguageCode
      transcriptionMaxSpeakerLabels
      transcriptionStatus
      transcriptionMediaFileUri
      transcriptFileUri
      broadcastEnabled
      broadcastRtmpUri
      createdAt
      updatedAt
    }
  }
`);

exports.handler = async (event) => {
    console.log(JSON.stringify(event))
    const {name: executionName, status} = event.detail;
    const variables = {
        id: executionName,
        status: status
    };
    await client.mutate({ variables: variables, mutation: updateExecution })
      .then((data) => console.log(JSON.stringify(data)))
      .catch((err) => console.log(JSON.stringify(err)));
};
