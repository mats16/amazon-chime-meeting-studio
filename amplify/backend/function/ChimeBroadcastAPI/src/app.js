/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT
	API_BROADCASTSTATUSAPI_GRAPHQLAPIIDOUTPUT
	API_BROADCASTSTATUSAPI_STATUSTABLE_ARN
	API_BROADCASTSTATUSAPI_STATUSTABLE_NAME
	ENV
	REGION
	STORAGE_RECORDINGSTORE_BUCKETNAME
Amplify Params - DO NOT EDIT */

const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

require('isomorphic-fetch');
const gql = require('graphql-tag');
const AWS = require('aws-sdk');
const AWSAppSyncClient = require('aws-appsync').default;

const region = process.env['REGION'];
const gqlEndpoint = process.env['API_BROADCASTSTATUSAPI_GRAPHQLAPIENDPOINTOUTPUT'];
const bucketName = process.env['STORAGE_RECORDINGSTORE_BUCKETNAME'];
const stateMachineArn = process.env['STATEMACHINE_BROADCASTCONTAINER_ARN'];

const awsPartitionName = stateMachineArn.split(':')[1];
const accountId = stateMachineArn.split(':')[4];
const statemachineName = stateMachineArn.split(':')[6];

const stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'});
const appsyncClient = new AWSAppSyncClient({
  url: gqlEndpoint,
  region: region,
  auth: {
    type: 'AWS_IAM',
    credentials: AWS.config.credentials
  },
  disableOffline: true,
});

const createStatus = gql(`
  mutation CreateStatus($id: ID!, $status: String!, $owner: String!, $description: String, $src_url: String, $recordingEnabled: Boolean, $recordingFileUri: AWSURL, $transcriptionEnabled: Boolean, $transcriptionStatus: String, $transcriptionMediaFileUri: AWSURL, $broadcastEnabled: Boolean, $broadcastRtmpUri: String) {
    createStatus(input: {
      id: $id
      status: $status
      owner: $owner
      description: $description
      src_url: $src_url
      recordingEnabled: $recordingEnabled
      recordingFileUri: $recordingFileUri
      transcriptionEnabled: $transcriptionEnabled
      transcriptionStatus: $transcriptionStatus
      transcriptionMediaFileUri: $transcriptionMediaFileUri
      broadcastEnabled: $broadcastEnabled
      broadcastRtmpUri: $broadcastRtmpUri
    }) {
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
      createdAt
      updatedAt
    }
  }
`);

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


app.post('/executions/new', function(req, res) {
  const { requestId, requestTimeEpoch, identity } = req.apiGateway.event.requestContext
  const cognitoIdentityId = identity.cognitoIdentityId  // for S3 path
  const cognitoUsername = identity.cognitoAuthenticationProvider.split(':')[2]  // for AppSync Permission
  const { description, src_url, recordingEnabled, transcriptionEnabled, broadcastEnabled, broadcastRtmpUri, filePrivateAccess } = req.body
  const fileAccessLevel = (filePrivateAccess) ? 'private' : 'protected';
  const recordingFileUri = `s3://${bucketName}/${fileAccessLevel}/${cognitoIdentityId}/${requestId}/Meeting.mp4`
  const transcriptionMediaFileUri = `s3://${bucketName}/${fileAccessLevel}/${cognitoIdentityId}/${requestId}/Meeting_AudioOnly.flac`

  const stateMachineInput = {
    description: description,
    src_url: src_url,
    dst_url: [],  // only for StateMachine
    recordingEnabled: recordingEnabled,
    transcriptionEnabled: transcriptionEnabled,
    broadcastEnabled: broadcastEnabled,
  }
  if (stateMachineInput.recordingEnabled) {
    stateMachineInput.recordingFileUri = recordingFileUri  // for AppSync Status
    stateMachineInput.dst_url.push(recordingFileUri)  // for StateMachine
  }
  if (stateMachineInput.transcriptionEnabled) {
    stateMachineInput.transcriptionStatus = 'WAITING'
    stateMachineInput.transcriptionMediaFileUri = transcriptionMediaFileUri  // for AppSync Status
    stateMachineInput.dst_url.push(transcriptionMediaFileUri)  // for StateMachine
  }
  if (stateMachineInput.broadcastEnabled) {
    stateMachineInput.broadcastRtmpUri = broadcastRtmpUri.join(',')  // for AppSync Status
    stateMachineInput.dst_url.push(...broadcastRtmpUri)  // for StateMachine
  }
  // Update AppSync Status
  const gqlVariables = {
    id: requestId,
    status: 'SUBMITTED',
    owner: cognitoUsername,
    ...stateMachineInput
  }

  appsyncClient.mutate({variables: gqlVariables, mutation: createStatus})
    .then((data) => {
      console.log(JSON.stringify(data))
      // StateMachine の実行
      const params = {
        stateMachineArn: stateMachineArn,
        name: requestId,
        input: JSON.stringify(stateMachineInput),
      };
      stepfunctions.startExecution(params).promise()
        .then((data) => {
          console.log(data);
          res.json(data);
        })
        .catch((err) => {
          console.log(err, err.stack);
          res.sendStatus(err.statusCode);
          res.json(err);
        })
    })
    .catch((err) => console.log(JSON.stringify(err)))
});

app.get('/executions/:id', function(req, res) {
  if (req.query.stop) {
    const params = {
      executionArn: `arn:${awsPartitionName}:states:${region}:${accountId}:execution:${statemachineName}:${req.params.id}`,
      cause: 'Stopped by user via Broadcast Console API',
      error: 'stop'
    };
    stepfunctions.stopExecution(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        res.sendStatus(err.statusCode)
        res.json(err);
      } else {
        console.log(data);
        res.json(data);
      }
    });
  } else {
    res.sendStatus(400);
    res.json({message: 'Invalid parameters'});
  };
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
