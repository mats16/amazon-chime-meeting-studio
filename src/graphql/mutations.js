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
export const createVocabularySheet = /* GraphQL */ `
  mutation CreateVocabularySheet(
    $input: CreateVocabularySheetInput!
    $condition: ModelVocabularySheetConditionInput
  ) {
    createVocabularySheet(input: $input, condition: $condition) {
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
export const updateVocabularySheet = /* GraphQL */ `
  mutation UpdateVocabularySheet(
    $input: UpdateVocabularySheetInput!
    $condition: ModelVocabularySheetConditionInput
  ) {
    updateVocabularySheet(input: $input, condition: $condition) {
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
export const deleteVocabularySheet = /* GraphQL */ `
  mutation DeleteVocabularySheet(
    $input: DeleteVocabularySheetInput!
    $condition: ModelVocabularySheetConditionInput
  ) {
    deleteVocabularySheet(input: $input, condition: $condition) {
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
export const createStatus = /* GraphQL */ `
  mutation CreateStatus(
    $input: CreateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    createStatus(input: $input, condition: $condition) {
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
export const updateStatus = /* GraphQL */ `
  mutation UpdateStatus(
    $input: UpdateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    updateStatus(input: $input, condition: $condition) {
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
export const deleteStatus = /* GraphQL */ `
  mutation DeleteStatus(
    $input: DeleteStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    deleteStatus(input: $input, condition: $condition) {
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
export const createVocabulary = /* GraphQL */ `
  mutation CreateVocabulary(
    $input: CreateVocabularyInput!
    $condition: ModelVocabularyConditionInput
  ) {
    createVocabulary(input: $input, condition: $condition) {
      id
      name
      status
      fileUri
      createdAt
      updatedAt
    }
  }
`;
export const updateVocabulary = /* GraphQL */ `
  mutation UpdateVocabulary(
    $input: UpdateVocabularyInput!
    $condition: ModelVocabularyConditionInput
  ) {
    updateVocabulary(input: $input, condition: $condition) {
      id
      name
      status
      fileUri
      createdAt
      updatedAt
    }
  }
`;
export const deleteVocabulary = /* GraphQL */ `
  mutation DeleteVocabulary(
    $input: DeleteVocabularyInput!
    $condition: ModelVocabularyConditionInput
  ) {
    deleteVocabulary(input: $input, condition: $condition) {
      id
      name
      status
      fileUri
      createdAt
      updatedAt
    }
  }
`;
