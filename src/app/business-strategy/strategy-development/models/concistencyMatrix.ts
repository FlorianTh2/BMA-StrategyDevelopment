import { BundleMatrix } from "./bundleMatrix";
import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";
import { Bundle } from "./bundle";
import { Meta } from "@angular/platform-browser";
import { BundleData } from "./bundleData";

export class ConcistencyMatrix {
  array: number[][];
  metadataByVariable: Record<string, MetadataVariable>;
  maxIterations: number = 500_000;
  maxBundles: number = 16_000;

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
          id: row[2].trim(),
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
    // console.log(this.metadataByVariable);
    let szenarios = this.createScenarios(this.array, this.metadataByVariable);
    console.timeEnd("loop");
    console.log(szenarios.bundles.length);
    console.log("done");
    console.log(szenarios);
    return null;
  }

  createScenarios(
    currentVariablesData: number[][],
    currentVariablesMetaData: Record<string, MetadataVariable>
  ): BundleMatrix {
    console.log("create szenarios");
    let variables: MetadataVariableOption[][] = Object.entries(
      currentVariablesMetaData
    ).map(([aKey, aValue]) => Object.values(aValue.options));
    let indexStore: number[] = variables.map((a) => 0);
    let bundleStore: Bundle[] = [];
    let minConsistencyValue = -1;
    const numberBundles = variables.reduce((acc, item) => {
      return acc * item.length;
    }, 1);
    let a;
    for (a = 0; a < numberBundles && a < this.maxIterations; a++) {
      const bundle = this.createBundle(
        indexStore,
        currentVariablesData,
        variables,
        a
      );

      // 1. = bundle is not consistent
      // 2. if bundleStore is full and bundles consistencyValue is lower than current minConsistencyValue
      //  discard bundle
      if (
        bundle == null ||
        (bundleStore.length == this.maxBundles &&
          bundle.consistence < minConsistencyValue)
      ) {
        this.increaseIndexStore(variables, indexStore);
        continue;
      }
      if (bundleStore.length < this.maxBundles) {
        const index = this.binarySearchDescendingInputValues(
          bundleStore,
          bundle.consistence
        );
        // parameter
        // 1. at index
        // 2. deleting x items first
        // 3. element
        bundleStore.splice(index, 0, bundle);
      } else {
        // can just pop since we already checked if lower than lowest
        bundleStore.pop();
        const index = this.binarySearchDescendingInputValues(
          bundleStore,
          bundle.consistence
        );
        bundleStore.splice(index, 0, bundle);
      }
      // set new minConsistence
      minConsistencyValue = bundleStore[0].consistence;
      this.increaseIndexStore(variables, indexStore);
    }
    const rowColumnCombination = this.createAllRowColumnPairCombinations(
      this.metadataByVariable
    );
    const denseBundleData = this.bundleDataToDense(
      bundleStore,
      rowColumnCombination
    );
    let bundleMatrix: BundleMatrix = {
      bundles: denseBundleData,
      bundleMatrixRowColumnCombinations: rowColumnCombination
    };
    return bundleMatrix;
  }

  createBundle(
    indexStore: number[],
    currentVariablesData: number[][],
    variables: MetadataVariableOption[][],
    runIndex: number
  ) {
    // get option-metadataobjects based on indexStore
    // in matrix: column-key
    const bundleOptions = this.indexStoreReturnVariables(indexStore, variables);
    // get all bundleoptions combinations (there should be a value in the matrix)
    // in matrix: row-keys of the selected options (not all possible row-keys)
    const optionCombinations: MetadataVariableOption[][] =
      this.createBundleOptionsKombination(bundleOptions);
    let isConsistent = true;
    optionCombinations.forEach((a) => {
      if (currentVariablesData[a[1].index][a[0].index] == 1) {
        isConsistent = false;
        return;
      }
    });
    if (!isConsistent) {
      return null;
    }
    return {
      name: "bundle " + runIndex,
      consistence: optionCombinations.reduce((acc, a) => {
        return acc + currentVariablesData[a[1].index][a[0].index];
      }, 0),
      bundleSzenarioCombinationString: bundleOptions
        .map((a) => a.id)
        .join(" & "),
      bundleData: optionCombinations.map(
        (a) => currentVariablesData[a[1].index][a[0].index]
      ),
      bundleMetaData: optionCombinations
    } as Bundle;
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
        return;
      } else if (indexStoreAddingIndex == 0) {
        return;
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
  // input e.g. array = [0,1,2,3], value=1
  // output e.g. 1
  binarySearchAscendingInputValues(array: Bundle[], value) {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      if (array[mid].consistence < value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // input e.g. array = [8, 7, 6, 5, 4, 3, 2, 1], value=7
  // output e.g. 1
  binarySearchDescendingInputValues(array: Bundle[], value) {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      if (array[mid].consistence > value) low = mid + 1;
      else high = mid;
    }
    return low;
  }

  // input: e.g. ["1A", "2A", "3A"]
  // output e.g. [["1A", "2A"], ["1A", "3A"], ["2A", "3A"]]
  createBundleOptionsKombination(options: MetadataVariableOption[]) {
    let combinationsArray: MetadataVariableOption[][] = [];
    for (let a = 0; a < options.length; a++) {
      for (let b = a + 1; b < options.length; b++) {
        combinationsArray.push([options[a], options[b]]);
      }
    }
    return combinationsArray;
  }

  // // input: e.g. ["1A", "2A", "3A"]
  // // output e.g. [["1A", "2A"], ["1A", "3A"], ["2A", "3A"]]
  // createBundleOptionsKombination(options: MetadataVariableOption[]) {
  //   let combinationsArray: BundleMetaData[] = [];
  //   for (let a = 0; a < options.length; a++) {
  //     for (let b = a + 1; b < options.length; b++) {
  //       combinationsArray.push({
  //         row: options[b].index,
  //         column: options[b].index,
  //         id: [options[a].id, options[b].id]
  //       });
  //     }
  //   }
  //   return combinationsArray;
  // }

  // input: e.g. this.metadataByVariable with 3_2 (3 variables, 2 options each)
  // output e.g. [["1A", "2A"], ["1A", "2B"], ["1A", "3A"], ["1A", "3B"], ["1B", "2A"], ["1B", "2B"], ["1B", "3A"], ["1B", "3B"], ["2A", "3A"], ["2A", "3B"], ["2B", "3A"], ["2B", "3B"]]
  createAllRowColumnPairCombinations(
    currentVariablesData: Record<string, MetadataVariable>
  ): string[][] {
    let variables: string[][] = Object.values(currentVariablesData).map((a) =>
      Object.keys(a.options)
    );
    let result: string[][] = [];
    for (let a = 0; a < variables.length; a++) {
      for (let b = 0; b < variables[a].length; b++) {
        for (let c = a + 1; c < variables.length; c++) {
          for (let d = 0; d < variables[c].length; d++) {
            result.push([variables[a][b], variables[c][d]]);
          }
        }
      }
    }
    return result;
  }

  bundleDataToDense(
    bundleStore: Bundle[],
    rowColumnCombination: string[][]
  ): {
    data: number[][];
    metaData: BundleData[];
  } {
    return null;
  }
}

// interface BundleMetaData {
//   row: number;
//   column: number;
//   id: string[];
// }
