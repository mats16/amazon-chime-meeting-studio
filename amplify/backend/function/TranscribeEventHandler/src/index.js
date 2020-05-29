/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
	STORAGE_RECORDINGSTORE_BUCKETNAME
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch');
const gql = require('graphql-tag');
//const path = require('path');
const request  = require('request-promise-native');
const AmazonS3URI = require('amazon-s3-uri')
const AWSAppSyncClient = require('aws-appsync').default;
const AWS = require('aws-sdk');
const transcribeservice = new AWS.TranscribeService();
const s3 = new AWS.S3();

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
    mutation UpdateStatus($id: ID!, $transcriptionStatus: String, $transcriptFileUri: AWSURL, $_version: Int!) {
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
            recordingFileUri
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
    // AppSync 側の _version を確認する
    const res_old_status = await client.query({variables: variables, query: getStatus})
        .catch((err) => console.log(JSON.stringify(err)))
    const old_status = res_old_status.data.getStatus;
    variables._version = old_status._version
    const recordingFileUri = old_status.recordingFileUri

    if (TranscriptionJobStatus === 'COMPLETED') {
        // 終了している場合は TranscriptFileUri を確認する
        const data = await transcribeservice.getTranscriptionJob({ TranscriptionJobName: TranscriptionJobName }).promise()
            .catch((err) => console.log(JSON.stringify(err)));
        const TranscriptFileUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
        // Transcibe の S3 から取得
        const transcript_text = await request(TranscriptFileUri)
            .catch((err) => console.log(JSON.stringify(err)));
         // S3 にコピー
        const { bucket, key } = AmazonS3URI(recordingFileUri);
        const prefix = key.split('/').slice(0,-1).join('/');
        const file_name = AmazonS3URI(TranscriptFileUri).uri.pathname.split('/').pop()
        const params = {
            Body: transcript_text, 
            Bucket: bucket, 
            Key: `${prefix}/${file_name}`
        };
        await s3.putObject(params).promise()
            .catch((err) => console.log(JSON.stringify(err)));
        variables.transcriptFileUri = `s3://${bucket}/${prefix}/${file_name}`;
    }
    // AppSync の transcriptionStatus を更新する
    await client.mutate({variables: variables, mutation: updateStatus})
        .then((data) => console.log(JSON.stringify(data)))
        .catch((err) => console.log(JSON.stringify(err)))

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
