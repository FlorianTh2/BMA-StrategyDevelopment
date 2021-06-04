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
    let optionNames = inputArray[0].slice(3);
    console.log(optionNames);
    inputArray.map((row, rowIndex) => {
      if (rowIndex == 0) return;
      this.modules[row[0]] = {
        ...this.modules[row[0]],
        [row[1]]: {
          ...(this.modules[row[0]] ? this.modules[row[0]][row[1]] : {}),
          [row[2]]: Object.assign(
            {},
            ...optionNames
              .map((optionName, optionNameIndex) => {
                return {
                  [optionName]:
                    row[3 + optionNameIndex] !== undefined
                      ? typeof row[3 + optionNameIndex] === "number"
                        ? row[3 + optionNameIndex]
                        : undefined
                      : undefined
                };
              })
              .map((item) => ({ ...item }))
          )
        }
      };
    });
    console.log(this.modules);
  }
}
