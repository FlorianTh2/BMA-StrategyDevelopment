export interface MetadataVariable {
  // id==name
  // matches the key this metadata is stored under
  id: string;
  startIndex: number;
  numberOptions: number;
  options: Record<string, MetadataVariableOption>;
}

export interface MetadataVariableOption {
  // id==optionskennung
  // matches the key this metadata is stored under
  id: string;
  name: string;
  index: number;
}
