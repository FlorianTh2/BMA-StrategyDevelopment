export interface MetadataBundleUsageVariable {
  // id==name
  id: string;
  startIndex: number;
  numberOptions: number;
  options: MetadataBundleUsageVariableOption[];
}

export interface MetadataBundleUsageVariableOption {
  // id==optionskennung (and not the long name)
  id: string;
  index: number;
}
