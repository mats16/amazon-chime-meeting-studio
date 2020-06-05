/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch')
const gql = require('graphql-tag');
const AWS = require('aws-sdk');
const transcribeservice = new AWS.TranscribeService();
const AWSAppSyncClient = require('aws-appsync').default;

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

const getStatus = gql(`
    query GetStatus($id: ID!) {
        getStatus(id: $id) {
            transcriptionEnabled
            _version
        }
    }
`);

const updateStatus = async function (variables) {
  // Query
  const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $transcriptionStatus: String, $transcriptionMediaFileUri: AWSURL, $_version: Int!) {
      updateStatus(input: {
        id: $id
        transcriptionStatus: $transcriptionStatus
        transcriptionMediaFileUri: $transcriptionMediaFileUri
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
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const transcriptionJobName = event.Records[0].responseElements['x-amz-request-id']
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const executionId = key.split('/')[2]
  // for GraphQL
  const variables = {
    id: executionId,
  }
  // transcription が有効か確認する
  const data = await client.query({ variables: variables, query: getStatus, fetchPolicy: 'network-only' })
    .catch((err) => console.log(JSON.stringify(err)));
  const transcriptionEnabled = data.data.getStatus.transcriptionEnabled;

  if (transcriptionEnabled) {
    const mediaFileUri = `https://s3.${region}.amazonaws.com/${bucket}/${key}`;
    variables.transcriptionMediaFileUri = mediaFileUri;
    const params = {
      LanguageCode: 'ja-JP', /* required */
      Media: { /* required */
        MediaFileUri: mediaFileUri
      },
      TranscriptionJobName: transcriptionJobName, /* required */
      //JobExecutionSettings: {
      //  AllowDeferredExecution: true,
      //  DataAccessRoleArn: dataAccessRoleArn
      //},
      MediaFormat: 'flac',
      Settings: {
      //  ShowAlternatives: true || false,
      //  MaxAlternatives: 'NUMBER_VALUE',
        MaxSpeakerLabels: 10,
        ShowSpeakerLabels: true,
      //  VocabularyFilterMethod: remove | mask,
      //  VocabularyFilterName: 'STRING_VALUE',
      //  VocabularyName: 'STRING_VALUE'
      }
    };
    await transcribeservice.startTranscriptionJob(params).promise()
      .then((data) => {
        console.log(data);
        variables.transcriptionStatus = data.TranscriptionJob.TranscriptionJobStatus;
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        variables.transcriptionStatus = 'ERROR';
      })
    await updateStatus(variables);
  }
};
