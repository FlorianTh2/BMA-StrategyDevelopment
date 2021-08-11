// @ts-ignore
const lMath = require("mathjs");

const config = {
  epsilon: 1e-3, // default: 1e-12
  matrix: "Matrix",
  number: "number",
  precision: 64,
  predictable: false,
  randomSeed: null
};

const math = lMath.create(lMath.all, config);

// Laufzeit
// 1k 4min
// 4k 15min+
// node .\index.js
// step_0: 11.421ms
// step_1: 111.067ms
// step_2: 558.417ms
// step_3: 10.240s
// step_4: 1.078ms
//
// sources:
//  https://mathepedia.de/Eigenwerte.html
//  https://mathepedia.de/Charakteristisches_Polynom.html
//  https://de.wikipedia.org/wiki/Multidimensionale_Skalierung
//  https://www.statistik-nachhilfe.de/ratgeber/statistik/induktive-statistik/statistische-modellbildung-und-weitere-methoden/multidimensionale-skalierung
//  http://www.benfrederickson.com/multidimensional-scaling/
//  https://en.wikipedia.org/wiki/List_of_numerical_analysis_topics#Eigenvalue_algorithms
//  https://de.wikipedia.org/wiki/Regel_von_Sarrus
//  https://de.wikipedia.org/wiki/Determinante#Laplacescher_Entwicklungssatz
//  https://matrixcalc.org/de/vectors.html
export class MultidimensionalScaling {
  constructor() {
    console.log("Created mds instance");
  }

  elementwise_multiplication_with_factor(matrix: number[][], factor: number) {
    return matrix.map((a) => a.map((b) => b * factor));
  }

  change_negativ_element_to_zero(matrix: number[][]) {
    return matrix.map((a) =>
      a.map((b) => {
        return b < 0 ? 0 : b;
      })
    );
  }

  // examploe: https://www.dabblingbadger.com/blog/2020/2/27/implementing-euclidean-distance-matrix-calculations-from-scratch-in-python
  // another example: https://blog.paperspace.com/dimension-reduction-with-multi-dimension-scaling/
  // example:
  //  data = [[100, 0, 100, 0, 50, 50],[100, 0, 0, 100, 100, 0],[0, 100, 100, 0, 100, 0]]
  //  var result = calc_distancematrix(data,data,false)
  calc_distanceMatrix(
    matrix0: number[][],
    matrix1: number[][],
    squared: boolean
  ): number[][] {
    const M = matrix0.length;
    const N = matrix1.length;

    const a_dots_operation0 = math.square(matrix0);
    const a_dots_operation1 = math.apply(a_dots_operation0, 1, math.sum);
    const a_dots_operation2 = math.reshape(a_dots_operation1, [M, 1]);
    // pay attention: here: dot, in python *, but * in python yields other results than dot
    // this is especially true in b_dots_operationX
    // here, at this operation python * is same as dot
    const a_dots_operation3 = math.multiply(a_dots_operation2, math.ones(1, N));
    const A_dots = a_dots_operation3;

    const b_dots_operation0 = math.square(matrix1);
    const b_dots_operation1 = math.apply(a_dots_operation0, 1, math.sum);
    // pay attention: this reshape operation is not included in original script
    // reason: python * is not the same as dot, so to get this dot same result as with * in python we have to include this reshape
    // pay attention2: N and M are in the right order according to the script (actually since reshape is not included [N,1]) was chosen (instead of [M,1]) to the best of knowledge and belief
    // python
    //  from (data_true*data_true).sum(axis=1)*np.ones(shape=(M,1))
    //  to (data_true*data_true).sum(axis=1).reshape((N,1)).dot(np.ones(shape=(1,M))).T
    const b_dots_operation2 = math.reshape(b_dots_operation1, [N, 1]);
    const b_dots_operation3 = math.transpose(
      math.multiply(b_dots_operation2, math.ones(1, M))
    );
    const B_dots = b_dots_operation3;

    const D_squared_add = math.add(A_dots, B_dots);
    const D_squared_dot = math.multiply(matrix0, math.transpose(matrix1));
    const D_squared_subtraction = this.elementwise_multiplication_with_factor(
      D_squared_dot,
      -2
    );
    const D_squared = math.add(D_squared_add._data, D_squared_subtraction);

    if (squared == false) {
      const min_zero_matrix = this.change_negativ_element_to_zero(D_squared);
      return math.sqrt(min_zero_matrix);
    }
    return D_squared;
  }

