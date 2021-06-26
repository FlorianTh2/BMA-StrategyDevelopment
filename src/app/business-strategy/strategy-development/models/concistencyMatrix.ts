import { BundleMatrix } from "./bundleMatrix";
import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";

export class ConcistencyMatrix {
  array: number[][];
  metadataByVariable: Record<string, MetadataVariable>;
  maxBundles: number = 500_000;
  maxSelectedBundles: number = 2; //16_000;

  constructor(data: Array<Array<any>>) {
    console.log("constructor");
    // console.log(data);
    let parseResult = this.parseAoAToConsistencyMatrix(data);
    this.array = parseResult.array;
    this.metadataByVariable = parseResult.metadataByVariable;
  }

  parseAoAToConsistencyMatrix(dataInputWithHeader: Array<Array<any>>) {
    console.log("parse");
    let numberOptions = dataInputWithHeader[0].slice(3).length;
    let resultArray: number[][] = [];
    let metadataByVariable: Record<string, MetadataVariable> = {};
    let dataInput: any[][] = dataInputWithHeader.slice(1);
    dataInput.forEach((row: any[], rowIndex: number) => {
      if (metadataByVariable[row[0].trim()]) {
        metadataByVariable[row[0].trim()].options[row[2].trim()] = {
          name: row[1].trim(),
          index: rowIndex
        } as MetadataVariableOption;
        metadataByVariable[row[0].trim()].numberOptions += 1;
      } else {
        metadataByVariable[row[0].trim()] = {
          id: row[0].trim(),
          startIndex: rowIndex,
          numberOptions: 1,
          options: {
            [row[2].trim()]: {
              id: row[2].trim(),
              name: row[1].trim(),
              index: rowIndex
            }
          } as Record<string, MetadataVariableOption>
        };
      }
      let rowOptions = row.slice(3);
      let resultRowArray = Array.from(Array(numberOptions));
      rowOptions.forEach((b, indexB) => {
        resultRowArray[indexB] = typeof b === "number" ? b : undefined;
      });
      resultArray.push(resultRowArray);
    });

    console.log("finished parsingAoAToConsistencyMatrix");
    // console.log(resultArray);
    // console.log(metadataByVariable);
    return {
      metadataByVariable: metadataByVariable,
      array: resultArray
    };
  }

  createbundles(): BundleMatrix {
    console.log("create bundles");
    console.time("loop");
    let szenarios = this.createScenarios(this.metadataByVariable);
    console.timeEnd("loop");
    console.log(szenarios.length);
    // console.log("done");
    // console.log(szenarios);
    return null;
  }

  createScenarios(
    currentVariablesData: Record<string, MetadataVariable>
  ): string[][] {
    console.log("create szenarios");
    let variables = Object.entries(currentVariablesData).map(([aKey, aValue]) =>
      Object.values(aValue.options)
    );
    let indexStore: number[] = variables.map((a) => 0);
    let scenarioStore: string[][] = [];
    let run = true;
    while (run) {
      if (scenarioStore.length < this.maxBundles) {
        // get option-metadataobjects based on indexStore
        // in matrix: column-key
        const bundleOptions = this.indexStoreReturnVariables(
          indexStore,
          variables
        );
        // get all bundleoptions combinations (there should be a value in the matrix)
        // in matrix: row-keys of the selected options (not all possible row-keys)
        const OptionCombinations = this.createBundleOptionsKombination(
          bundleOptions
        );

        scenarioStore.push(bundle);
      }
      run = this.increaseIndexStore(variables, indexStore);
    }
    return scenarioStore;
  }

  indexStoreReturnVariables(
    indexStore: number[],
    variables: MetadataVariableOption[][]
  ) {
    return indexStore.map((a, aIndex) => {
      return variables[aIndex][a];
    });
  }

  // returns if first index of indexStore has not reached max-value
  increaseIndexStore(
    variables: MetadataVariableOption[][],
    indexStore: number[]
  ) {
    let indexStoreAddingIndex = indexStore.length - 1;
    while (true) {
      if (
        indexStore[indexStoreAddingIndex] <
        variables[indexStoreAddingIndex].length - 1
      ) {
        indexStore[indexStoreAddingIndex] += 1;
        return true;
      } else if (indexStoreAddingIndex == 0) {
        return false;
      } else {
        indexStore[indexStoreAddingIndex] = 0;
        indexStoreAddingIndex--;
      }
    }
  }

  // let currentVariable = remainingVariables[0];
  // let currentOptions: string[] = Object.keys(
  //   metadataByVariable[currentVariable].options
  // );
  // remainingVariables = remainingVariables.slice(1);
  // remainingVariables.forEach((a) => {});

  // https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
  // https://stackoverflow.com/questions/22697936/binary-search-in-javascript
  // dont apply if there are places remaining
  // only apply if the size of the current array is fixed (and not further expanding)
  binarySearchIndexToRemove(array, value) {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      if (array[mid] < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // input: e.g. ["1A", "2A", "3A"]
  createBundleOptionsKombination(options: MetadataVariableOption[]) {
    let combinationsArray: MetadataVariableOption[][] = [];
    for (let a = 0; a < options.length; a++) {
      for (let b = a + 1; b < options.length; b++) {
        combinationsArray.push([options[a], options[b]]);
      }
    }
    return combinationsArray;
  }
}
