export interface MetadataVariable {
  startIndex: number;
  numberOptions: number;
  options: Record<string, MetadataVariableOption>;
}

export interface MetadataVariableOption {
  name: string;
  index: number;
}
