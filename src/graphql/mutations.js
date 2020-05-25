/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccountSettings = /* GraphQL */ `
  mutation CreateAccountSettings(
    $input: CreateAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    createAccountSettings(input: $input, condition: $condition) {
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
export const updateAccountSettings = /* GraphQL */ `
  mutation UpdateAccountSettings(
    $input: UpdateAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    updateAccountSettings(input: $input, condition: $condition) {
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
export const deleteAccountSettings = /* GraphQL */ `
  mutation DeleteAccountSettings(
    $input: DeleteAccountSettingsInput!
    $condition: ModelAccountSettingsConditionInput
  ) {
    deleteAccountSettings(input: $input, condition: $condition) {
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
export const createStatus = /* GraphQL */ `
  mutation CreateStatus(
    $input: CreateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    createStatus(input: $input, condition: $condition) {
      id
      status
      owner
      browser_url
      rtmp_url
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
export const updateStatus = /* GraphQL */ `
  mutation UpdateStatus(
    $input: UpdateStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    updateStatus(input: $input, condition: $condition) {
      id
      status
      owner
      browser_url
      rtmp_url
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
export const deleteStatus = /* GraphQL */ `
  mutation DeleteStatus(
    $input: DeleteStatusInput!
    $condition: ModelStatusConditionInput
  ) {
    deleteStatus(input: $input, condition: $condition) {
      id
      status
      owner
      browser_url
      rtmp_url
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
