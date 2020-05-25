import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Status {
  readonly id: string;
  readonly status: string;
  readonly owner?: string;
  readonly browser_url?: string;
  readonly rtmp_url?: string[];
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