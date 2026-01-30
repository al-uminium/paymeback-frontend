export interface IExpenseData {
  expense: IExpense;
  participants: IParticipants[];
}

export interface IExpense {
  createdTs: string;
  date: string;
  expenseCurrency: string;
  expenseId: string;
  expenseName: string;
  ownerId: string;
  ownerName: string;
  totalCost: number;
}

export interface IParticipants {
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
  splitType: 'EVEN' | 'CUSTOM';
  currency: string;
  date: Date;
  participants: ParticipantPayload[];
}

export interface ParticipantPayload {
  participantId: string;
  amountOwed: string | null;
}
