<template>
  <div class="settings">
    <el-form ref="form" :model="form" label-width="220px">

      <el-form-item label="Default Transcription Language">
        <el-select v-model="form.defaultTranscriptionLanguageCode" placeholder="Select">
          <el-option
            v-for="item of languageCodeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Twitch Stream Key">
        <el-input v-model="form.twitch_stream_key" placeholder="live_123456789_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"></el-input>
      </el-form-item>

      <el-form-item label="YouTube Stream Key">
        <el-input v-model="form.youtube_stream_key" placeholder="1a1a-2b2b-3c3c-4d4d"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save</el-button>
      </el-form-item>

      <el-form-item>
        <amplify-sign-out/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import transcribe from '../assets/transcribe';

export default {
  name: 'Settings',
  data() {
    return {
      languageCodeList: transcribe.languageCodeList,
      user: {},
      currentSettings: null,
      form: {
        defaultTranscriptionLanguageCode: null,
        twitch_stream_key: null,
        youtube_stream_key: null
      }
    }
  },
  async created () {
    await Auth.currentAuthenticatedUser()
      .then((cognitoUser) => {
        this.user = cognitoUser.attributes;
      });
    await API.graphql(graphqlOperation(queries.getAccountSettings, {id: this.user.sub}))
      .then((data) => {
        this.currentSettings = data.data.getAccountSettings
      })
      .catch((err) => console.log(JSON.stringify(err)));
    if (this.currentSettings) {
      this.form.defaultTranscriptionLanguageCode = this.currentSettings.defaultTranscriptionLanguageCode
      this.form.twitch_stream_key = this.currentSettings.twitch_stream_key
      this.form.youtube_stream_key = this.currentSettings.youtube_stream_key
    }
  },
  methods: {
    async onSubmit() {
      const input = {
        id: this.user.sub,
        ...this.form
      }
      if (this.currentSettings === null) {
        await API.graphql(graphqlOperation(mutations.createAccountSettings, {input: input}))
          .then((data) => {
            this.currentSettings = data.data.createAccountSettings
          })
          .catch((err) => console.log(JSON.stringify(err)));
      } else {
        await API.graphql(graphqlOperation(mutations.updateAccountSettings, {input: input}))
          .then((data) => {
            this.currentSettings = data.data.updateAccountSettings
          })
          .catch((err) => console.log(JSON.stringify(err)));
      }
    }
  }
}
</script>
