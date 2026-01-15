export interface IAuditLogData {
  actorId: string;
  actorName: string;
  eventType: EventType;
  logId: string;
  logMessage: string;
  logTs: string;
}

export enum EventType {
  EXPENSE_CREATED,
  EXPENSE_EDITED,
  EXPENSE_DELETED,
  GROUP_CREATED,
  GROUP_EDITED,
  MEMBER_ADDED,
  MEMBER_REMOVED,
  MEMBER_EDITED,
  MEMBER_PAID,
}
