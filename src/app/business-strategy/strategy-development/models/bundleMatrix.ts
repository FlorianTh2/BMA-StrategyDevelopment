import { BundleData } from "./bundleData";
import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";
import { IndexStore } from "./indexStore";
import { BundleStore } from "./bundleStore";
import { Bundle } from "./bundle";
import { ConcistencyMatrix } from "./concistencyMatrix";
import { Helper } from "./helper";

export class BundleMatrix {
  _maxIterations: number = 500_000;
  _maxBundles: number = 4_000;
  iterations: number;
  _consistencyBoundary: number = 1;
  _consistencyStrategySetNewBundle: boolean = true;

  // each bundles has at the same index as the bundle a bundleMetaData-object
  bundles: number[][];
  bundleMetaData: BundleData[];
  // stores all possible bundleMatrixRowColumnCombinations
  // needed since the bundles only store metadata about at which index they got a value (in a sparse manner)
  // e.g. ["2A", "3A"]
  //  and not their values embedded in a full size "all rows" vector
  // e.g. [["1A","2A"],["1A","2B"]]
  // inner array stores exactly 2 elements: 1. row 2. column
  bundleMatrixRowColumnCombinations: string[][];

  constructor(
    consistencyMatrix: ConcistencyMatrix,
    maxIterations: number,
    maxBundles: number,
    consistencyBoundary: number,
    consistencyStrategySetNewBundle: boolean
  ) {
    this._maxIterations = maxIterations;
    this._maxBundles = maxBundles;
    this._consistencyBoundary = consistencyBoundary;
    this._consistencyStrategySetNewBundle = consistencyStrategySetNewBundle;
    let tmpCoreBundleMatrix = this.createBundleMatrix(
      consistencyMatrix.array,
      consistencyMatrix.metadataByVariable
    );
    this.bundles = tmpCoreBundleMatrix.bundles;
    this.bundleMetaData = tmpCoreBundleMatrix.bundleMetaData;
    this.bundleMatrixRowColumnCombinations =
      tmpCoreBundleMatrix.bundleMatrixRowColumnCombinations;
  }

  set maxBundles(value: number) {
    this._maxBundles = value;
  }
  set maxIterations(value: number) {
    this._maxIterations = value;
  }

  createBundleMatrix(
    currentVariablesData: number[][],
    currentVariablesMetaData: Record<string, MetadataVariable>
  ): {
    bundles: number[][];
    bundleMetaData: BundleData[];
    bundleMatrixRowColumnCombinations: string[][];
  } {
    console.log("createBundleMatrix");
    let variables: MetadataVariableOption[][] =
      Helper.convertVariablesDictToList(currentVariablesMetaData);
    let indexStore: IndexStore = new IndexStore(variables);
    let bundleStore: BundleStore = new BundleStore(
      this._maxBundles,
      this._consistencyStrategySetNewBundle
    );
    const numberBundles = Helper.getMaxNumberOfBundles(variables);
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
      currentVariablesMetaData
    );
    // console.log("test sdfasfasddfdfa");
    // console.log(bundleStore);
    const bundleDense = this.bundleDataToDense(
      bundleStore.bundleStorage,
      rowColumnCombination
    );

    return {
      bundles: bundleDense.data,
      bundleMetaData: bundleDense.metaData,
      bundleMatrixRowColumnCombinations: rowColumnCombination
    };
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
      if (
        !(
          currentVariablesData[a[1].index][a[0].index] >
          this._consistencyBoundary
        )
      ) {
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
}
