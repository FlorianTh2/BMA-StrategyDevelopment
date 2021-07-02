export interface ClusterResult {
  numberClusters: number;
  neededIterations: number;
  centroids: number[][];
  labels: number[];
  inertia: number;
}
