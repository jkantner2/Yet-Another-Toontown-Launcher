export interface LoginProps {
  handlePlay: (username: string) => Promise<void>;
  processIDs: Record<string, number>;
  accounts: Array<string>;
}
