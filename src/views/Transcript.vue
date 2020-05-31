<template>
  <div class="transcript">
    <el-form ref="form" :model="form" label-width="120px">
      <div v-for="n of transcriptResults.speaker_labels.speakers" :key="n">
        <el-form-item :label="`Speaker: spk_${n-1}`">
          <el-input v-model="form[`spk_${n-1}`]"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      :data="speakerLabeledTranscript"
      :default-sort = "{prop: 'start_time', order: 'descending'}"
      stripe
      style="width: 100%">
      <el-table-column
        prop="speaker_label"
        label="Speaker"
        width="150">
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
import { Storage } from 'aws-amplify';
import request from 'request-promise-native';

export default {
  name: 'Transcript',
  data() {
    return {
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
  beforeCreate() {
    const accessLevel = this.$route.query.level
    const file = this.$route.query.file
    Storage.get(file, { level: accessLevel, expires: 60 })
      .then(url => {
        request(url)
          .then((transcriptText) => {
            const transcriptJson = JSON.parse(transcriptText)
            this.genSpeakerLabeledTranscript(transcriptJson.results)
            this.transcriptResults = transcriptJson.results
          })
          .catch((err) => console.log(JSON.stringify(err)));
      })
      .catch(err => console.log(err));
  },
  computed: {},
  methods: {
    genSpeakerLabeledTranscript(transcriptResults) {
      const speakerLabeledTranscript = []
      const speakerLabelsSegments = transcriptResults.speaker_labels.segments
      let segmentIndex = 0
      const transcriptList = []
      const items = transcriptResults.items;
      while(items.length) {
        const item = items.shift()
        const itemEndTime = item.end_time
        const itemContent = item.alternatives[0].content
        const {speaker_label: segmentSpeakerLabel, start_time: segmentStartTime, end_time: segmentEndTime} = speakerLabelsSegments[segmentIndex]
        if (typeof itemEndTime === 'undefined') {
          transcriptList.push(itemContent)
        } else if (Number(itemEndTime) <= Number(segmentEndTime)) {
          transcriptList.push(itemContent)
        } else {
          speakerLabeledTranscript.push({
            speaker_label: segmentSpeakerLabel,
            start_time: segmentStartTime,
            end_time: segmentEndTime,
            transcript: transcriptList.join(' ')
          })
          segmentIndex += 1
          transcriptList.length = 0
          transcriptList.push(itemContent)
        }
      }
      const {speaker_label: segmentSpeakerLabel, start_time: segmentStartTime, end_time: segmentEndTime} = speakerLabelsSegments[segmentIndex]
      speakerLabeledTranscript.push({
        speaker_label: segmentSpeakerLabel,
        start_time: segmentStartTime,
        end_time: segmentEndTime,
        transcript: transcriptList.join(' ')
      })
      this.speakerLabeledTranscript = speakerLabeledTranscript
    }
  }
}
</script>
