/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch')
const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;
const aws = require('aws-sdk');

const url = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const region = process.env['REGION'];
const authType = 'AWS_IAM';

const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
      type: authType,
      credentials: aws.config.credentials
    },
    disableOffline: true,
});

// クエリ
const createStatus = gql(`
    mutation CreateStatus($id: ID!, $status: String!, $owner: String!, $src_url: String, $dst_url: [AWSURL], $recordingFileUri: AWSURL, $recordingEnabled: Boolean, $transcriptionEnabled: Boolean, $broadcastEnabled: Boolean, $startDate: AWSTimestamp) {
        createStatus(input: {
            id: $id
            status: $status
            owner: $owner
            src_url: $src_url
            dst_url: $dst_url
            recordingFileUri: $recordingFileUri
            recordingEnabled: $recordingEnabled
            transcriptionEnabled: $transcriptionEnabled
            broadcastEnabled: $broadcastEnabled
            startDate: $startDate
        }) {
            __typename
            id
            status
            owner
            src_url
            dst_url
            recordingEnabled
            transcriptionEnabled
            broadcastEnabled
            startDate
            _version
            _deleted
            _lastChangedAt
        }
    }
`);
const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $status: String!, $stopDate: AWSTimestamp, $_version: Int!) {
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
            src_url
            dst_url
            recordingFileUri
            recordingEnabled
            transcriptionEnabled
            broadcastEnabled
            startDate
            stopDate
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
    const {name: execution_id, status, startDate, stopDate} = event.detail
    const input = JSON.parse(event.detail.input);

    let mutation = ''
    let variables = {
        id: execution_id,
        status: status
    }
    if (status === "RUNNING") {
        mutation = createStatus
        variables = {
            ...variables,
            owner: input.owner,
            src_url: input.src_url,
            dst_url: input.dst_url,
            recordingEnabled: input.recordingEnabled,
            recordingFileUri: input.recordingFileUri,
            transcriptionEnabled: input.transcriptionEnabled,
            broadcastEnabled: input.broadcastEnabled,
            startDate: startDate
        }
    } else {
        mutation = updateStatus
        // AppSync 側の _version を確認する
        await client.query({ variables: variables, query: getStatus })
            .then((data) => {
                const old_status = data.data.getStatus;
                variables = {
                    ...old_status,
                    ...variables,
                    stopDate: stopDate};
            })
            .catch((err) => console.log(JSON.stringify(err)))
    }


    await client.mutate({variables: variables, mutation: mutation})
        .then((data) => console.log(JSON.stringify(data)))
        .catch((err) => console.log(JSON.stringify(err)))

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
