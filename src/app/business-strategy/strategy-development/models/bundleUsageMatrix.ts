import { ConcistencyMatrix } from "./concistencyMatrix";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { BundleMatrix } from "./bundleMatrix";
import {
  MetadataBundleUsageVariable,
  MetadataBundleUsageVariableOption
} from "./metadataBundleUsageVariable";
import { ClusterGroup } from "./clusterGroup";
import { Bundle } from "./bundle";
import { BundleBUM } from "./bundleBUM";

export class BundleUsageMatrix {
  // vertical row labels x
  // ° o o o o o o
  // x o o o o o o
  // x o o o o o o
  // x o o o o o o
  // x o o o o o o
  metadataBundleUsageVariables: MetadataBundleUsageVariable[];
  clusterGroups: ClusterGroup[];

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
  ): BundleUsageMatrix {
    const variablesOptions: Record<string, number> = {};
    this.metadataBundleUsageVariables = Object.values(
      consistencyMatrix.metadataByVariable
    ).map((a) => {
      return {
        id = a.id,
        numberOptions = a.numberOptions,
        startIndex = a.startIndex,
        options = Object.values(a.options).map((b) => {
          variablesOptions[b.id] = 0;
          return {
            name: b.name,
            id: b.id,
            index: b.index
          } as MetadataBundleUsageVariableOption;
        })
      } as MetadataBundleUsageVariable;
    });

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

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      // get a random options dict (random since all optionsDict should have same structure)
      let optionsDict = {};
      Object.keys(clusterGroup.bundles[0].bundleData).forEach((b) => {
        let splitOptionsCombination = b.split("/");
        splitOptionsCombination.forEach((c) => {
          optionsDict[c] = 0;
        });
      });
      clusterGroup.options = optionsDict;
      // set all values to 0
      Object.entries(clusterGroup.options).forEach(
        ([optionsKey, optionsValue]) => {
          clusterGroup.options[key] = 0;
        }
      );

      // build dict: variablenname -> optionsName -> counterOfItsAppearences
      // group under variablename is needed since later we want to aggregate
      // all optionCounts UNDER 1 VARIABLE
      let internalCounterDict: Record<string, Record<string, number>> = {};
      // if not even 1 bundle exists, idk throw error
      let pairNamesOfBundle: string[] = Object.keys(clusterGroup.bundles[0]);
      let pairNamesOfBundleDivided: string[][] = pairNamesOfBundle.map((a) => {
        return a.split("/");
      });
      let keysWhichAreNotZero = clusterGroup.bundles
        .map((a) => {
          return Object.entries(a.bundleData)
            .filter(([keyBundle, valueBundle]) => {
              return valueBundle != 0;
            })
            .map((a) => {
              // after this line, we will ignore the value stored after the key
              // let separatKeysToSingleOptions: string[] = keysWhichAreNotZero
              // return [a[0].split("/"), a[1]];
              return a[0].split("/");
            })
            .reduce((a, b) => a.concat(b), []);
        })
        .reduce((a, b) => a.concat(b), []);

      // find options corresponding variable name and count up (+1) in internal dict
      // here only one module is considered
      let moduleNameConsistencyMatrix = Object.keys(
        consistencyMatrix.modules
      )[0];
      // name shortening
      let mcm = moduleNameConsistencyMatrix;
      keysWhichAreNotZero.forEach((a) => {
        Object.entries(consistencyMatrix.modules[mcm]).forEach(
          ([keyVariable, valueVariable]) => {
            if (valueVariable[a] != undefined) {
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
      console.log("internal");
      // console.log(internalCounterDict);
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
      // console.log("clustergroup options");
      // console.log(clusterGroup.options);
      return clusterGroup;
    });
  }
}
