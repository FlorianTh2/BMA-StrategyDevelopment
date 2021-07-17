import * as seedrandom from "seedrandom";
import { ClusterAlgorithm } from "./clusterAlgorithm";
import { Distance } from "./distance.interface";
import { EuclideanDistance } from "./euclideanDistance";

export class Kmeans extends ClusterAlgorithm {
  // sum of euclidean distances of each data-point to its centroid-point
  public inertia: number;
  // number of needed iterations
  public iterations: number;
  // cordinates of centroids
  public centroids: number[][];

  constructor(
    numClusters: number,
    tolerance: number,
    distanceAlgorithm: Distance
  ) {
    super(numClusters, tolerance, distanceAlgorithm);
  }

  euclidean_inertia(
    vectors_of_all_centroids: number[][],
    data: number[][],
    labels: number[]
  ) {
    let totalDistance = 0;
    for (let a = 0; a < data.length; a++) {
      const localDistance = this.distanceAlgorithm.calcDistance(
        data[a],
        vectors_of_all_centroids[labels[a]]
      );
      totalDistance += localDistance;
    }
    return totalDistance;
  }

  get_mean(vectors: number[][]) {
    const dimensions = vectors[0].length;
    const vectorElements = vectors.length;
    const aggregateVector: number[] = Array(dimensions).fill(0);
    for (let a = 0; a < vectorElements; a++) {
      for (let b = 0; b < dimensions; b++) {
        aggregateVector[b] += vectors[a][b];
      }
    }
    return aggregateVector.map((a) => (1.0 * a) / vectorElements);
  }

  pairwise_euclidean_distances_argmin(data: number[][], centroids: number[][]) {
    const resultIndices = [];
    for (let a = 0; a < data.length; a++) {
      let currentMinDistance = this.distanceAlgorithm
        .calcDistance(data[a], centroids[0])
        .toFixed(this.tolerance);
      let currentMinDistanceIndex = 0;
      for (let b = 0; b < centroids.length; b++) {
        const distance = this.distanceAlgorithm
          .calcDistance(data[a], centroids[b])
          .toFixed(this.tolerance);
        if (distance < currentMinDistance) {
          currentMinDistance = distance;
          currentMinDistanceIndex = b;
        }
      }
      resultIndices.push(currentMinDistanceIndex);
    }
    return resultIndices;
  }

  find_clusters(data: number[][]): number[] {
    if (data.length < this.numClusters) {
      throw "you can not request more cluster than data-points you have.";
    }
    // in script: randomIndices === i
    const randomIndices = [];
    for (let a = 0; a < this.numClusters; a++) {
      randomIndices.push(
        Math.floor(this.getRandomArbitrary(0, data.length - 1, a))
      );
    }
    this.centroids = randomIndices.map((a) => data[a]);
    this.iterations = 0;
    this.labels = [];
    while (true) {
      this.labels = this.pairwise_euclidean_distances_argmin(
        data,
        this.centroids
      );
      let new_centroids: number[][] = [];
      for (let a = 0; a < this.numClusters; a++) {
        const a_center_datapoints_indices = this.labels.filter((b) => b === a);
        if (a_center_datapoints_indices.length == 0) {
          new_centroids.push(this.centroids[a]);
        } else {
          const a_center_datapoints = a_center_datapoints_indices.map(
            (b) => data[b]
          );
          const a_center = this.get_mean(a_center_datapoints);
          new_centroids.push(a_center);
        }
      }
      this.iterations += 1;
      this.inertia = this.euclidean_inertia(this.centroids, data, this.labels);
      if (this.arraysEqual(this.centroids, new_centroids)) {
        return this.labels;
      }
      this.centroids = new_centroids;
    }
  }

  // https://www.npmjs.com/package/seedrandom
  // get with same counter same result
  // returns with different counter different result
  getRandomArbitrary(min: number, max: number, counter: number) {
    const randomSeed = seedrandom(counter)();
    const result = randomSeed * (max - min) + min;
    return result;
  }

  arraysEqual(arr0: number[][], arr1: number[][]): boolean {
    for (let a = 0; a < arr0.length; ++a) {
      for (let b = 0; b < arr0[a].length; ++b) {
        if (
          arr0[a][b].toFixed(this.tolerance) !==
          arr1[a][b].toFixed(this.tolerance)
        )
          return false;
      }
    }
    return true;
  }
}
