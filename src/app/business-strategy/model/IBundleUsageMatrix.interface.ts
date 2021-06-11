import { Cluster } from "./cluster";

export interface IBundleUsageMatrix {
  // Array
  //  cluster:
  //    name
  //    options:
  //      name:
  //      usagePercent
  //    bundles: Bundles[]
  cluster: Cluster[];
}
