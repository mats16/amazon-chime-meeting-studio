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

// クエリ
const createStatus = gql(`
    mutation CreateStatus($id: ID!, $status: String!, $owner: String!, $src_url: String!, $dst_url: [String!], $recordingEnabled: Boolean!, $startDate: AWSTimestamp!) {
        createStatus(input: {
            id: $id
            status: $status
            owner: $owner
            src_url: $src_url
            dst_url: $dst_url
            recordingEnabled: $recordingEnabled
            startDate: $startDate
        }) {
            __typename
            id
            status
            owner
            src_url
            dst_url
            recordingEnabled
            startDate
            _version
            _deleted
            _lastChangedAt
        }
    }
`);
const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $status: String!, $owner: String, $src_url: String, $dst_url: [String], $recordingEnabled: Boolean, $startDate: AWSTimestamp, $stopDate: AWSTimestamp, $_version: Int!) {
        updateStatus(input: {
            id: $id
            status: $status
            owner: $owner
            src_url: $src_url
            dst_url: $dst_url
            recordingEnabled: $recordingEnabled
            startDate: $startDate
            stopDate: $stopDate
            _version: $_version
        }) {
            __typename
            id
            status
            owner
            src_url
            dst_url
            recordingEnabled
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
            owner
            src_url
            dst_url
            recordingEnabled
            startDate
            _version
        }
    }
`);

exports.handler = async (event) => {
    const {name: execution_id, status, startDate, stopDate} = event.detail
    const input = JSON.parse(event.detail.input);
    const client = new AWSAppSyncClient({
        url: url,
        region: region,
        auth: {
          type: authType,
          credentials: aws.config.credentials
        },
        disableOffline: true,
    });

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
            recordingEnabled: input.recordingEnabled,
            src_url: input.src_url,
            dst_url: input.dst_url,
            startDate: startDate
        }
    } else {
        mutation = updateStatus
        // AppSync 側のバージョンを確認する
        try {
            res = await client.query({
                variables: variables,
                query: getStatus
            });
            const old_status = res.data.getStatus
            variables = {
                ...old_status,
                ...variables,
                stopDate: stopDate}
        } catch (err) {
            console.log(JSON.stringify(err));
        }
    }

    try {
        res = await client.mutate({
            variables: variables,
            mutation: mutation
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
