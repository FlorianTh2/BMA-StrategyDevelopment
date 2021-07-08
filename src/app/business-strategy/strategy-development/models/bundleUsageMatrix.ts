import { ConcistencyMatrix } from "./concistencyMatrix";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { BundleMatrix } from "./bundleMatrix";
import {
  MetadataBundleUsageVariable,
  MetadataBundleUsageVariableOption
} from "./metadataBundleUsageVariable";
import { ClusterGroup } from "./clusterGroup";
import { BundleBUM } from "./bundleBUM";
import { BundleData } from "./bundleData";

export class BundleUsageMatrix {
  // vertical row labels x
  // ° o o o o o o
  // x o o o o o o
  // x o o o o o o
  // x o o o o o o
  // x o o o o o o
  // applies only for the options attribute in clusterGroup since
  // the bundle data is in the row-column-combination format
  metadataBundleUsageVariables: MetadataBundleUsageVariable[];
  clusterGroups: ClusterGroup[] = [];

  constructor(
    consistencyMatrix: ConcistencyMatrix,
    bundleMatrix: BundleMatrix,
    clusterMembershipMatrix: ClusterMembershipMatrix
  ) {
    this.generateBundleUsageMatrix(
      consistencyMatrix,
      bundleMatrix,
      clusterMembershipMatrix
    );
  }

  generateBundleUsageMatrix(
    consistencyMatrix: ConcistencyMatrix,
    bundleMatrix: BundleMatrix,
    clusterMemberShipMatrix: ClusterMembershipMatrix
  ): void {
    const variablesOptions: Record<string, number> = {};
    this.metadataBundleUsageVariables = Object.values(
      consistencyMatrix.metadataByVariable
    ).map((a) => {
      return {
        id: a.id,
        numberOptions: a.numberOptions,
        startIndex: a.startIndex,
        options: Object.values(a.options).map((b) => {
          variablesOptions[b.id] = 0;
          return {
            name: b.name,
            id: b.id,
            index: b.index
          } as MetadataBundleUsageVariableOption;
        })
      } as MetadataBundleUsageVariable;
    });

    // consider only those bundles from bundleMatrix whos name appear in clusterMemberShipMatrix

    const bundles: number[][] = [];
    const bundleMetaData: BundleData[] = [];
    const bundleNameListClusterMembershipMatrix: string[] = [].concat.apply(
      [],
      Object.values(clusterMemberShipMatrix.clusterMemberShipDict)
    );
    bundleMatrix.bundleMetaData.forEach((a, aIndex) => {
      const filterResult = bundleNameListClusterMembershipMatrix.filter((b) => {
        return a.name === b;
      });
      if (filterResult.length != 0) {
        bundles.push(bundleMatrix.bundles[aIndex]);
        bundleMetaData.push(bundleMatrix.bundleMetaData[aIndex]);
      }
    });

    // "selectedBundleMatrix"
    bundleMatrix = {
      bundles: bundles,
      bundleMetaData: bundleMetaData,
      bundleMatrixRowColumnCombinations:
        bundleMatrix.bundleMatrixRowColumnCombinations
    } as BundleMatrix;
    //
    // console.log("selectedBundleMatrix: ", bundleMatrix);

    let clusterGroups = Object.entries(
      clusterMemberShipMatrix.clusterMemberShipDict
    ).map(([aKey, aValue], aIndex) => {
      // create result clustergroup
      let clusterGroup = new ClusterGroup();
      clusterGroup.name = aKey;
      clusterGroup.bundleMatrixRowColumnCombinations =
        bundleMatrix.bundleMatrixRowColumnCombinations;

      // create bundles from bundlematrix
      clusterGroup.bundles = aValue.map((b, bIndex) => {
        let bundleIndex = bundleMatrix.bundleMetaData.findIndex(
          (c) => c.name === b
        );
        return {
          name: bundleMatrix.bundleMetaData[bundleIndex].name,
          bundleSzenarioCombinationString:
            bundleMatrix.bundleMetaData[bundleIndex]
              .bundleSzenarioCombinationString,
          bundleData: bundleMatrix.bundles[bundleIndex]
        } as BundleBUM;
      });
      clusterGroup.options = { ...variablesOptions };

      // build dict: variablenname -> optionsName -> counterOfItsAppearences
      // group under variablename is needed since later we want to aggregate
      // all optionCounts UNDER 1 VARIABLE
      let internalCounterDict: Record<string, Record<string, number>> = {};
      let pairNamesOfBundleDivided: string[][] =
        clusterGroup.bundleMatrixRowColumnCombinations;

      let keysWhichAreNotZero = clusterGroup.bundles
        .map((b) => {
          const indexResults = b.bundleData
            .map((c, cIndex) => {
              if (c != 0) {
                return cIndex;
              }
            })
            .filter((c) => c != undefined);
          const keysWhichAreNotZeroForThisBundle = indexResults
            .map((c) => {
              const keyNames =
                clusterGroup.bundleMatrixRowColumnCombinations[c];
              return keyNames;
            })
            .reduce((c, d) => c.concat(d), []);
          return keysWhichAreNotZeroForThisBundle;
        })
        .reduce((b, c) => b.concat(c), []);

      // find options corresponding variable name and count up (+1) in internal dict
      // here only one module is considered
      // name shortening
      keysWhichAreNotZero.forEach((a) => {
        Object.entries(consistencyMatrix.metadataByVariable).forEach(
          ([keyVariable, valueVariable]) => {
            if (valueVariable.options[a] != undefined) {
              if (internalCounterDict[keyVariable] == undefined) {
                internalCounterDict[keyVariable] = {
                  [a]: 1
                };
              } else if (internalCounterDict[keyVariable][a] == undefined) {
                internalCounterDict[keyVariable][a] = 1;
              } else {
                internalCounterDict[keyVariable][a] =
                  internalCounterDict[keyVariable][a] + 1;
              }
            }
          }
        );
      });

      Object.entries(internalCounterDict).forEach(
        ([
          keyOfVariableInternalCounterDict,
          valueOfVariableInternalCounterDict
        ]) => {
          let sumOfAllOptionsOfThisVariable = Object.entries(
            valueOfVariableInternalCounterDict
          ).reduce((a, [keyOfReduce, valueOfReduce]) => a + valueOfReduce, 0);
          Object.entries(valueOfVariableInternalCounterDict).forEach(
            ([optionsKey, optionsValue]) => {
              clusterGroup.options[optionsKey] =
                (optionsValue / sumOfAllOptionsOfThisVariable) * 100;
            }
          );
        }
      );
      return clusterGroup;
    });
    this.clusterGroups = clusterGroups;
  }
}
