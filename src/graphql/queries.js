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
export const getVocabularySheet = /* GraphQL */ `
  query GetVocabularySheet($vocabularyId: ID!, $row: Int!) {
    getVocabularySheet(vocabularyId: $vocabularyId, row: $row) {
      vocabularyId
      row
      phrase
      ipa
      soundsLike
      displayAs
      createdAt
      updatedAt
    }
  }
`;
export const listVocabularySheets = /* GraphQL */ `
  query ListVocabularySheets(
    $vocabularyId: ID
    $row: ModelIntKeyConditionInput
    $filter: ModelVocabularySheetFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVocabularySheets(
      vocabularyId: $vocabularyId
      row: $row
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        vocabularyId
        row
        phrase
        ipa
        soundsLike
        displayAs
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getStatus = /* GraphQL */ `
  query GetStatus($id: ID!) {
    getStatus(id: $id) {
      id
      status
      owner
      description
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
export const listStatuss = /* GraphQL */ `
  query ListStatuss(
    $filter: ModelStatusFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStatuss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        status
        owner
        description
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
export const getVocabulary = /* GraphQL */ `
  query GetVocabulary($id: ID!) {
    getVocabulary(id: $id) {
      id
      name
      status
      fileUri
      createdAt
      updatedAt
    }
  }
`;
export const listVocabularys = /* GraphQL */ `
  query ListVocabularys(
    $filter: ModelVocabularyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVocabularys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        fileUri
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
