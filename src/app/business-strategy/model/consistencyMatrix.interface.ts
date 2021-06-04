export interface IConcistencyMatrix {
  name: string;
  // 1 module has X variables
  // 1 variable has X Options
  // 1 option has 1 value for each column
  // 1 column has 1 value
  modules: Record<
    string,
    Record<string, Record<string, Record<string, number>>>
  >;
}
