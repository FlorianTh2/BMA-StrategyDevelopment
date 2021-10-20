import { MetadataVariable } from "./metadataVariable";

export class ConcistencyMatrix {
  array: number[][];
  metadataByVariable: Record<string, MetadataVariable>;

  constructor(rawData: number[][], metadataByVariableParameter) {
    this.array = rawData;
    this.metadataByVariable = metadataByVariableParameter;
    console.log("check: ", this);
  }

  getNumberOfVariables(): number {
    return Object.keys(this.metadataByVariable).length;
  }

  getNumberOfOptions(): number {
    return Object.values(this.metadataByVariable).reduce((aAcc, a) => {
      return aAcc + a.numberOptions;
    }, 0);
  }
}
