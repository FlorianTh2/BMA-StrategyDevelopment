import { MetadataVariableOption } from "./metadataVariable";

export interface Bundle {
  bundleSzenarioCombinationString: string;
  name: string;
  consistence: number;
  bundleData: number[];
  bundleMetaData: MetadataVariableOption[][];
}
