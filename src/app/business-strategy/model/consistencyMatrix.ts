import { IConcistencyMatrix } from "./consistencyMatrix.interface";
import { IBundleMatrix } from "./bundleMatrix.interface";
import { BundleMatrix } from "./bundleMatrix";
import { Bundle } from "./bundle";

export class ConcistencyMatrix implements IConcistencyMatrix {
  name: string;
  // <moduleName, <variablenName, <optionNameRow, <optionNameColumn, value>>>>>
  modules: Record<
    string,
    Record<string, Record<string, Record<string, number>>>
  > = {};

  constructor(name, data: Array<Array<any>>) {
    this.name = name;
    this.parseToInternalDict(data);
  }

  // ignores option- (= option-name) -column
  parseToInternalDict(inputArray: Array<Array<any>>) {
    let optionNames = inputArray[0].slice(4).map((a) => a.trim());
    // console.log(optionNames);
    // console.log(inputArray);
    inputArray.map((row, rowIndex) => {
      if (rowIndex == 0) return;
      this.modules[row[0].trim()] = {
        ...this.modules[row[0].trim()],
        [row[1].trim()]: {
          ...(this.modules[row[0].trim()]
            ? this.modules[row[0].trim()][row[1].trim()]
            : {}),
          // ignore optionsname column
          [row[3].trim()]: Object.assign(
            {},
            ...optionNames
              .map((optionName, optionNameIndex) => {
                let oneOptionOfRow = {
                  [optionName]:
                    row[4 + optionNameIndex] !== undefined
                      ? typeof row[4 + optionNameIndex] === "number"
                        ? row[4 + optionNameIndex]
                        : undefined
                      : undefined
                };
                return oneOptionOfRow;
              })
              .map((item) => ({ ...item }))
          )
        }
      };
    });
  }

  createbundles(): BundleMatrix {
    let szenarios = this.createSzenarios();
    let lookUpTableOfBundleIndices: Record<string, Array<string>> = {};
    szenarios.forEach((a) => {
      let stringSzenarioRespresentation = a.join(" & ");
      lookUpTableOfBundleIndices[
        stringSzenarioRespresentation
      ] = this.createSzenarioOptionsKombination(a);
    });
    console.log("lookUpTableOfBundleIndices");
    console.log(lookUpTableOfBundleIndices);
    let rowColumnCombinations: Record<
      string,
      number
    > = this.createPossibleRowColumnPairCombinations(
      this.modules[Object.keys(this.modules)[0]]
    );
    console.log("rowColumnCombinations");
    // console.log(rowColumnCombinations);

    return this.combineToBundles(
      lookUpTableOfBundleIndices,
      rowColumnCombinations
    );
  }

  // remainingVariables: startinput = all Variables
  // currently only for 1 module: thats why remainingVariables: this.modules[0]
  createSzenarios() {
    let moduleNames: string[] = Object.keys(this.modules);
    let variableNames: string[] = Object.keys(this.modules[moduleNames[0]]);
    return this.createSzenariosIntern(
      this.modules[moduleNames[0]],
      [],
      variableNames
    );
  }

  createSzenariosIntern(
    currentVariablesData: Record<
      string,
      Record<string, Record<string, number>>
    >,
    currentOptions: string[] = [],
    remainingVariables: string[] = []
  ): string[][] {
    if (remainingVariables.length > 0) {
      // get variable
      // get all options of this variable
      // iterate through all options of this variable
      //    return this.createSzenario(data, currentOptions.add(currentOption), remainingVariables.removeFirst())
      let currentVariable: string = remainingVariables[0];
      let optionsOfThisVariable: string[] = Object.keys(
        currentVariablesData[currentVariable]
      );
      let resultOfOfRecursions = optionsOfThisVariable.map((a) => {
        return this.createSzenariosIntern(
          currentVariablesData,
          [...currentOptions, a],
          remainingVariables.slice(1)
        );
      });
      let flattendResultOfRecursions = [].concat.apply(
        [],
        resultOfOfRecursions
      );
      return flattendResultOfRecursions;
    }
    // [] since we want e.g. [[option0, option1, option2]]
    // since in the higher recursion step we call flatten, but we want keep the options bundeled (in the array)
    // sure we could not call flatten in higher recursion step, but then every higher recursion step does not call
    // flatten and that is not what we want
    return [currentOptions];
  }

  // input: e.g. ["1A", "2A", "3A"]
  createSzenarioOptionsKombination(options: string[]) {
    let combinationsArray = [];
    while (options.length > 1) {
      let baseOption = options[0];
      let toCombineOptions = options.slice(1);
      let combineResult = toCombineOptions.forEach((a) => {
        combinationsArray.push([baseOption, a]);
      });
      options = toCombineOptions;
    }
    return combinationsArray;
  }

  createPossibleRowColumnPairCombinations(
    currentVariablesData: Record<string, Record<string, Record<string, number>>>
  ): Record<string, number> {
    let remainingVariables: string[] = Object.keys(currentVariablesData);
    let result = {};
    while (remainingVariables.length > 1) {
      let currentVariable: string = remainingVariables[0];
      let optionsOfThisVariable: string[] = Object.keys(
        currentVariablesData[currentVariable]
      );
      remainingVariables = remainingVariables.slice(1);
      optionsOfThisVariable.forEach((a) => {
        remainingVariables.forEach((b) => {
          let keysOfCombineVariable = Object.keys(currentVariablesData[b]);
          keysOfCombineVariable.forEach((c) => {
            let keyStringRepresentation = a + "/" + c;
            result[keyStringRepresentation] = 0;
          });
        });
      });
    }
    return result;
  }

  combineToBundles(
    lookUpTableOfBundleIndices: Record<string, Array<string>>,
    rowColumnCombinations: Record<string, number>
  ): BundleMatrix {
    let resultList: BundleMatrix = new BundleMatrix();
    let moduleName: string = Object.keys(this.modules)[0];
    // key= e.g. "1a-2a-3a"; value= e.g. [["1a", "2a"], ["1a", "3a"]]
    Object.entries(lookUpTableOfBundleIndices).forEach(
      ([key, valuesArray], index) => {
        let resultDict: Record<string, number> = { ...rowColumnCombinations };
        // value[0] == column
        // value[1] == row
        valuesArray.forEach((value) => {
          // get string representation
          // has to match given string representation, shown in rowColumnCombinations() (-implementation)
          let rowColumnStringRepresentation: string = value[0] + "/" + value[1];
          // search for variables name, since the modules-data is stored in row-major-structur (you can
          // only access through rows -> under rows the column name is stored)
          let variablesNameForGivenOption = "";
          Object.keys(this.modules[moduleName]).forEach((a) => {
            Object.keys(this.modules[moduleName][a]).forEach((b) => {
              // b === value[1]: 2 preconditions:
              // 1. variables of rows (and its options) are same as variables of columns (and its options)
              // 2. value[1] == column name
              if (b === value[1]) {
                variablesNameForGivenOption = a;
              }
            });
          });
          if (variablesNameForGivenOption === "") {
            throw new Error("Row not found.");
          }
          // first value[1] then value[0] since value stores the indices in the format: [column, row]
          let resultValue: number = this.modules[moduleName][
            variablesNameForGivenOption
          ][value[1]][value[0]];
          resultDict[rowColumnStringRepresentation] = resultValue;
        });

        // they do not map except they share the same index for same szenarioCombination
        // ONLY THE INDEX
        resultList.bundles.push(new Bundle(resultDict, key, "B" + (index + 1)));
      }
    );
    return resultList;
  }
}
