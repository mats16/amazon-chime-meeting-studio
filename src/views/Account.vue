<template>
  <div class="account">
    <el-form ref="form" :model="form" label-width="150px">

      <el-form-item label="Twitch Stream Key">
        <el-input v-model="form.twitch_stream_key" placeholder="live_123456789_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></el-input>
      </el-form-item>

      <el-form-item label="YouTube Stream Key">
        <el-input v-model="form.youtube_stream_key" placeholder="1a1a-2b2b-3c3c-4d4d"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { DataStore } from 'aws-amplify';
import { AccountSettings } from "../models";

export default {
  name: 'Account',
  data() {
    return {
      currentSettings: undefined,
      form: {
        twitch_stream_key: '',
        youtube_stream_key: ''
      }
    }
  },
  created: async function () {
    this.currentSettings = (await DataStore.query(AccountSettings))[0]
    if (this.currentSettings) {
     this.form.twitch_stream_key = this.currentSettings.twitch_stream_key
     this.form.youtube_stream_key = this.currentSettings.youtube_stream_key
    }
  },
  methods: {
    async onSubmit() {
      let newSettings = {}
      if (typeof this.currentSettings === "undefined") {
        newSettings = new AccountSettings({
           twitch_stream_key: this.form.twitch_stream_key,
           youtube_stream_key: this.form.youtube_stream_key
        })
      } else {
        newSettings = AccountSettings.copyOf(this.currentSettings, updated => {
          updated.twitch_stream_key = this.form.twitch_stream_key,
          updated.youtube_stream_key = this.form.youtube_stream_key
        })
      }
      this.currentSettings = await DataStore.save(newSettings)
    }
  }
}
</script>
