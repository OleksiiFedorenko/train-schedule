export type TrainRow = {
  id: string;
  number: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
};

export type Filters = { city?: string; number?: string };