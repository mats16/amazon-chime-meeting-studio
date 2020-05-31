<template>
  <div class="home">
    <el-form ref="form" :model="form" label-width="180px">
      <!--<el-alert title="error alert" type="error" show-icon v-if="this.invalid.src"></el-alert>-->

      <el-form-item label="Source Type">
        <el-radio-group v-model="form.src.type">
          <el-radio label="chime">Amazon Chime</el-radio>
          <el-radio label="custom">Custom URL</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Meeting PIN" v-if="form.src.type === 'chime'">
        <el-input v-model="form.src.meeting_pin" minlength=10 maxlength=10 placeholder="1234567890"></el-input>
      </el-form-item>

      <el-form-item label="Custome URL" v-if="form.src.type === 'custom'">
        <el-input v-model="form.src.url" placeholder="www.example.com">
          <template slot="prepend">https://</template>
        </el-input>
      </el-form-item>

      <el-form-item label="Recording">
      <el-switch
        v-model="form.recordingEnabled"
        active-text="Enabled"
        inactive-text="Disabled">
      </el-switch>
      </el-form-item>

      <el-form-item label="Transcription">
      <el-switch
        v-model="form.transcriptionEnabled"
        :disabled="!(form.recordingEnabled)"
        active-text="Enabled"
        inactive-text="Disabled">
      </el-switch>
      </el-form-item>

      <el-form-item label="Broadcast">
      <el-switch
        v-model="form.broadcastEnabled"
        active-text="Enabled"
        inactive-text="Disabled">
      </el-switch>
      </el-form-item>

      <el-form-item label="Destination Type" v-if="form.broadcastEnabled">
        <el-checkbox-group v-model="form.dst.type">
          <el-checkbox label="twitch">Twitch</el-checkbox>
          <el-checkbox label="youtube">YouTube</el-checkbox>
          <el-checkbox label="custom">Custome RTMP</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="Twitch Stream Key" v-if="form.broadcastEnabled && form.dst.type.includes('twitch')">
        <el-input v-model="form.dst.twitch_stream_key" placeholder="live_123456789_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></el-input>
      </el-form-item>

      <el-form-item label="YouTube Stream Key" v-if="form.broadcastEnabled && form.dst.type.includes('youtube')">
        <el-input v-model="form.dst.youtube_stream_key" placeholder="1a1a-2b2b-3c3c-4d4d"></el-input>
      </el-form-item>

      <el-form-item label="Custome URL" v-if="form.broadcastEnabled && form.dst.type.includes('custom')">
        <el-input v-model="form.dst.url1" placeholder="rtmp://a.rtmp.youtube.com/live2/stream-key">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="onClear">Clear</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :default-sort = "{prop: '_lastChangedAt', order: 'descending'}"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="300">
      </el-table-column>

      <el-table-column
        prop="src_url"
        label="Source"
        sortable>
        <template slot-scope="scope">
          {{ scope.row.src_url.replace('https://app.chime.aws/portal/', 'Chime: ') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="_lastChangedAt"
        label="lastChangedAt"
        sortable>
      </el-table-column>

      <el-table-column
        prop="status"
        label="Status"
        sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'RUNNING' ? 'primary' : scope.row.status === 'SUCCEEDED' ? 'success' : scope.row.status === 'FAILED' ? 'danger' : scope.row.status === 'ABORTED' ? 'warning' : 'info'"
            disable-transitions>
            {{ scope.row.status }}
          </el-tag>
          <el-tooltip class="item" effect="dark" content="Stop execution" placement="top" v-if="scope.row.status === 'RUNNING'">
            <el-button
              :disabled="!(scope.row.status === 'RUNNING')"
              type="danger" size="small" plain
              @click="stopExecution(scope.row)">
              Stop
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        prop="recordingEnabled"
        label="Recording"
        sortable>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="Open recording file" placement="top">
            <el-button
              v-if="(scope.row.recordingEnabled)"
              :type="!(scope.row.recordingEnabled) ? 'info' :  scope.row.status === 'RUNNING' ? 'primary' : scope.row.status === 'SUCCEEDED' ? 'success' : scope.row.status === 'FAILED' ? 'danger' : scope.row.status === 'ABORTED' ? 'warning' : 'info'"
              :disabled="(scope.row.status === 'FAILED')"
              :loading="(scope.row.status === 'RUNNING')"
              size="small" plain
              @click="onOpenStorageFile(`${scope.row.recordingFileUri}`)">
              {{ scope.row.status }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        prop="transcriptionStatus"
        label="Transcription"
        sortable
        width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.transcriptionEnabled && (scope.row.status !== 'FAILED')"
            :type="!(scope.row.transcriptionEnabled) ? 'info' : scope.row.transcriptionStatus === 'IN_PROGRESS' ? 'primary' : scope.row.transcriptionStatus === 'COMPLETED' ? 'success' : scope.row.transcriptionStatus === 'FAILED' ? 'danger' : 'info'"
            :disabled="!(scope.row.transcriptionEnabled) || (scope.row.transcriptionStatus === 'FAILED')"
            :loading="(scope.row.transcriptionStatus === 'IN_PROGRESS') || (scope.row.transcriptionStatus === null)"
            size="small" plain
            @click="onOpenTranscript(`${scope.row.transcriptFileUri}`)">
            {{ (scope.row.transcriptionStatus === 'COMPLETED') ? 'Open File' : (scope.row.transcriptionStatus === null) ? 'WAITING' : scope.row.transcriptionStatus }}
          </el-button>
        </template>
      </el-table-column>
      <!--
      <el-table-column
        fixed="right"
        label="Operations"
        width="120">
        <template slot-scope="scope">
          <el-button @click="stopExecution(scope.row)" type="danger" plain :disabled="scope.row.status === 'RUNNING' ? false : true">Stop</el-button>
        </template>
      </el-table-column>
      -->
    </el-table>
  </div>
</template>

<script>
import { Auth, API, DataStore, Storage } from 'aws-amplify';
import { Predicates } from 'aws-amplify'; // test
import AmazonS3URI from 'amazon-s3-uri'
import { Status, AccountSettings } from "../models";

export default {
  name: 'Home',
  data() {
    return {
      signedIn: false,
      username: '',
      currentSettings: undefined,
      form: {
        src: {
          type: 'chime',
          meeting_pin: '',
          url: ''
        },
        dst: {
          type: [],
          twitch_stream_key: '',
          youtube_stream_key: '',
          url1: '',
          url2: ''
        },
        recordingEnabled: true,
        transcriptionEnabled: true,
        broadcastEnabled: false
      },
      tableData: []
    }
  },
  async beforeCreate() {
    // Auth.currentAuthenticatedUser()でユーザ情報を取得する。
    // 取得できなければ認証ステータスをfalseに設定する
    try {
      let cognitoUser = await Auth.currentAuthenticatedUser()
      this.signedIn = true
      this.username = cognitoUser.username
    } catch (err) {
      this.signedIn = false
    }
  },
  created: async function () {
    this.currentSettings = (await DataStore.query(AccountSettings))[0]
    if (this.currentSettings) {
     this.form.dst.twitch_stream_key = this.currentSettings.twitch_stream_key
     this.form.dst.youtube_stream_key = this.currentSettings.youtube_stream_key
    }
    this.updateTableData();
    this.subscription = DataStore.observe(Status).subscribe(msg => {
      console.log(msg.model, msg.opType, msg.element);
      this.updateTableData();
    });
  },
  computed: {
    input: function () {
      const input = {
        recordingEnabled: this.form.recordingEnabled,
        transcriptionEnabled: this.form.transcriptionEnabled,
        broadcastEnabled: this.form.broadcastEnabled
      }
      if (!input.recordingEnabled) {
        input.transcriptionEnabled = false
      }
      if (this.form.src.type === 'chime') {
        const meeting_pin = this.form.src.meeting_pin.replace(/\s+/g, "")
        input.src_url = `https://app.chime.aws/portal/${meeting_pin}`;
      } else if (this.form.src.type === 'custom') {
        input.src_url = `https://${this.form.src.url}`;
      }
      if (this.form.dst.type.length > 0) {
        input.dst_url = []
      }
      if (this.form.dst.type.includes('twitch')) {
        input.dst_url.push(`rtmp://live.twitch.tv/app/${this.form.dst.twitch_stream_key}`);
      }
      if (this.form.dst.type.includes('youtube')) {
        input.dst_url.push(`rtmp://a.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}`);
        input.dst_url.push(`rtmp://b.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}?backup=1`);
      }
      if (this.form.dst.type.includes('custom')) {
        input.dst_url.push(this.form.dst.url1);
      }
      return input
    }
  },
  methods: {
    onOpenStorageFile(s3uri) {
      const file = s3uri.split('/').slice(5).join('/')
      Storage.get(file, { level: 'private', expires: 60 * 5 })
        .then(result => {
          console.log(result)
          const link = document.createElement('a')
          link.href = result
          link.target = '_blank'
          link.click()
        })
        .catch(err => console.log(err));
    },
    onOpenTranscript(s3uri) {
      const {key}= AmazonS3URI(s3uri)
      const accessLevel = key.split('/')[0]
      const file = key.split('/').slice(2).join('/')
      const link = document.createElement('a')
      link.href = `/transcript?level=${accessLevel}&file=${file}`
      link.target = '_blank'
      link.click()
    },
    onSubmit() {
      const myInit = {
        headers: {'Content-Type': 'application/json'},
        response: true,
        body: this.input
      }
      API.post('ChimeBroadcastAPI', '/executions/new', myInit)
       .then(response => {
        console.log(response);
       })
       .catch(error => {
         console.log(error.response);
      });
    },
    onClear() {
      DataStore.delete(Status, Predicates.ALL); // test
      this.form = {
        src: {
          type: 'chime',
          meeting_pin: '',
          url: ''
        },
        dst: {
          type: [],
          twitch_stream_key: '',
          youtube_stream_key: '',
          url1: '',
          url2: ''
        }
      }
    },
    async updateTableData() {
      this.tableData = await DataStore.query(Status)
    },
    stopExecution(row) {
      API.get('ChimeBroadcastAPI', `/executions/${row.id}?stop=1`)
       .then(response => {
        console.log(response);
       })
       .catch(error => {
         console.log(error.response);
      });
    }
  }
}
</script>

<style>
</style>
