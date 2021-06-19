import { Bundle } from "./bundle";

export class ClusterGroup {
  // Array
  //  clusterGroups:
  //    name
  //    options:
  //      name:
  //      usagePercent
  //    bundles: Bundles[]
  name: string;
  options: Record<string, number>;
  bundles: Bundle[];
}
