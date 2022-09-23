interface IWilderProps {
  id: number;
  name: string;
  description: string;
}

interface WilderFromDb {
  id: number;
  name: string;
  description: string;
}

interface Wilder {
  id: number;
  name: string;
  description: string;
}

export type { IWilderProps, WilderFromDb, Wilder };
