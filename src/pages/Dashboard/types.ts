export type TopTen = {
  account: string;
  revenue: number;
};

export type Metrics = {
  avgOrderSize: number;
  topCustomer: string;
  newCustomers: number;
  topTen: TopTen[];
};

export type SortTypes = "bulk" | "sort";

export type RevenueByState = {
  month: number;
  revenue: number;
  sortType: SortTypes;
};

export interface RevMap {
  [month: number]: {
    r: number;
    t: SortTypes;
  };
}

export type Rev = {
  bulk: RevMap;
  sort: RevMap;
} & { [key in SortTypes]: RevMap };

export interface RevMapByState {
  [state: string]: {
    rev: Rev;
    // rev: {
    //   bulk: RevMap,
    //   sort:RevMap,
    // };
    minMonth: number;
    maxMonth: number;
  };
}

export type Revenue = {
  monthKeys: number[];
  rev: RevMapByState;
};
