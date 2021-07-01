import * as seedrandom from "seedrandom";

export class Kmeans {
  // labels of each point (for each point: the index of its centroid-point)
  labels: number[];
  // sum of euclidean distances of each data-point to its centroid-point
  inertia: number;
  // number of needed iterations
  iterations: number;
  // cordinates of centroids
  centroids: number[][];
  // number of cluster this algorithm should take into consideration
  numClusters: number;
  // randomState to get same results with same input
  randomState: number;
  // tolerance indicates the "round" factor which is applied at pairwise_euclidean_distances_argmin
  // (and not directly on euclidean distance) to only affect the actual kmeans-algorithm
  // to not be affacted by changes which are very small
  // suggested: 1e-2 (2 decimal digits)
  tolerance: number;

  constructor(numClusters: number, randomState: number, tolerance: number) {
    this.numClusters = numClusters;
    this.randomState = randomState;
    this.tolerance = tolerance;
  }

  euclidean_inertia(
    vectors_of_all_centroids: number[][],
    data: number[][],
    labels: number[]
  ) {
    let totalDistance = 0;
    for (let a = 0; a < data.length; a++) {
      const localDistance = this.euclidean_distance(
        data[a],
        vectors_of_all_centroids[labels[a]]
      );
      totalDistance += localDistance;
    }
    return totalDistance;
  }

  euclidean_distance(vector0: number[], vector1: number[]) {
    let total = 0;
    let diff = 0;
    for (let a = 0; a < vector0.length; a++) {
      diff = vector0[a] - vector1[a];
      total += diff * diff;
    }
    return Math.sqrt(total);
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
      let currentMinDistance = this.euclidean_distance(
        data[a],
        centroids[0]
      ).toFixed(this.tolerance);
      let currentMinDistanceIndex = 0;
      for (let b = 0; b < centroids.length; b++) {
        const distance = this.euclidean_distance(data[a], centroids[b]).toFixed(
          this.tolerance
        );
        if (distance < currentMinDistance) {
          currentMinDistance = distance;
          currentMinDistanceIndex = b;
        }
      }
      resultIndices.push(currentMinDistanceIndex);
    }
    return resultIndices;
  }

  find_clusters(data: number[][]) {
    // in script: i
    const randomIndices = [];
    for (let a = 0; a < this.numClusters; a++) {
      randomIndices.push(this.getRandomArbitrary(0, data.length));
    }
    this.centroids = randomIndices.map((a) => data[a]);
    this.iterations = 0;
    this.labels = [];
    while (true) {
      this.labels = this.pairwise_euclidean_distances_argmin(
        data,
        this.centroids
      );
      let new_centroids = [];
      for (let a = 0; a < this.numClusters; a++) {
        const a_center_datapoints_indeces = this.labels.filter((b) => b === a);
        const a_center_datapoints = a_center_datapoints_indeces.map(
          (b) => data[b]
        );
        const a_center = this.get_mean(a_center_datapoints);
        new_centroids.push(a_center);
      }
      if (this.arraysEqual(this.centroids, new_centroids)) {
        break;
      }
      this.centroids = new_centroids;
      this.inertia = this.euclidean_inertia(this.centroids, data, this.labels);
      this.iterations += 1;
    }
  }

  // https://www.npmjs.com/package/seedrandom
  getRandomArbitrary(min, max) {
    return seedrandom(this.randomState) * (max - min) + min;
  }

  arraysEqual(arr0, arr1) {
    for (let a = 0; a < arr0.length; ++a) {
      if (arr0[a] !== arr1[a]) return false;
    }
    return true;
  }
}
