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

//const recordingBucket = process.env['STORAGE_RECORDINGSTORE_BUCKETNAME']
const gqlEndpoint = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const region = process.env['REGION'];
const authType = 'AWS_IAM';

const client = new AWSAppSyncClient({
    url: gqlEndpoint,
    region: region,
    auth: {
      type: authType,
      credentials: AWS.config.credentials
    },
    disableOffline: true,
});

const getStatus = gql(`
  query GetStatus($id: ID!) {
    getStatus(id: $id) {
      transcriptionEnabled
      _version
    }
  }
`);

const updateStatus = async function (variables) {
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
    console.log(event)
    const {TranscriptionJobName: transcriptionJobName, TranscriptionJobStatus: transcriptionJobStatus} = event.detail
    // TranscriptFileUri, MediaFileUri を確認する
    const transcriptionJob = await transcribeservice.getTranscriptionJob({ TranscriptionJobName: transcriptionJobName }).promise()
        .catch((err) => console.log(JSON.stringify(err)));
    const transcriptFileUri = transcriptionJob.TranscriptionJob.Transcript.TranscriptFileUri;
    const mediaFileUri = transcriptionJob.TranscriptionJob.Media.MediaFileUri
    const { bucket: mediaFileBucket, key: mediaFileKey } = AmazonS3URI(mediaFileUri);
    const executionId = mediaFileKey.split('/')[2];

    const variables = {
      id: executionId,
      transcriptionStatus: transcriptionJobStatus
    }
    // AppSync に レコードがあるか確認する
    const data = await client.query({ variables: variables, query: getStatus, fetchPolicy: 'network-only' })
      .catch((err) => console.log(JSON.stringify(err)));
    const transcriptionEnabled = data.data.getStatus.transcriptionEnabled;

    if (transcriptionEnabled) {
      if (transcriptionJobStatus === 'COMPLETED') {
        // Transcibe の S3 から取得
        const transcriptText = await request(transcriptFileUri)
          .catch((err) => console.log(JSON.stringify(err)));
        // S3 にコピー
        const prefix = mediaFileKey.split('/').slice(0,-1).join('/');
        const fileName = AmazonS3URI(transcriptFileUri).uri.pathname.split('/').pop()
        const params = {
          Body: transcriptText, 
          Bucket: mediaFileBucket, 
          Key: `${prefix}/${fileName}`
        };
        await s3.putObject(params).promise()
          .then(() => {
            variables.transcriptFileUri = `s3://${mediaFileBucket}/${prefix}/${fileName}`;
          })
          .catch((err) => console.log(JSON.stringify(err)));
      };
      const data = await updateStatus(variables);
      return data
    } else {
      console.log(JSON.stringify(transcriptionJob));
      return transcriptionJob
    };
};
