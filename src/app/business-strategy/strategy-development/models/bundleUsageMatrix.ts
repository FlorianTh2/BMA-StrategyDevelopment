import { ConcistencyMatrix } from "./concistencyMatrix";
import { ClusterMembershipMatrix } from "./clusterMembershipMatrix";
import { MetadataClusterGroup } from "./clusterGroup";
import { BundleMatrix } from "./bundleMatrix";
import { MetadataVariable } from "./metadataVariable";

export class BundleUsageMatrix {
  array: number[][];
  // options: Record<string, number>;
  metadataByVariable: Record<string, MetadataVariable>;
  clusterGroups: MetadataClusterGroup[];

  constructor(
    consistencyMatrix: ConcistencyMatrix,
    clusterMembershipMatrix: ClusterMembershipMatrix
  ) {}

  generateBundleUsageMatrix(
    consistencyMatrix: ConcistencyMatrix,
    bundleMatrix: BundleMatrix,
    clusterMemberShipMatrix: ClusterMembershipMatrix
  ): BundleUsageMatrix {
    // consider only those bundles from bundleMatrix whos name appear in clusterMemberShipMatrix
    // let selectedBundleMatrix: BundleMatrix = new BundleMatrix(
    //   bundleMatrix.bundles
    //     .map((a) => {
    //       if (a.name in clusterMemberShipMatrix.clusterMemberShipDict) {
    //         return a;
    //       }
    //       return null;
    //     })
    //     .filter((a) => a !== null)
    // );

    let clusterNameToBundleNameMapping =
      clusterMemberShipMatrix.createClusterToBundleMappingWithSelectedKey(
        selectedBundleMatrix.bundles.map((a) => {
          return a.name;
        })
      );

    let clusterGroups = Object.entries(clusterNameToBundleNameMapping).map(
      ([key, value]) => {
        let clusterGroup = new ClusterGroup();
        clusterGroup.name = key;
        clusterGroup.bundles = value.map((a) => {
          // has to exist, thats why we can directly [0]
          return selectedBundleMatrix.bundles.filter((b) => {
            return b.name === a;
          })[0];
        });
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
        let pairNamesOfBundleDivided: string[][] = pairNamesOfBundle.map(
          (a) => {
            return a.split("/");
          }
        );
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
      }
    );
    return result;
  }
}
