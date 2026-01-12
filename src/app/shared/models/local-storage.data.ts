export interface LocalStorageData {
  [groupId: string]: User;
}

export interface User {
  name: string;
  id: string;
}
