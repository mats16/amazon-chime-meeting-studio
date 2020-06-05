/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncAccountSettings = /* GraphQL */ `
  query SyncAccountSettings(
    $filter: ModelAccountSettingsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAccountSettings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        owner
        twitch_stream_key
        youtube_stream_key
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getAccountSettings = /* GraphQL */ `
  query GetAccountSettings($id: ID!) {
    getAccountSettings(id: $id) {
      id
      owner
      twitch_stream_key
      youtube_stream_key
      _version
      _deleted
      _lastChangedAt
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
        owner
        twitch_stream_key
        youtube_stream_key
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
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
      transcriptionStatus
      transcriptionMediaFileUri
      transcriptFileUri
      broadcastEnabled
      broadcastRtmpUri
      startDate
      stopDate
      _version
      _deleted
      _lastChangedAt
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
        transcriptionStatus
        transcriptionMediaFileUri
        transcriptFileUri
        broadcastEnabled
        broadcastRtmpUri
        startDate
        stopDate
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncStatuses = /* GraphQL */ `
  query SyncStatuses(
    $filter: ModelStatusFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncStatuses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        status
        owner
        description
        src_url
        recordingEnabled
        recordingFileUri
        transcriptionEnabled
        transcriptionStatus
        transcriptionMediaFileUri
        transcriptFileUri
        broadcastEnabled
        broadcastRtmpUri
        startDate
        stopDate
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
