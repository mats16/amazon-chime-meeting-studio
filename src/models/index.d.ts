import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Status {
  readonly id: string;
  readonly status?: string;
  readonly owner: string;
  readonly description?: string;
  readonly src_url?: string;
  readonly recordingEnabled?: boolean;
  readonly recordingFileUri?: string;
  readonly transcriptionEnabled?: boolean;
  readonly transcriptionStatus?: string;
  readonly transcriptionMediaFileUri?: string;
  readonly transcriptFileUri?: string;
  readonly broadcastEnabled?: boolean;
  readonly broadcastRtmpUri?: string;
  readonly startDate?: number;
  readonly stopDate?: number;
  constructor(init: ModelInit<Status>);
  static copyOf(source: Status, mutator: (draft: MutableModel<Status>) => MutableModel<Status> | void): Status;
}

export declare class AccountSettings {
  readonly id: string;
  readonly owner?: string;
  readonly twitch_stream_key?: string;
  readonly youtube_stream_key?: string;
  constructor(init: ModelInit<AccountSettings>);
  static copyOf(source: AccountSettings, mutator: (draft: MutableModel<AccountSettings>) => MutableModel<AccountSettings> | void): AccountSettings;
}