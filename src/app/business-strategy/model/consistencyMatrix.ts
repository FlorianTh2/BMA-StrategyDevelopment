import { IConcistencyMatrix } from "./consistencyMatrix.interface";

export class ConcistencyMatrix implements IConcistencyMatrix {
  name: string;
  modules: Record<
    string,
    Record<string, Record<string, Record<string, number>>>
  > = {};

  constructor(name, data: Array<Array<any>>) {
    this.name = name;
    this.parseToInternalDict(data);
  }

  parseToInternalDict(inputArray: Array<Array<any>>) {
    // console.log(inputArray);
    let optionNames = inputArray[0].slice(3).map(a => a.trim());
    console.log(optionNames);
    console.log("inputArray")
    console.log(inputArray)
    inputArray.map((row, rowIndex) => {
      if (rowIndex == 0) return;
      this.modules[row[0].trim()] = {
        ...this.modules[row[0].trim()],
        [row[1].trim()]: {
          ...(this.modules[row[0].trim()] ? this.modules[row[0].trim()][row[1].trim()] : {}),
          [row[2].trim()]: Object.assign(
            {},
            ...optionNames
              .map((optionName, optionNameIndex) => {
                let oneOptionOfRow = {
                  [optionName]:
                    row[3 + optionNameIndex] !== undefined
                      ? typeof row[3 + optionNameIndex] === "number"
                      ? row[3 + optionNameIndex]
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
    console.log(this.modules);
  }

  createbundles(){
    let moduleNames: string[] = Object.keys(this.modules)
    let variableNames: string[] = Object.keys(this.modules[moduleNames[0]])
    let optionNamesOneVariable : string[] = Object.keys(this.modules[moduleNames[0]][variableNames[0]])
    let allOptionNames = Object.keys(this.modules[moduleNames[0]][variableNames[0]][optionNamesOneVariable[0]])
    console.log(allOptionNames)
    let result = [];
    result = allOptionNames.map(a => {
      return moduleNames.map(b => {
        return variableNames.map(c => {
          return this.modules[b][c][a]
        })
      })
    })
    console.log(result)
    // this.modules.
  }

  // remainingVariables: startinput = all Variables
  // currently only for 1 module: thats why remainingVariables: this.modules[0]
  createSzenarios(){
    let moduleNames: string[] = Object.keys(this.modules)
    let variableNames: string[] = Object.keys(this.modules[moduleNames[0]])
    console.log(variableNames)
    return this.createSzenariosIntern(this.modules[moduleNames[0]], [], variableNames);
  }

  createSzenariosIntern(
    currentVariablesData: Record<string, Record<string, Record<string, number>>>,
    currentOptions: string[] = [],
    remainingVariables: string[] = []
  ): string[][]
  {
    if(remainingVariables.length > 0){
      // get variable
      // get all options of this variable
      // iterate through all options of this variable
      //    return this.createSzenario(data, currentOptions.add(currentOption), remainingVariables.removeFirst())
      let currentVariable: string = remainingVariables[0];
      let optionsOfThisVariable: string[] = Object.keys(currentVariablesData[currentVariable]);
      let resultOfOfRecursions = optionsOfThisVariable.map(a => {
        return this.createSzenariosIntern(
          currentVariablesData,
          [...currentOptions, a],
          remainingVariables.slice(1)
        )
      })
      let flattendResultOfRecursions = [].concat.apply([], resultOfOfRecursions);
      return flattendResultOfRecursions;
    }
    // [] since we want e.g. [[option0, option1, option2]]
    // since in the higher recursion step we call flatten, but we want keep the options bundeled (in the array)
    // sure we could not call flatten in higher recursion step, but then every higher recursion step does not call
    // flatten and that is not what we want
    return [currentOptions];
  }
}
