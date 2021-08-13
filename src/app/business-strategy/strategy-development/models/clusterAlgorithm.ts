import { Distance } from "./distances/distance.interface";

export abstract class ClusterAlgorithm {
  // labels of each point (for each point: the index of its centroid-point)
  public labels: number[];
  // number of cluster this algorithm should take into consideration
  public numClusters: number;
  // tolerance indicates the "round" factor which is applied at pairwise_euclidean_distances_argmin
  // (and not directly on euclidean distance) to only affect the actual kmeans-algorithm
  // to not be affacted by changes which are very small
  // suggested: 1e-2 (2 decimal digits)
  public tolerance: number;
  public distanceAlgorithm: Distance;

  constructor(
    numClusters: number,
    tolerance: number,
    distanceAlgorithm: Distance
  ) {
    this.numClusters = numClusters;
    this.tolerance = tolerance;
    this.distanceAlgorithm = distanceAlgorithm;
  }

  abstract find_clusters(data: number[][]): number[];
}
