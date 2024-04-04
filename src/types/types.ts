export type MessageType = {
  text: string;
  sender: string;
  timestamp: string;
};

export type StateType = {
  nickname?: string;
  filter?: string;
  input?: string;
  messages?: MessageType[];
};
