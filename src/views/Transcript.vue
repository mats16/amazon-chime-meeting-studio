<template>
  <div class="transcript">
    <el-table
      :data="speakerLabeledTranscript"
      :default-sort = "{prop: 'start_time', order: 'descending'}"
      stripe
      style="width: 100%">
      <el-table-column
        prop="speaker_label"
        label="Speaker"
        width="150">
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
  created: async function () {
    console.log('created')
  },
  computed: {},
  methods: {
    genSpeakerLabeledTranscript(transcriptResults) {
      const speakerLabeledTranscript = []
      const speakerLabelsSegments = transcriptResults.speaker_labels.segments
      let speakerLabelsIndex = 0
      const transcriptList = []
      const items = transcriptResults.items;
      while(items.length) {
        const item = items.shift()
        const end_time = item.end_time
        const content = item.alternatives[0].content
        if (typeof end_time === 'undefined') {
          transcriptList.push(content)
        } else if (Number(end_time) <= Number(speakerLabelsSegments[speakerLabelsIndex].end_time)) {
          transcriptList.push(content)
        } else {
          const speaker_label = speakerLabelsSegments[speakerLabelsIndex].speaker_label
          speakerLabeledTranscript.push({
            speaker_label: speaker_label,
            transcript: transcriptList.join(' ')
          })
          speakerLabelsIndex += 1
          transcriptList.length = 0
          transcriptList.push(content)
        }
      }
      const speaker_label = transcriptResults.speaker_labels.segments[speakerLabelsIndex].speaker_label
      speakerLabeledTranscript.push({
        speaker_label: speaker_label,
        transcript: transcriptList.join(' ')
      })
      this.speakerLabeledTranscript = speakerLabeledTranscript
    }
  }
}
// s3://broadcastconsole-recordingstore220316-dev/private/ap-northeast-1:673eca4e-6ba3-49f7-ae07-5871c4027f18/2a99f774-ba73-49bf-9201-3d73c7074dcc/asrOutput.json
</script>
