<template>
  <div class="home">
    <el-alert title="Chime に <Broadcast> ユーザーとして参加します ( Attendees に表示されます )" type="warning" show-icon v-if="(form.src_type === 'chime')"></el-alert>
    <el-alert title="現状、レコーディング機能は映像と音声に若干のズレが発生します ( 対応中 )" type="info" show-icon v-if="form.recordingEnabled"></el-alert>
    <el-alert title="現状、共有するとアカウントを持っている全ユーザーに公開されます ( グループ管理機能は準備中です )" type="info" show-icon v-if="form.shareEnabled"></el-alert>
    <el-alert title="現状、プライベートモードで保存したファイルを、後から共有することは出来ません" type="warning" show-icon v-if="!(form.shareEnabled)"></el-alert>
    <br>
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <!--<el-alert title="error alert" type="error" show-icon v-if="this.invalid.src"></el-alert>-->

      <el-form-item label="Description">
        <el-input v-model="form.description" placeholder="Note about this meeting"></el-input>
      </el-form-item>

      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="Source Type">
          <el-radio-group v-model="form.src_type">
            <el-radio label="chime">Amazon Chime</el-radio>
            <el-radio label="zoom" disabled>Zoom</el-radio>
            <el-radio label="custom">Custom URL</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Meeting PIN" prop="meeting_pin" v-if="form.src_type === 'chime'">
          <el-input v-model="form.meeting_pin" minlength=10 maxlength=10 placeholder="1234567890"></el-input>
        </el-form-item>

        <el-form-item label="Custome URL" prop="src_url" v-if="form.src_type === 'custom'">
          <el-input v-model="form.src_url" placeholder="www.example.com">
            <template slot="prepend">https://</template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="Broadcast">
          <el-switch
            v-model="form.broadcastEnabled"
            active-text="Enabled"
            inactive-text="Disabled">
          </el-switch>
        </el-form-item>

        <el-form-item label="Broadcast Type" prop="broadcastType">
          <el-checkbox-group v-model="form.broadcastType" :disabled="!(form.broadcastEnabled)">
            <el-checkbox label="twitch">Twitch</el-checkbox>
            <el-checkbox label="youtube">YouTube</el-checkbox>
            <el-checkbox label="custom">Custome RTMP</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <el-form-item label="Twitch Stream Key" prop="twitch_stream_key" v-if="form.broadcastEnabled && form.broadcastType.includes('twitch')">
        <el-input v-model="form.twitch_stream_key" placeholder="live_123456789_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></el-input>
      </el-form-item>

      <el-form-item label="YouTube Stream Key" prop="youtube_stream_key" v-if="form.broadcastEnabled && form.broadcastType.includes('youtube')">
        <el-input v-model="form.youtube_stream_key" placeholder="1a1a-2b2b-3c3c-4d4d"></el-input>
      </el-form-item>

      <el-form-item label="Custome URL" prop="broadcast_url" v-if="form.broadcastEnabled && form.broadcastType.includes('custom')">
        <el-input v-model="form.broadcast_url" placeholder="rtmp://a.rtmp.youtube.com/live2/stream-key">
        </el-input>
      </el-form-item>

      <el-form-item label="Recording">
        <el-switch
          v-model="form.recordingEnabled"
          active-text="Enabled"
          inactive-text="Disabled">
        </el-switch>
      </el-form-item>

      <el-form ref="form" :inline="true" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="Transcription">
          <el-switch
            v-model="form.transcriptionEnabled"
            active-text="Enabled"
            inactive-text="Disabled">
          </el-switch>
        </el-form-item>

        <el-form-item label="Language Code" prop="transcriptionLanguageCode">
          <el-select v-model="form.transcriptionLanguageCode" placeholder="Select" :disabled="!(form.transcriptionEnabled)">
            <el-option
              v-for="item of languageCodeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Max Speaker Labels">
          <el-input-number v-model="form.transcriptionMaxSpeakerLabels" :min="2" :max="10" :disabled="!(form.transcriptionEnabled)"></el-input-number>
        </el-form-item>
      </el-form>

      <el-form-item label="Sharing">
        <el-switch
          v-model="form.shareEnabled"
          active-text="Enabled"
          inactive-text="Disabled">
        </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">Submit</el-button>
        <el-button @click="onClear">Clear</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :default-sort = "{prop: 'updatedAt', order: 'descending'}"
      stripe
      style="width: 100%">

      <el-table-column
        prop="id"
        label="ID"
        width="85">
        <template slot-scope="scope">
          {{ scope.row.id.split('-')[0] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="owner"
        label="Owner"
        width="85">
        <template slot-scope="scope">
          {{ scope.row.owner.split('@')[0] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="src_url"
        label="Source"
        width="100">
        <template slot-scope="scope" v-if="(scope.row.src_url)">
          {{ scope.row.src_url.replace('https://app.chime.aws/portal/', '') }}
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="Description">
        <template slot-scope="scope">
          {{ (scope.row.description === null) ? convertToDate(scope.row.createdAt) : scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="Settiongs">
        <el-table-column
          prop="broadcastEnabled"
          label="Broadcast"
          width="106">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.broadcastEnabled === true ? 'primary' : 'info'"
              disable-transitions>
              {{ scope.row.broadcastEnabled ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="recordingEnabled"
          label="Recording"
          width="106">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.recordingEnabled === true ? 'primary' : 'info'"
              disable-transitions>
              {{ scope.row.recordingEnabled ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="transcriptionEnabled"
          label="Transcription"
          width="106">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.transcriptionEnabled === true ? 'primary' : 'info'"
              disable-transitions>
              {{ scope.row.transcriptionEnabled ? 'Enabled' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="Status">
        <el-table-column
          prop="status"
          label="Broadcast/Recording"
          sortable
          width="185">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 'RUNNING' ? 'primary' : scope.row.status === 'SUCCEEDED' ? 'success' : scope.row.status === 'FAILED' ? 'danger' : scope.row.status === 'ABORTED' ? 'warning' : 'info'"
              disable-transitions>
              {{ scope.row.status }}
            </el-tag>
            &nbsp;
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
          prop="transcriptionStatus"
          label="Transcription"
          sortable
          width="130">
          <template slot-scope="scope">
            <el-tag
              v-if="(scope.row.transcriptionEnabled)"
              :type="scope.row.transcriptionStatus === 'IN_PROGRESS' ? 'primary' : scope.row.transcriptionStatus === 'COMPLETED' ? 'success' : scope.row.transcriptionStatus === 'FAILED' ? 'danger' : scope.row.transcriptionStatus === 'ABORTED' ? 'warning' : 'info'"
              disable-transitions>
              {{ scope.row.transcriptionStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="Output">
        <el-table-column
          prop="recordingEnabled"
          label="Video"
          width="104">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Open recording file" placement="top">
              <el-button
                v-if="(scope.row.recordingEnabled)"
                type="info"
                :disabled="(scope.row.status === 'FAILED')"
                :loading="(scope.row.status === 'RUNNING')"
                size="small" plain
                @click="onOpenStorageFile(`${scope.row.recordingFileUri}`)">
                Open
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="transcriptionEnabled"
          label="Audio"
          width="104">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.transcriptionEnabled"
              type="info"
              :disabled="(scope.row.status === 'FAILED')"
              :loading="(scope.row.status === 'RUNNING')"
              size="small" plain
              @click="onOpenStorageFile(`${scope.row.transcriptionMediaFileUri}`)">
              Open
            </el-button>
          </template>
        </el-table-column>

        <el-table-column
          prop="transcriptionEnabled"
          label="Transcript"
          width="104">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.transcriptionEnabled"
              type="info"
              :disabled="(scope.row.transcriptionStatus === 'FAILED')"
              :loading="(scope.row.transcriptionStatus === 'WAITING') || (scope.row.transcriptionStatus === 'IN_PROGRESS')"
              size="small" plain
              @click="onOpenTranscript(`${scope.row.id}`)">
              Open
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        prop="updatedAt"
        label="Last Update"
        sortable
        width="145">
        <template slot-scope="scope">
          {{ convertToDate(scope.row.updatedAt) }}
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
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import AmazonS3URI from 'amazon-s3-uri';
import * as queries from '../graphql/queries';
//import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';
import transcribe from '../assets/transcribe';

export default {
  name: 'Home',
  data() {
    return {
      user: {},
      subscription: {},
      currentSettings: undefined,
      languageCodeList: transcribe.languageCodeList,
      form: {
        description: '',
        src_type: 'chime',
        src_url: '',
        meeting_pin: '',
        broadcastEnabled: false,
        broadcastType: [],
        twitch_stream_key: '',
        youtube_stream_key: '',
        broadcast_url: '',
        recordingEnabled: true,
        transcriptionEnabled: true,
        transcriptionLanguageCode: 'ja-JP',
        transcriptionMaxSpeakerLabels: 4,
        shareEnabled: true
      },
      rules: {
        meeting_pin: [
          { required: true, message: 'Please input meeting pin', trigger: 'blur' },
          { min: 10, max: 10, message: 'Length should be 10', trigger: 'blur' }
        ],
        src_url: [
          { required: true, message: 'Please input source url', trigger: 'blur' },
        ],
        broadcastType: [
          { type: 'array', required: true, message: 'Please select at least one broadcast type', trigger: 'change' }
        ],
        twitch_stream_key: [
          { required: true, message: 'Please input stream key', trigger: 'blur' },
        ],
        youtube_stream_key: [
          { required: true, message: 'Please input stream key', trigger: 'blur' },
        ],
        broadcast_url: [
          { required: true, message: 'Please input rtmp url', trigger: 'blur' },
        ],
        transcriptionLanguageCode: [
          { required: true, message: 'Please select language code', trigger: 'blur' },
        ],
      },
      tableData: []
    }
  },
  async created () {
    //await Auth.currentAuthenticatedUser()
    //  .then((cognitoUser) => {
    //    this.user = cognitoUser.attributes;
    //  });
    await Auth.currentSession()
      .then((session) => {
        const payload = session.idToken.payload;
        this.user = {
          sub: payload.sub,
          email: payload.email,
          groups: payload['cognito:groups']
        }
      });
    await API.graphql(graphqlOperation(queries.getAccountSettings, {id: this.user.sub}))
      .then((data) => {
        this.currentSettings = data.data.getAccountSettings;
        this.form.transcriptionLanguageCode = this.currentSettings.defaultTranscriptionLanguageCode
        this.form.twitch_stream_key = this.currentSettings.twitch_stream_key;
        this.form.youtube_stream_key = this.currentSettings.youtube_stream_key;
      })
      .catch((err) => console.log(JSON.stringify(err)));
    await API.graphql(graphqlOperation(queries.listExecutions))
      .then((data) => {
        this.tableData = data.data.listExecutions.items
      })
      .catch((err) => console.log(JSON.stringify(err)));
    this.subscription.onCreateExecution = API.graphql(graphqlOperation(subscriptions.onCreateExecution)).subscribe({
      next: (eventData) => {
        //console.log(eventData)
        const data = eventData.value.data.onCreateExecution;
        const isPermitted = this.verifyPermission(data)
        if (isPermitted) {
          this.tableData.push(data);
        }
      }
    });
    this.subscription.onUpdateExecution = API.graphql(graphqlOperation(subscriptions.onUpdateExecution)).subscribe({
      next: (eventData) => {
        //console.log(eventData)
        const data = eventData.value.data.onUpdateExecution;
        const isPermitted = this.verifyPermission(data)
        if (isPermitted) {
          const index = this.tableData.findIndex(x => x.id === data.id);
          if (index == -1) {
            this.tableData.push(data);
          } else {
            this.$set(this.tableData, index, data);  // 上書き出来るように、全フィールド飛ばしている
          }
        }
      }
    });
  },
  beforeDestroy() {
    for (let item in this.subscription) {
      this.subscription[item].unsubscribe();
    }
  },
  computed: {
    input: function () {
      const input = {
        owner: this.user.email,
        broadcastEnabled: this.form.broadcastEnabled,
        recordingEnabled: this.form.recordingEnabled,
        transcriptionEnabled: this.form.transcriptionEnabled,
        transcriptionLanguageCode: this.form.transcriptionLanguageCode,
        transcriptionMaxSpeakerLabels: this.form.transcriptionMaxSpeakerLabels,
        shareEnabled: this.form.shareEnabled,
      }
      if (this.form.description !== '') {
        input.description = this.form.description
      }
      if (this.form.src_type === 'chime') {
        const meeting_pin = this.form.meeting_pin.replace(/\s+/g, "")
        input.src_url = `https://app.chime.aws/portal/${meeting_pin}`;
      } else if (this.form.src_type === 'custom') {
        input.src_url = `https://${this.form.src_url}`;
      }
      if (this.form.broadcastType.length > 0) {
        input.broadcastRtmpUri = []
      }
      if (this.form.broadcastType.includes('twitch')) {
        input.broadcastRtmpUri.push(`rtmp://live.twitch.tv/app/${this.form.twitch_stream_key}`);
      }
      if (this.form.broadcastType.includes('youtube')) {
        input.broadcastRtmpUri.push(`rtmp://a.rtmp.youtube.com/live2/${this.form.youtube_stream_key}`);
        input.broadcastRtmpUri.push(`rtmp://b.rtmp.youtube.com/live2/${this.form.youtube_stream_key}?backup=1`);
      }
      if (this.form.broadcastType.includes('custom')) {
        input.broadcastRtmpUri.push(this.form.broadcast_url);
      }
      return input
    }
  },
  methods: {
    verifyPermission(data) {
      let permitted = false;
      if (data.owner === this.user.email) {
        permitted = true;
      } else if ((data.collaborators !== null) && data.collaborators.includes(this.user.email)) {
        permitted = true;
      } else {
        for (let group of this.user.groups) {
          if (data.groups.includes(group)) {
            permitted = true;
          }
        }
      }
      return permitted;
    },
    convertToDate(unixtime) {
      const dateTime = new Date(unixtime);
      return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
    },
    onOpenStorageFile(s3uri) {
      const { key } = AmazonS3URI(s3uri);
      const accessLevel = key.split('/')[0];
      const identityId = key.split('/')[1];
      const file = key.split('/').slice(2).join('/');
      const params = {
        level: accessLevel,
        expires: 60 * 5 
      };
      if (accessLevel === 'protected') { params.identityId = identityId }
      Storage.get(file, params)
        .then(result => {
          const link = document.createElement('a')
          link.href = result
          link.target = '_blank'
          link.click()
        })
        .catch(err => console.log(err));
    },
    onOpenTranscript(executionId) {
      //const { key } = AmazonS3URI(s3uri)
      const link = document.createElement('a')
      link.href = `/transcript?id=${executionId}`
      link.target = '_blank'
      link.click()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const myInit = {
            headers: {'Content-Type': 'application/json'},
            response: true,
            body: this.input
          };
          API.post('ChimeBroadcastAPI', '/executions/new', myInit)
           .then(response => {
            console.log(response);
           })
           .catch(error => {
             console.log(error.response);
          });
          alert('Submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });


    },
    onClear() {
      this.form = {
        description: '',
        src_type: 'chime',
        src_url: '',
        meeting_pin: '',
        broadcastEnabled: false,
        broadcastType: [],
        twitch_stream_key: '',
        youtube_stream_key: '',
        broadcast_url: '',
        recordingEnabled: true,
        transcriptionEnabled: true,
        transcriptionLanguageCode: '',
        transcriptionMaxSpeakerLabels: 4,
        shareEnabled: true
      }
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
