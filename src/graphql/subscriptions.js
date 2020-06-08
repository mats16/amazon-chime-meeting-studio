/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccountSettings = /* GraphQL */ `
  subscription OnCreateAccountSettings($id: String!) {
    onCreateAccountSettings(id: $id) {
      id
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAccountSettings = /* GraphQL */ `
  subscription OnUpdateAccountSettings($id: String!) {
    onUpdateAccountSettings(id: $id) {
      id
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAccountSettings = /* GraphQL */ `
  subscription OnDeleteAccountSettings($id: String!) {
    onDeleteAccountSettings(id: $id) {
      id
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVocabulary = /* GraphQL */ `
  subscription OnCreateVocabulary {
    onCreateVocabulary {
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
export const onUpdateVocabulary = /* GraphQL */ `
  subscription OnUpdateVocabulary {
    onUpdateVocabulary {
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
export const onDeleteVocabulary = /* GraphQL */ `
  subscription OnDeleteVocabulary {
    onDeleteVocabulary {
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
export const onCreateVocabularyTable = /* GraphQL */ `
  subscription OnCreateVocabularyTable {
    onCreateVocabularyTable {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateVocabularyTable = /* GraphQL */ `
  subscription OnUpdateVocabularyTable {
    onUpdateVocabularyTable {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteVocabularyTable = /* GraphQL */ `
  subscription OnDeleteVocabularyTable {
    onDeleteVocabularyTable {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStatus = /* GraphQL */ `
  subscription OnCreateStatus($owner: String!) {
    onCreateStatus(owner: $owner) {
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
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus($owner: String!) {
    onUpdateStatus(owner: $owner) {
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
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus($owner: String!) {
    onDeleteStatus(owner: $owner) {
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
