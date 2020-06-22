<template>
  <div class="transcript">
    <el-form ref="form" :model="form" label-width="120px">
      <div v-for="n of transcriptResults.speaker_labels.speakers" :key="n">
        <el-form-item :label="`Speaker: spk_${n-1}`">
          <el-input v-model="form[`spk_${n-1}`]"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSaveLabels()">Save</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="speakerLabeledTranscript"
      :default-sort = "{prop: 'start_time', order: 'ascending'}"
      stripe
      style="width: 100%">

      <el-table-column
        prop="start_time"
        label="Start"
        width="80">
        <template slot-scope="scope">
          {{ timeConvert(scope.row.start_time) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="end_time"
        label="End"
        width="80">
        <template slot-scope="scope">
          {{ timeConvert(scope.row.end_time) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="speaker_label"
        label="Speaker"
        width="120">
        <template slot-scope="scope">
          {{ (form[scope.row.speaker_label]) ? form[scope.row.speaker_label] : scope.row.speaker_label }}
        </template>
      </el-table-column>

      <el-table-column
        prop="transcript"
        label="Transcript">
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { Storage, API, graphqlOperation } from 'aws-amplify';
import request from 'request-promise-native';
import AmazonS3URI from 'amazon-s3-uri';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
//import * as subscriptions from '../graphql/subscriptions';

const getTranscriptSpeakerLabel = /* GraphQL */ `
  query GetTranscriptSpeakerLabel($id: ID!) {
    getTranscriptSpeakerLabel(id: $id) {
      spk_0
      spk_1
      spk_2
      spk_3
      spk_4
      spk_5
      spk_6
      spk_7
      spk_8
      spk_9
    }
  }
`;

export default {
  name: 'Transcript',
  data() {
    return {
      executionId: '',
      transcriptFileUri: '',
      form: {},
      transcriptResults: {
        items: [],
        speaker_labels: [],
        transcripts: [
          {transcript: ''}
        ]
      },
      speakerLabeledTranscript: []
    }
  },
  created() {
    this.executionId = this.$route.query.id;
    // Load transcript file
    API.graphql(graphqlOperation(queries.getStatus, {id: this.executionId}))
      .then((data) => {
        this.transcriptFileUri = data.data.getStatus.transcriptFileUri;
        const { key } = AmazonS3URI(this.transcriptFileUri);
        const accessLevel = key.split('/')[0];
        const identityId = key.split('/')[1];
        const storageFile = key.split('/').slice(2).join('/');
        const params = {
          level: accessLevel,
          expires: 60
        };
        if (accessLevel === 'protected') { params.identityId = identityId }
        Storage.get(storageFile, params)
          .then((url) => {
            request(url)
              .then((transcriptText) => {
                const transcriptJson = JSON.parse(transcriptText);
                console.log(JSON.stringify(transcriptJson));
                this.transcriptResults = transcriptJson.results;
                this.speakerLabeledTranscript = this.genSpeakerLabeledTranscript(transcriptJson.results);
              })
              .catch((err) => console.log(JSON.stringify(err)));
          })
          .catch(err => console.log(err));
      })
      .catch((err) => console.log(JSON.stringify(err)));
    // Load label
    API.graphql(graphqlOperation(getTranscriptSpeakerLabel, {id: this.executionId}))
      .then((data) => {
        const form = {};
        const speakerLabel = data.data.getTranscriptSpeakerLabel;
        for (let i in speakerLabel) {
          if (speakerLabel[i] !== null) {
            form[i] = speakerLabel[i];
          }
        }
        this.form = form;
      })
      .catch((err) => console.log(JSON.stringify(err)));
  },
  computed: {},
  methods: {
    onSaveLabels() {
      const input = {
        id: this.executionId,
        ...this.form
      }
      API.graphql(graphqlOperation(mutations.updateTranscriptSpeakerLabel, {input: input}))
        .catch(() => {
          API.graphql(graphqlOperation(mutations.createTranscriptSpeakerLabel, {input: input}))
            .catch((err) => console.log(JSON.stringify(err)));
        });
    },
    genSpeakerLabeledTranscript(transcriptResults) {
      const speakerLabeledTranscript = [];
      const speakerLabelsSegments = transcriptResults.speaker_labels.segments;
      let segmentIndex = 0;
      const transcriptList = [];
      const items = transcriptResults.items;
      while(items.length) {
        const item = items.shift();
        const itemEndTime = item.end_time;
        const itemContent = item.alternatives[0].content;
        const {speaker_label: segmentSpeakerLabel, start_time: segmentStartTime, end_time: segmentEndTime} = speakerLabelsSegments[segmentIndex];
        if (typeof itemEndTime === 'undefined') {
          transcriptList.push(itemContent);
        } else if (Number(itemEndTime) <= Number(segmentEndTime)) {
          transcriptList.push(itemContent);
        } else {
          speakerLabeledTranscript.push({
            speaker_label: segmentSpeakerLabel,
            start_time: Number(segmentStartTime),
            end_time: Number(segmentEndTime),
            transcript: transcriptList.join(' ')
          })
          segmentIndex += 1;
          transcriptList.length = 0;
          transcriptList.push(itemContent);
        }
      }
      const {speaker_label: segmentSpeakerLabel, start_time: segmentStartTime, end_time: segmentEndTime} = speakerLabelsSegments[segmentIndex];
      speakerLabeledTranscript.push({
        speaker_label: segmentSpeakerLabel,
        start_time: Number(segmentStartTime),
        end_time: Number(segmentEndTime),
        transcript: transcriptList.join(' ')
      })
      return speakerLabeledTranscript;
    },
    timeConvert(time) {
      const sec = Math.floor(time % 60) % 60;
      const minute = Math.floor(time / 60);
      //const minute = Math.floor(time / 60) % 60;
      //const hour = Math.floor(time / 3600);
      //return `${hour}:${minute}:${sec}`
      return `${minute}:${sec}`
    }
  }
}
</script>
