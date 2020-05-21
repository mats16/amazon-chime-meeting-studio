/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStatus = /* GraphQL */ `
  query GetStatus($id: ID!) {
    getStatus(id: $id) {
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
        browser_url
        rtmp_url
        startDate
        stopDate
        _version
        _deleted
        _lastChangedAt
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
        browser_url
        rtmp_url
        startDate
        stopDate
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
