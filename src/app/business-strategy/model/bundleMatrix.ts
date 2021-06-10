import { IBundleMatrix } from "./bundleMatrix.interface";
import { IBundle } from "./bundle.interface";

export class BundleMatrix implements IBundleMatrix {
  bundles: Array<IBundle>;

  constructor(bundles: Array<IBundle>) {
    this.bundles = bundles;
  }
}
