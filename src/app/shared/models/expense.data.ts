export interface ExpenseData {
  expense: Expense;
  participants: Participants[]
}

export interface Expense {
  createdTs: string;
  date: string;
  expenseCurrency: string;
  expenseId: string;
  expenseName: string;
  ownerId: string;
  ownerName: string;
  totalCost: number;
}

export interface Participants {
  amountOwed: number;
  id: string;
  isPayer: boolean;
  name: string;
}

export interface ExpensePayload {
  expenseName: string;
  groupId: string;
  ownerId: string;
  totalCost: number;
  splitType: string;
  currency: string;
  date: Date;
  participants: ParticipantPayload[]
}

export interface ParticipantPayload {
  participantId: string;
  amountOwed: string;
}
