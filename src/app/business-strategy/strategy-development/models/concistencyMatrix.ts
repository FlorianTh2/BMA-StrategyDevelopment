import { BundleMatrix } from "./bundleMatrix";
import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";
import { Bundle } from "./bundle";
import { Meta } from "@angular/platform-browser";
import { BundleData } from "./bundleData";
import { IndexStore } from "./indexStore";
import { BundleStore } from "./bundleStore";

export class ConcistencyMatrix {
  array: number[][];
  metadataByVariable: Record<string, MetadataVariable>;
  _maxIterations: number = 500_000;
  _maxBundles: number = 4_000;
  iterations: number;

  constructor(data: Array<Array<any>>) {
    let parseResult = this.parseAoAToConsistencyMatrix(data);
    this.array = parseResult.array;
    this.metadataByVariable = parseResult.metadataByVariable;
  }

  set maxBundles(value: number) {
    this._maxBundles = value;
  }
  set maxIterations(value: number) {
    this._maxIterations = value;
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
    return {
      metadataByVariable: metadataByVariable,
      array: resultArray
    };
  }

  createBundleMatrix(
    currentVariablesData: number[][],
    currentVariablesMetaData: Record<string, MetadataVariable>
  ): BundleMatrix {
    console.log("createBundleMatrix");
    let variables: MetadataVariableOption[][] = this.convertVariablesDictToList(
      currentVariablesMetaData
    );
    let indexStore: IndexStore = new IndexStore(variables);
    let bundleStore: BundleStore = new BundleStore(this._maxBundles);
    const numberBundles = this.getMaxNumberOfBundles(variables);
    let a;
    for (a = 0; a < numberBundles && a < this._maxIterations; a++) {
      const bundle: Bundle = this.createBundle(
        indexStore,
        currentVariablesData,
        variables,
        a
      );
      bundleStore.addBundle(bundle);
      indexStore.up();
    }
    this.iterations = a;
    const rowColumnCombination = this.createAllRowColumnPairCombinations(
      this.metadataByVariable
    );
    // console.log("test sdfasfasddfdfa");
    // console.log(bundleStore);
    const bundleDense = this.bundleDataToDense(
      bundleStore.bundleStorage,
      rowColumnCombination
    );
    let bundleMatrix: BundleMatrix = {
      bundles: bundleDense.data,
      bundleMetaData: bundleDense.metaData,
      bundleMatrixRowColumnCombinations: rowColumnCombination
    };
    return bundleMatrix;
  }

  createBundle(
    indexStore: IndexStore,
    currentVariablesData: number[][],
    variables: MetadataVariableOption[][],
    runIndex: number
  ) {
    // get option-metadataobjects based on indexStore
    // in matrix: column-key
    // const bundleOptions = this.indexStoreReturnVariables(indexStore, variables);
    const bundleOptions =
      indexStore.getVariablesOptionsBasedOnCurrentIndexStore();
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

  getMaxNumberOfBundles(variables: MetadataVariableOption[][]): number {
    return variables.reduce((acc, item) => {
      return acc * item.length;
    }, 1);
  }

  convertVariablesDictToList(
    currentVariablesMetaData: Record<string, MetadataVariable>
  ): MetadataVariableOption[][] {
    return Object.entries(currentVariablesMetaData).map(([aKey, aValue]) =>
      Object.values(aValue.options)
    );
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
    const resultData: number[][] = [];
    const resultMetaData: BundleData[] = [];
    const defaultBundle: number[] = rowColumnCombination.map((a) => 0);
    const lookupIndexTable: Record<string, number> = {};
    rowColumnCombination.forEach((a, index) => {
      lookupIndexTable[a.join("/")] = index;
    });
    bundleStore.forEach((a) => {
      const dataItem: number[] = [...defaultBundle];
      a.bundleData.forEach((b, bIndex) => {
        const index =
          lookupIndexTable[a.bundleMetaData[bIndex].map((c) => c.id).join("/")];
        dataItem[index] = b;
      });
      const metaData: BundleData = {
        name: a.name,
        bundleSzenarioCombinationString: a.bundleSzenarioCombinationString,
        consistence: a.consistence
      };
      resultData.push(dataItem);
      resultMetaData.push(metaData);
    });
    return {
      data: resultData,
      metaData: resultMetaData
    };
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
