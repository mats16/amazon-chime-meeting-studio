/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
    }
  }
`;
