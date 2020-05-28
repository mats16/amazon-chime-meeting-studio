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
const transcribeservice = new AWS.TranscribeService();

const url = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const region = process.env['REGION'];
const authType = 'AWS_IAM';

const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
      type: authType,
      credentials: AWS.config.credentials
    },
    disableOffline: true,
});

const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $transcriptionStatus: String!, $transcriptFileUri: AWSURL, $_version: Int!) {
        updateStatus(input: {
            id: $id
            transcriptionStatus: $transcriptionStatus
            transcriptFileUri: $transcriptFileUri
            _version: $_version
        }) {
            __typename
            id
            transcriptionStatus
            transcriptFileUri
            _version
            _deleted
            _lastChangedAt
        }
    }
`);
const getStatus = gql(`
    query GetStatus($id: ID!) {
        getStatus(id: $id) {
            _version
        }
    }
`);

exports.handler = async (event) => {
    console.log(event)
    const {TranscriptionJobName, TranscriptionJobStatus} = event.detail
    const variables = {
        id: TranscriptionJobName,
        transcriptionStatus: TranscriptionJobStatus
    }
    if (TranscriptionJobStatus === 'COMPLETED') {
        // 終了している場合は TranscriptFileUri を確認する
        try {
            const data = await transcribeservice.getTranscriptionJob({TranscriptionJobName: TranscriptionJobName}).promise();
            console.log(data);
            variables.transcriptFileUri = data.TranscriptionJob.Transcript.TranscriptFileUri
          } catch (err) {
            console.log(JSON.stringify(err));
          }
    }
    // AppSync 側の _version を確認する
    try {
        res = await client.query({
            variables: variables,
            query: getStatus
        });
        const old_status = res.data.getStatus
        variables._version = old_status._version
    } catch (err) {
        console.log(JSON.stringify(err));
    }
    // AppSync の transcriptionStatus を更新する
    try {
        res = await client.mutate({
            variables: variables,
            mutation: updateStatus
        });
        console.log(JSON.stringify(res));
    } catch (err) {
        console.log(JSON.stringify(err));
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