  // CLASSICAL MDS
  //
  // this is the implementation for the CLASSICAL MDS (NOT THE METRIC OR NON-METRIC MDS)
  //
  // theorie important sources
  //  https://ncss-wpengine.netdna-ssl.com/wp-content/themes/ncss/pdf/Procedures/NCSS/Multidimensional_Scaling.pdf
  //  algorithm in pseudo text code form
  //  https://medium.datadriveninvestor.com/the-multidimensional-scaling-mds-algorithm-for-dimensionality-reduction-9211f7fa5345
  //  http://statweb.stanford.edu/~jtaylo/courses/stats202/mds.html
  //  https://de.wikipedia.org/wiki/Multidimensionale_Skalierung
  //  https://www.programmersought.com/article/72564905909/
  //  http://www.nervouscomputer.com/hfs/cmdscale-in-python/
  //  https://www.benfrederickson.com/multidimensional-scaling/
  //  https://mathepedia.de/Eigenwerte.html
  //  https://mathepedia.de/Charakteristisches_Polynom.html
  //  https://de.wikipedia.org/wiki/Multidimensionale_Skalierung
  //  https://www.statistik-nachhilfe.de/ratgeber/statistik/induktive-statistik/statistische-modellbildung-und-weitere-methoden/multidimensionale-skalierung
  //  http://www.benfrederickson.com/multidimensional-scaling/
  //  https://en.wikipedia.org/wiki/List_of_numerical_analysis_topics#Eigenvalue_algorithms
  //  https://de.wikipedia.org/wiki/Regel_von_Sarrus
  //  https://de.wikipedia.org/wiki/Determinante#Laplacescher_Entwicklungssatz
  //  https://matrixcalc.org/de/vectors.html
  //
  // explicit algorithm / implementation sources
  //  (pay attention: the english site and NOT the german one (it does not cover the classical mds))
  //  in python: the whole function with comments and the matrices at the end
  //  https://en.wikipedia.org/wiki/Multidimensional_scaling
  //  https://github.com/GeostatsGuy/PythonNumericalDemos/blob/master/SubsurfaceDataAnalytics_Multidimensional_Scaling.ipynb
  //  https://www.stat.pitt.edu/sungkyu/course/2221Fall13/lec8_mds_combined.pdf
  calc_mds(distances: number[][]): number[][] {
    // const distances = [
    //   [0, 548, 289, 576, 586],
    //   [548, 0, 493, 195, 392],
    //   [289, 493, 0, 427, 776],
    //   [576, 195, 427, 0, 577],
    //   [586, 392, 776, 577, 0]
    // ];

    console.log("\n\n" + "STEP 0");
    console.time("step_0");
    const dimensions = 2;
    const data_true = math.matrix(distances);
    console.timeEnd("step_0");

    console.log("\n\n" + "STEP 1");
    console.time("step_1");
    const A = math.multiply(-0.5, math.square(data_true));
    console.timeEnd("step_1");

    console.log("\n\n" + "STEP 2");
    console.time("step_2");
    const means_each_row = math.mean(A, 1);
    const means_each_column = math.mean(A, 0);
    const total_mean = math.mean(means_each_row);

    let B = math.matrix(A);
    for (let a = 0; a < B.size()[0]; a++) {
      for (let b = 0; b < B.size()[1]; b++) {
        const valueToSet =
          B.get([a, b]) +
          total_mean -
          means_each_row.get([a]) -
          means_each_column.get([b]);
        B.subset(math.index(a, b), valueToSet);
      }
    }
    console.timeEnd("step_2");

    console.log("\n\n" + "STEP 3");
    console.time("step_3");
    // console.log("B ", B)
    const eigen = math.eigs(B);

    // both are math.js related objects (densematrix)
    const eigenValuesRaw = eigen.values;
    // absolute since maybe negative
    const eigenValuesAbs = math.abs(eigenValuesRaw);
    // transpose since the sorting that is later applied
    // normally: input [[1,2,3],[4,5,6]] -> e.g. [[4,5,6], [1,2,3]]
    // but actually we want: [[1,2,3],[4,5,6]] -> e.g. [[2,3,1], [6,5,4]]
    // so we want the sorting on axis=1 and not axis=0
    // after sorting -> we transpose back
    const eigenVectors = math.transpose(eigen.vectors);

    // get eigenvectors of biggest eigenvalues
    const mix = [];
    for (let a = 0; a < eigenValuesAbs.size()[0]; a++) {
      mix.push({
        eigenvalue: eigenValuesAbs.get([a]),
        eigenvector: eigenVectors._data[a]
      });
    }
    mix.sort(function (a, b) {
      return b.eigenvalue - a.eigenvalue;
    });

    const eigenValuesSorted = [];
    let eigenVectorsSorted = [];
    mix.forEach((a) => {
      eigenValuesSorted.push(a["eigenvalue"]);
      eigenVectorsSorted.push(a["eigenvector"]);
    });
    // after sorting: transpose back
    eigenVectorsSorted = math.transpose(eigenVectorsSorted);
    console.timeEnd("step_3");

    console.log("\n\n" + "STEP 4");
    console.time("step_4");
    const eigenValuesSqrt = math.sqrt(eigenValuesSorted);
    const eigenValuesDiag = math.diag(eigenValuesSqrt);
    const multiplyResult = math.multiply(eigenVectorsSorted, eigenValuesDiag);
    // result is more or less equal to the python result mirrored on y-axis
    //resultTrimedToDesiredDimensions
    const resultMatrix = multiplyResult.map((a) => a.splice(0, dimensions));
    console.timeEnd("step_4");
    return resultMatrix;
  }
}
