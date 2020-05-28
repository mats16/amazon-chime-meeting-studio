/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

require('isomorphic-fetch')
const gql = require('graphql-tag');
const path = require('path');
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

const updateStatus = gql(`
    mutation UpdateStatus($id: ID!, $transcriptionStatus: String!, $_version: Int!) {
        updateStatus(input: {
            id: $id
            transcriptionStatus: $transcriptionStatus
            _version: $_version
        }) {
            __typename
            id
            transcriptionStatus
            _version
            _deleted
            _lastChangedAt
        }
    }
`);
const getStatus = gql(`
    query GetStatus($id: ID!) {
        getStatus(id: $id) {
            id
            transcriptionEnabled
            _version
        }
    }
`);

exports.handler = async (event) => {
  console.log('Received S3 event:', JSON.stringify(event, null, 2));
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const execution_id = path.parse(key).name;

  const variables = {
    id: execution_id,
  }
  try {
    // AppSync 側のバージョンを確認する
    res = await client.query({
        variables: variables,
        query: getStatus
    });
    const old_status = res.data.getStatus
    variables.transcriptionEnabled = old_status.transcriptionEnabled
    variables._version = old_status._version
  } catch (err) {
      console.log(JSON.stringify(err));
  }
  if (variables.transcriptionEnabled) {
    const media_file_uri = `https://s3.${region}.amazonaws.com/${bucket}/${key}`
    const params = {
      LanguageCode: 'ja-JP', /* required */
      Media: { /* required */
        MediaFileUri: media_file_uri
      },
      TranscriptionJobName: execution_id, /* required */
      //JobExecutionSettings: {
      //  AllowDeferredExecution: true || false,
      //  DataAccessRoleArn: 'STRING_VALUE'
      //},
      MediaFormat: 'mp4',
      MediaSampleRateHertz: 44100,
      Settings: {
      //  ShowAlternatives: true || false,
      //  MaxAlternatives: 'NUMBER_VALUE',
        MaxSpeakerLabels: 6,
        ShowSpeakerLabels: true,
      //  VocabularyFilterMethod: remove | mask,
      //  VocabularyFilterName: 'STRING_VALUE',
      //  VocabularyName: 'STRING_VALUE'
      }
    };
    try {
      const data = await transcribeservice.startTranscriptionJob(params).promise();
      console.log(data);
      variables.transcriptionStatus = data.TranscriptionJob.TranscriptionJobStatus
    } catch (err) {
      console.log(JSON.stringify(err));
      variables.transcriptionStatus = 'ERROR'
    }
    // AppSync のステータスを更新
    try {
      res = await client.mutate({
        variables: variables,
        mutation: updateStatus
      });
      console.log(JSON.stringify(res));
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  }
};
