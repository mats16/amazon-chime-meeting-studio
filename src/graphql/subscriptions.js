/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateExecution = /* GraphQL */ `
  subscription OnCreateExecution {
    onCreateExecution {
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
export const onUpdateExecution = /* GraphQL */ `
  subscription OnUpdateExecution {
    onUpdateExecution {
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
export const onDeleteExecution = /* GraphQL */ `
  subscription OnDeleteExecution {
    onDeleteExecution {
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
export const onCreateTranscriptSpeakerLabel = /* GraphQL */ `
  subscription OnCreateTranscriptSpeakerLabel {
    onCreateTranscriptSpeakerLabel {
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
export const onUpdateTranscriptSpeakerLabel = /* GraphQL */ `
  subscription OnUpdateTranscriptSpeakerLabel {
    onUpdateTranscriptSpeakerLabel {
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
export const onDeleteTranscriptSpeakerLabel = /* GraphQL */ `
  subscription OnDeleteTranscriptSpeakerLabel {
    onDeleteTranscriptSpeakerLabel {
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
