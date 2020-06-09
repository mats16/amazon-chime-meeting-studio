/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccountSettings = /* GraphQL */ `
  query GetAccountSettings($id: ID!) {
    getAccountSettings(id: $id) {
      id
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
export const getVocabulary = /* GraphQL */ `
  query GetVocabulary($id: ID!) {
    getVocabulary(id: $id) {
      id
      name
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
