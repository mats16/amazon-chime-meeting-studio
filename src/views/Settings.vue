<template>
  <div class="settings">
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
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

export default {
  name: 'Settings',
  data() {
    return {
      user: {},
      currentSettings: null,
      form: {
        twitch_stream_key: '',
        youtube_stream_key: ''
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
