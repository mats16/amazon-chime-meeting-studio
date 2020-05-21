<template>
  <div class="home">
    <el-form ref="form" :model="form" label-width="150px">
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

      <el-form-item label="Custome RTMP URL" v-if="dstCustom">
        <el-input v-model="form.dst.url" placeholder="a.rtmp.youtube.com/live2/stream-key">
          <template slot="prepend">rtmp://</template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Broadcast</el-button>
        <el-button @click="onClear">Clear Form</el-button>
      </el-form-item>

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
        </el-table-column>
        <el-table-column
          prop="browser_url"
          label="Browser URL"
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
          fixed="right"
          label="Operations"
          width="120">
          <template slot-scope="scope">
            <el-button @click="stopExecution(scope.row)" type="danger" size="small">Stop</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-form>
  </div>
</template>

<script>
import { API, DataStore } from 'aws-amplify';
import { Status } from "../models";

export default {
  name: 'Home',
  data() {
    return {
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
          url: ''
        }
      },
      tableData: []
    }
  },
  created: async function () {
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
    input: function () {
      const input = {rtmp_url: []}
      if (this.srcChime) {
        const meeting_pin = this.form.src.meeting_pin.replace(/\s+/g, "")
        input.browser_url = `https://app.chime.aws/portal/${meeting_pin}`
      } else if (this.srcCustom) {
        input.browser_url = `https://${this.form.src.url}`
      }

      if (this.dstTwitch) {
        input.rtmp_url.push('rtmp://live.twitch.tv/app/' + this.form.dst.twitch_stream_key)
      }
      if (this.dstYoutube) {
        input.rtmp_url.push(`rtmp://a.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}`)
        input.rtmp_url.push(`rtmp://b.rtmp.youtube.com/live2/${this.form.dst.youtube_stream_key}?backup=1`)
      }
      if (this.dstCustom) {
        input.rtmp_url.push(`rtmp://${this.form.dst.url}`)
      }
      return input
    }
  },
  methods: {
    onSubmit() {
      this.validateInput()
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
          url: ''
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
