import { IBundle } from "./bundle.interface";

export class Bundle implements IBundle {
  bundleSzenarioCombinationString: string;
  name: string;
  bundleData: Record<string, number>;

  constructor(
    bundleData: Record<string, number> = {},
    bundleSzenarioCombinationString: string = "",
    name: string = ""
  ) {
    this.bundleData = bundleData;
    this.bundleSzenarioCombinationString = bundleSzenarioCombinationString;
    this.name = name;
  }
}
