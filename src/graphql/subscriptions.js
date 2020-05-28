/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccountSettings = /* GraphQL */ `
  subscription OnCreateAccountSettings($owner: String!) {
    onCreateAccountSettings(owner: $owner) {
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
export const onUpdateAccountSettings = /* GraphQL */ `
  subscription OnUpdateAccountSettings($owner: String!) {
    onUpdateAccountSettings(owner: $owner) {
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
export const onDeleteAccountSettings = /* GraphQL */ `
  subscription OnDeleteAccountSettings($owner: String!) {
    onDeleteAccountSettings(owner: $owner) {
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
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus {
    onCreateStatus {
      id
      status
      owner
      src_url
      dst_url
      recordingEnabled
      recordingFileUri
      transcriptionEnabled
      transcriptionStatus
      transcriptFileUri
      broadcastEnabled
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
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
      id
      status
      owner
      src_url
      dst_url
      recordingEnabled
      recordingFileUri
      transcriptionEnabled
      transcriptionStatus
      transcriptFileUri
      broadcastEnabled
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
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
      id
      status
      owner
      src_url
      dst_url
      recordingEnabled
      recordingFileUri
      transcriptionEnabled
      transcriptionStatus
      transcriptFileUri
      broadcastEnabled
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
