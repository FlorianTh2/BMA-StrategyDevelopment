import { IBundleUsageMatrix } from "./IBundleUsageMatrix.interface";
import { Cluster } from "./cluster";

export class BundleUsageMatrix implements IBundleUsageMatrix {
  cluster: Cluster[];
}
