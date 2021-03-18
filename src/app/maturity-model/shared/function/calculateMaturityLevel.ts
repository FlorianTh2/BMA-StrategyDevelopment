import { UserPartialModel } from "../../../graphql/generated/graphql";

export function calculateMaturityLevel(
  userPartialModels: UserPartialModel[]
): number {
  return userPartialModels
    .map((a) => {
      console.log(a.partialModel.weight);
      return this.isArray(a.userEvaluationMetrics)
        ? a.partialModel.weight *
            a.userEvaluationMetrics
              .map((b) => {
                return b.evaluationMetric.weight * b.valueEvaluationMetric;
              })
              .reduce((c, d) => c + d)
        : a.partialModel.weight *
            this.calculateMaturityLevel(a.subUserPartialModels);
    })
    .reduce((e, f) => e + f);
}
