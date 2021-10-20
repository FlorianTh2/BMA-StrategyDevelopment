import { MetadataVariableOption } from "./metadataVariable";

export class IndexStore {
  dataStore: number[];
  optionsByVariable: MetadataVariableOption[][];

  constructor(variables: MetadataVariableOption[][]) {
    this.optionsByVariable = variables;
    this.dataStore = variables.map((a) => 0);
  }

  getVariablesOptionsBasedOnCurrentIndexStore() {
    return this.dataStore.map((a, aIndex) => {
      return this.optionsByVariable[aIndex][a];
    });
  }

  // returns if first index of indexStore has not reached max-value
  up() {
    let indexStoreAddingIndex = this.dataStore.length - 1;
    while (true) {
      if (
        this.dataStore[indexStoreAddingIndex] <
        this.optionsByVariable[indexStoreAddingIndex].length - 1
      ) {
        this.dataStore[indexStoreAddingIndex] += 1;
        return;
      } else if (indexStoreAddingIndex == 0) {
        return;
      } else {
        this.dataStore[indexStoreAddingIndex] = 0;
        indexStoreAddingIndex--;
      }
    }
  }
}
