export interface GroupDetailsData {
  groupDetails: GroupDetailsData
  members: Member[];
}

export interface GroupDetails {
  createdTs: string;
  defaultCurrency: string;
  expiryTs: string;
  id: string;
  lastActivityTs: string;
  linkToken: string;
  name: string;
}

export interface Member {
  createdTs: string | undefined;
  groupId: string | undefined;
  name: string | undefined;
  removedTs: string | null | undefined;
  status: string | undefined;
}
