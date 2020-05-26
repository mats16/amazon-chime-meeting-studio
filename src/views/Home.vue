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

      <el-form-item label="Meeting PIN" v-if="srcChime">
        <el-input v-model="form.src.meeting_pin" minlength=10 maxlength=10 placeholder="1234567890"></el-input>
      </el-form-item>

      <el-form-item label="Custome URL" v-if="srcCustom">
        <el-input v-model="form.src.url" placeholder="www.example.com">
          <template slot="prepend">https://</template>
        </el-input>
      </el-form-item>

      <el-form-item label="Destination Type">
        <el-checkbox-group v-model="form.dst.type">
          <el-checkbox label="twitch">Twitch</el-checkbox>
          <el-checkbox label="youtube">YouTube</el-checkbox>
          <el-checkbox label="custom">Custome RTMP</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="Twitch Stream Key" v-if="dstTwitch">
        <el-input v-model="form.dst.twitch_stream_key" placeholder="live_123456789_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></el-input>
      </el-form-item>

      <el-form-item label="YouTube Stream Key" v-if="dstYoutube">
        <el-input v-model="form.dst.youtube_stream_key" placeholder="1a1a-2b2b-3c3c-4d4d"></el-input>
      </el-form-item>

      <el-form-item label="Custome URL" v-if="dstCustom">
        <el-input v-model="form.dst.url1" placeholder="rtmp://a.rtmp.youtube.com/live2/stream-key">
        </el-input>
      </el-form-item>

      <el-form-item label="Recording with Transcribe">
      <el-switch
        v-model="form.recordingEnabled"
        active-text="Enabled"
        inactive-text="Disabled">
      </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="onClear">Clear</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :default-sort = "{prop: 'startDate', order: 'descending'}"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        sortable
        width="300">
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        sortable
        width="180">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.status === 'RUNNING' ? 'primary' : scope.row.status === 'SUCCEEDED' ? 'success' : scope.row.status === 'FAILED' ? 'danger' : scope.row.status === 'ABORTED' ? 'warning' : 'info'"
            disable-transitions>
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="src_url"
        label="Source URL"
        sortable>
      </el-table-column>
      <el-table-column
        prop="startDate"
        label="startDate"
        sortable>
      </el-table-column>
      <el-table-column
        prop="stopDate"
        label="stopDate"
        sortable>
      </el-table-column>
      <el-table-column
        prop="recordingEnabled"
        label="Recording"
        sortable>
        <template slot-scope="scope">
          <el-button v-if="scope.row.recordingEnabled" @click="onDownload(scope.row.id)">Download</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Operations"
        width="120">
        <template slot-scope="scope">
          <el-button @click="stopExecution(scope.row)" type="danger">Stop</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Auth, API, DataStore, Storage } from 'aws-amplify';
import { Predicates } from 'aws-amplify'; // test
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
        recordingEnabled: true
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
    status: function () {
      return DataStore.query(Status)
    },
    srcChime: function () {
      if (this.form.src.type === 'chime') {
        return true
      } else {
        return false
      }
    },
    srcCustom: function () {
      if (this.form.src.type === 'custom') {
        return true
      } else {
        return false
      }
    },
    dstTwitch: function () {
      if (this.form.dst.type.includes('twitch')) {
        return true
      } else {
        return false
      }
    },
    dstYoutube: function () {
      if (this.form.dst.type.includes('youtube')) {
        return true
      } else {
        return false
      }
    },
    dstCustom: function () {
      if (this.form.dst.type.includes('custom')) {
        return true
      } else {
        return false
      }
    },
    dstRecording: function () {
      if (this.form.dst.type.includes('recording')) {
        return true
      } else {
        return false
      }
    },
    input: function () {
      const input = {recordingEnabled: this.form.recordingEnabled}
      if (this.srcChime) {
        const meeting_pin = this.form.src.meeting_pin.replace(/\s+/g, "")
        input.src_url = `https://app.chime.aws/portal/${meeting_pin}`;
      } else if (this.srcCustom) {
        input.src_url = `https://${this.form.src.url}`;
      }
      input.dst_url = []
      if (this.dstTwitch) {
        input.dst_url.push('rtmp://live.twitch.tv/app/' + this.form.dst.twitch_stream_key);
      }
      if (this.dstYoutube) {
        input.dst_url.push(`rtmp://a.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}`);
        input.dst_url.push(`rtmp://b.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}?backup=1`);
      }
      if (this.dstCustom) {
        input.dst_url.push(this.form.dst.url1);
      }
      return input
    }
  },
  methods: {
    onDownload(id) {
      Storage.get(`${id}/${id}.mp4`, { level: 'private', expires: 10 })
        .then(result => {
          //const url = URL.createObjectURL(new Blob([result]));
          const link = document.createElement('a')
          link.href = result
          link.download = `${id}.mp4`
          link.click()
        })
        .catch(err => console.log(err));
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
