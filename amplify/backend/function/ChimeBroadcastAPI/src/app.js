/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
  REGION
  STORAGE_RECORDINGSTORE_BUCKETNAME
  STATEMACHINE_BROADCASTCONTAINER_ARN
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');
const uuid4 = require('uuid4');

const stepfunctions = new AWS.StepFunctions({apiVersion: '2016-11-23'});
const bucket_name = process.env['STORAGE_RECORDINGSTORE_BUCKETNAME'];
const statemachine_arn = process.env['STATEMACHINE_BROADCASTCONTAINER_ARN'];
const aws_partitionname = statemachine_arn.split(':')[1]
const region = statemachine_arn.split(':')[3]
const account_id = statemachine_arn.split(':')[4]
const statemachine_name = statemachine_arn.split(':')[6]

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


app.post('/executions/new', function(req, res) {
  const execution_name = uuid4();
  // check auth identity
  const user_identity_id = req.apiGateway.event.requestContext.identity.cognitoIdentityId
  const user_name = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider.split(':')[2]
  const input = {
    owner: user_name,
    src_url: req.body.src_url,
    dst_url: [],
    recordingEnabled: req.body.recordingEnabled,
    transcriptionEnabled: req.body.transcriptionEnabled,
    broadcastEnabled: req.body.broadcastEnabled,
  }
  if (input.recordingEnabled) {
    input.recordingFileUri = `s3://${bucket_name}/private/${user_identity_id}/${execution_name}.mp4`
    input.dst_url.push(`s3://${bucket_name}/private/${user_identity_id}/${execution_name}.mp4`)
  }
  if (input.broadcastEnabled) {
    input.dst_url.push(...req.body.dst_url)
  }
  const params = {
    input: JSON.stringify(input),
    name: execution_name,
    stateMachineArn: statemachine_arn,
  };
  stepfunctions.startExecution(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      res.sendStatus(err.statusCode)
      res.json(err);
    } else {
      console.log(data);
      res.json(data);
    };
  });
});

app.get('/executions/:id', function(req, res) {
  if (req.query.stop) {
    const params = {
      executionArn: `arn:${aws_partitionname}:states:${region}:${account_id}:execution:${statemachine_name}:${req.params.id}`,
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
