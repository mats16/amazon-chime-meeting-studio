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
export const getVocabulary = /* GraphQL */ `
  query GetVocabulary($tableId: ID!, $row: Int!) {
    getVocabulary(tableId: $tableId, row: $row) {
      tableId
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
export const listVocabularys = /* GraphQL */ `
  query ListVocabularys(
    $tableId: ID
    $row: ModelIntKeyConditionInput
    $filter: ModelVocabularyFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listVocabularys(
      tableId: $tableId
      row: $row
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        tableId
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
export const getVocabularyTable = /* GraphQL */ `
  query GetVocabularyTable($id: ID!) {
    getVocabularyTable(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const listVocabularyTables = /* GraphQL */ `
  query ListVocabularyTables(
    $filter: ModelVocabularyTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVocabularyTables(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
