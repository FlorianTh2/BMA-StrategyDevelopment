import { MetadataVariable, MetadataVariableOption } from "./metadataVariable";

export abstract class Helper {
  public static getMaxNumberOfBundles(
    variables: MetadataVariableOption[][]
  ): number {
    return variables.reduce((acc, item) => {
      return acc * item.length;
    }, 1);
  }

  public static convertVariablesDictToList(
    currentVariablesMetaData: Record<string, MetadataVariable>
  ): MetadataVariableOption[][] {
    return Object.entries(currentVariablesMetaData).map(([aKey, aValue]) =>
      Object.values(aValue.options)
    );
  }
}
