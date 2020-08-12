/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch')
const path = require('path');
const gql = require('graphql-tag');
const AWS = require('aws-sdk');
const transcribeservice = new AWS.TranscribeService();
const AWSAppSyncClient = require('aws-appsync').default;

const url = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const region = process.env['REGION'];
const env = process.env['ENV'];

const client = new AWSAppSyncClient({
    url: url,
    region: region,
    auth: {
      type: 'AWS_IAM',
      credentials: AWS.config.credentials
    },
    disableOffline: true,
});

const getExecution = gql(`
  query GetExecution($id: ID!) {
    getExecution(id: $id) {
      transcriptionEnabled
      transcriptionLanguageCode
      transcriptionMaxSpeakerLabels
    }
  }
`);
const updateExecution = gql(`
  mutation UpdateExecution($id: ID!, $transcriptionStatus: String, $transcriptionMediaFileUri: AWSURL) {
    updateExecution(input: {
      id: $id
      transcriptionStatus: $transcriptionStatus
      transcriptionMediaFileUri: $transcriptionMediaFileUri
    }) {
      id
      owner
      collaborators
      groups
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
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const requestId = event.Records[0].responseElements['x-amz-request-id']
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const ext = path.parse(key).ext;
  if (ext === '.flac') {
    const executionId = key.split('/')[2];
    const gqlVariables = {
      id: executionId,
    }
    // Check transcriptionEnabled and config
    const data = await client.query({ variables: gqlVariables, query: getExecution, fetchPolicy: 'network-only' })
      .catch((err) => console.log(JSON.stringify(err)));
    const { transcriptionEnabled, transcriptionLanguageCode, transcriptionMaxSpeakerLabels } = data.data.getExecution;

    if (transcriptionEnabled) {
      const mediaFileUri = `https://s3.${region}.amazonaws.com/${bucket}/${key}`;
      //variables.transcriptionMediaFileUri = mediaFileUri;
      const params = {
        LanguageCode: transcriptionLanguageCode,
        Media: {
          MediaFileUri: mediaFileUri
        },
        TranscriptionJobName: requestId,
        //JobExecutionSettings: {
        //  AllowDeferredExecution: true,
        //  DataAccessRoleArn: dataAccessRoleArn
        //},
        MediaFormat: 'flac',
        Settings: {
        //  ShowAlternatives: true || false,
        //  MaxAlternatives: 'NUMBER_VALUE',
          MaxSpeakerLabels: transcriptionMaxSpeakerLabels,
          ShowSpeakerLabels: true,
        //  VocabularyFilterMethod: remove | mask,
        //  VocabularyFilterName: 'STRING_VALUE',
        //  VocabularyName: 'STRING_VALUE'
        }
      };
      await transcribeservice.startTranscriptionJob(params).promise()
        .then((data) => {
          console.log(JSON.stringify(data));
          gqlVariables.transcriptionStatus = data.TranscriptionJob.TranscriptionJobStatus;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          gqlVariables.transcriptionStatus = 'ERROR';
        })
      await client.mutate({ variables: gqlVariables, mutation: updateExecution })
        .then((data) => console.log(JSON.stringify(data)))
        .catch((err) => console.log(JSON.stringify(err)));
    }
  }
};
