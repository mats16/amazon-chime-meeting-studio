/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccountSettings = /* GraphQL */ `
  subscription OnCreateAccountSettings($id: String!) {
    onCreateAccountSettings(id: $id) {
      id
      defaultTranscriptionLanguageCode
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
      defaultTranscriptionLanguageCode
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
      defaultTranscriptionLanguageCode
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const onCreateVocabularySheet = /* GraphQL */ `
  subscription OnCreateVocabularySheet {
    onCreateVocabularySheet {
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
export const onUpdateVocabularySheet = /* GraphQL */ `
  subscription OnUpdateVocabularySheet {
    onUpdateVocabularySheet {
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
export const onDeleteVocabularySheet = /* GraphQL */ `
  subscription OnDeleteVocabularySheet {
    onDeleteVocabularySheet {
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
export const onCreateVocabulary = /* GraphQL */ `
  subscription OnCreateVocabulary {
    onCreateVocabulary {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateVocabulary = /* GraphQL */ `
  subscription OnUpdateVocabulary {
    onUpdateVocabulary {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteVocabulary = /* GraphQL */ `
  subscription OnDeleteVocabulary {
    onDeleteVocabulary {
      id
      name
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
export const onUpdateStatus = /* GraphQL */ `
  subscription OnUpdateStatus {
    onUpdateStatus {
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
export const onDeleteStatus = /* GraphQL */ `
  subscription OnDeleteStatus {
    onDeleteStatus {
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
