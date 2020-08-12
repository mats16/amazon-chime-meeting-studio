/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTranscriptSpeakerLabel = /* GraphQL */ `
  mutation CreateTranscriptSpeakerLabel(
    $input: CreateTranscriptSpeakerLabelInput!
    $condition: ModelTranscriptSpeakerLabelConditionInput
  ) {
    createTranscriptSpeakerLabel(input: $input, condition: $condition) {
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
export const updateTranscriptSpeakerLabel = /* GraphQL */ `
  mutation UpdateTranscriptSpeakerLabel(
    $input: UpdateTranscriptSpeakerLabelInput!
    $condition: ModelTranscriptSpeakerLabelConditionInput
  ) {
    updateTranscriptSpeakerLabel(input: $input, condition: $condition) {
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
export const deleteTranscriptSpeakerLabel = /* GraphQL */ `
  mutation DeleteTranscriptSpeakerLabel(
    $input: DeleteTranscriptSpeakerLabelInput!
    $condition: ModelTranscriptSpeakerLabelConditionInput
  ) {
    deleteTranscriptSpeakerLabel(input: $input, condition: $condition) {
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
export const createAccountSettings = /* GraphQL */ `
  mutation CreateAccountSettings(
    $input: CreateAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    createAccountSettings(input: $input, condition: $condition) {
      id
      defaultTranscriptionLanguageCode
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const updateAccountSettings = /* GraphQL */ `
  mutation UpdateAccountSettings(
    $input: UpdateAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    updateAccountSettings(input: $input, condition: $condition) {
      id
      defaultTranscriptionLanguageCode
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const deleteAccountSettings = /* GraphQL */ `
  mutation DeleteAccountSettings(
    $input: DeleteAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    deleteAccountSettings(input: $input, condition: $condition) {
      id
      defaultTranscriptionLanguageCode
      twitch_stream_key
      youtube_stream_key
      createdAt
      updatedAt
    }
  }
`;
export const createExecution = /* GraphQL */ `
  mutation CreateExecution(
    $input: CreateExecutionInput!
    $condition: ModelExecutionConditionInput
  ) {
    createExecution(input: $input, condition: $condition) {
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
export const updateExecution = /* GraphQL */ `
  mutation UpdateExecution(
    $input: UpdateExecutionInput!
    $condition: ModelExecutionConditionInput
  ) {
    updateExecution(input: $input, condition: $condition) {
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
export const deleteExecution = /* GraphQL */ `
  mutation DeleteExecution(
    $input: DeleteExecutionInput!
    $condition: ModelExecutionConditionInput
  ) {
    deleteExecution(input: $input, condition: $condition) {
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
