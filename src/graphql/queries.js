/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTranscriptSpeakerLabel = /* GraphQL */ `
  query GetTranscriptSpeakerLabel($id: ID!) {
    getTranscriptSpeakerLabel(id: $id) {
      id
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
      createdAt
      updatedAt
    }
  }
`;
export const listTranscriptSpeakerLabels = /* GraphQL */ `
  query ListTranscriptSpeakerLabels(
    $filter: ModelTranscriptSpeakerLabelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTranscriptSpeakerLabels(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAccountSettings = /* GraphQL */ `
  query GetAccountSettings($id: ID!) {
    getAccountSettings(id: $id) {
      id
      defaultTranscriptionLanguageCode
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const listAccountSettingss = /* GraphQL */ `
  query ListAccountSettingss(
    $filter: ModelAccountSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccountSettingss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        defaultTranscriptionLanguageCode
        twitch_stream_key
        youtube_stream_key
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getExecution = /* GraphQL */ `
  query GetExecution($id: ID!) {
    getExecution(id: $id) {
      id
      owner
      collaborators
      groups
      description
      tags
      status
      src_url
      recordingEnabled
      recordingFileUri
      transcriptionEnabled
      transcriptionLanguageCode
      transcriptionMaxSpeakerLabels
      transcriptionStatus
      transcriptionMediaFileUri
      transcriptFileUri
      broadcastEnabled
      broadcastRtmpUri
      createdAt
      updatedAt
    }
  }
`;
export const listExecutions = /* GraphQL */ `
  query ListExecutions(
    $filter: ModelExecutionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExecutions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        owner
        collaborators
        groups
        description
        tags
        status
        src_url
        recordingEnabled
        recordingFileUri
        transcriptionEnabled
        transcriptionLanguageCode
        transcriptionMaxSpeakerLabels
        transcriptionStatus
        transcriptionMediaFileUri
        transcriptFileUri
        broadcastEnabled
        broadcastRtmpUri
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
