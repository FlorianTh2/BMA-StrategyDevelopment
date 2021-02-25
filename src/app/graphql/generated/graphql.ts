import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};



export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects?: Maybe<Array<Project>>;
  projectOfUser?: Maybe<Project>;
  projectsOfUser?: Maybe<Array<Project>>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  profileOfUser: User;
  checkEmailAddress: Scalars['Boolean'];
  userMaturityModel?: Maybe<UserMaturityModel>;
  userMaturityModels?: Maybe<Array<UserMaturityModel>>;
  userMaturityModelOfUser?: Maybe<UserMaturityModel>;
  userMaturityModelsOfUser?: Maybe<Array<UserMaturityModel>>;
  userPartialModel?: Maybe<UserPartialModel>;
  userPartialModels?: Maybe<Array<UserPartialModel>>;
  userEvaluationMetric?: Maybe<UserEvaluationMetric>;
  userEvaluationMetrics?: Maybe<Array<UserEvaluationMetric>>;
  partialModel?: Maybe<PartialModel>;
  partialModels: Array<PartialModel>;
  evaluationMetric?: Maybe<EvaluationMetric>;
  evaluationMetrics: Array<EvaluationMetric>;
  maturityModel: MaturityModel;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryProjectOfUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryCheckEmailAddressArgs = {
  emailAddress?: Maybe<Scalars['String']>;
};


export type QueryUserMaturityModelArgs = {
  id: Scalars['ID'];
};


export type QueryUserMaturityModelOfUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserPartialModelArgs = {
  id: Scalars['ID'];
};


export type QueryUserEvaluationMetricArgs = {
  id: Scalars['ID'];
};


export type QueryPartialModelArgs = {
  id: Scalars['ID'];
};


export type QueryEvaluationMetricArgs = {
  id: Scalars['ID'];
};


export type QueryMaturityModelArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Scalars['String']>;
  register?: Maybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  userLoginRequest: UserLoginRequest;
};


export type MutationRegisterArgs = {
  userRegistrationRequest: UserRegistrationRequest;
};

export type UserLoginRequest = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserRegistrationRequest = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  email: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
  projects?: Maybe<Array<Project>>;
};

export type Project = {
  __typename?: 'Project';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  user: User;
  userMaturityModels: Array<UserMaturityModel>;
  created: Scalars['String'];
  updated: Scalars['String'];
};

export type UserMaturityModel = {
  __typename?: 'UserMaturityModel';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  maturityLevel?: Maybe<Scalars['Float']>;
  projects: Array<Project>;
  userPartialModels: Array<UserPartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type UserPartialModel = {
  __typename?: 'UserPartialModel';
  id: Scalars['ID'];
  maturityLevelEvaluationMetrics?: Maybe<Scalars['Float']>;
  userMaturityModel: UserMaturityModel;
  superUserPartialModel?: Maybe<UserPartialModel>;
  subUserPartialModels: Array<Maybe<UserPartialModel>>;
  userEvaluationMetrics: Array<UserEvaluationMetric>;
  partialModel: PartialModel;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type UserEvaluationMetric = {
  __typename?: 'UserEvaluationMetric';
  id: Scalars['ID'];
  valueEvaluationMetric: Scalars['Float'];
  userPartialModel: UserPartialModel;
  evaluationMetric: EvaluationMetric;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type PartialModel = {
  __typename?: 'PartialModel';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  evaluationMetrics: Array<EvaluationMetric>;
  subPartialModels?: Maybe<Array<PartialModel>>;
  superPartialModel?: Maybe<PartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type EvaluationMetric = {
  __typename?: 'EvaluationMetric';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Float']>;
  partialModel?: Maybe<PartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type MaturityModel = {
  __typename?: 'MaturityModel';
  id: Scalars['ID'];
  name: Scalars['String'];
  version: Scalars['Int'];
  partialModels: Array<PartialModel>;
  created: Scalars['String'];
  creator: Scalars['String'];
  updated: Scalars['String'];
  updater: Scalars['String'];
};

export type MaturityModelQueryVariables = Exact<{
  maturityModelId: Scalars['ID'];
}>;


export type MaturityModelQuery = (
  { __typename?: 'Query' }
  & { maturityModel: (
    { __typename?: 'MaturityModel' }
    & Pick<MaturityModel, 'name' | 'version'>
    & { partialModels: Array<(
      { __typename?: 'PartialModel' }
      & Pick<PartialModel, 'name' | 'weight'>
      & { subPartialModels?: Maybe<Array<(
        { __typename?: 'PartialModel' }
        & Pick<PartialModel, 'name' | 'weight'>
      )>> }
    )> }
  ) }
);

export type PartialModelQueryVariables = Exact<{
  partialModelId: Scalars['ID'];
}>;


export type PartialModelQuery = (
  { __typename?: 'Query' }
  & { partialModel?: Maybe<(
    { __typename?: 'PartialModel' }
    & Pick<PartialModel, 'name' | 'weight'>
  )> }
);

export type PartialModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type PartialModelsQuery = (
  { __typename?: 'Query' }
  & { partialModels: Array<(
    { __typename?: 'PartialModel' }
    & Pick<PartialModel, 'name' | 'weight'>
  )> }
);

export type ProjectOfUserQueryVariables = Exact<{
  projectOfUserId: Scalars['ID'];
}>;


export type ProjectOfUserQuery = (
  { __typename?: 'Query' }
  & { projectOfUser?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'name' | 'description' | 'created' | 'updated'>
  )> }
);

export type ProjectsOfUserQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsOfUserQuery = (
  { __typename?: 'Query' }
  & { projectsOfUser?: Maybe<Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'name' | 'description' | 'created' | 'updated'>
  )>> }
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'login'>
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'register'>
);

export type CheckEmailAddressQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type CheckEmailAddressQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'checkEmailAddress'>
);

export const MaturityModelDocument = gql`
    query MaturityModel($maturityModelId: ID!) {
  maturityModel(id: $maturityModelId) {
    name
    version
    partialModels {
      name
      weight
      subPartialModels {
        name
        weight
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MaturityModelGQL extends Apollo.Query<MaturityModelQuery, MaturityModelQueryVariables> {
    document = MaturityModelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PartialModelDocument = gql`
    query PartialModel($partialModelId: ID!) {
  partialModel(id: $partialModelId) {
    name
    weight
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PartialModelGQL extends Apollo.Query<PartialModelQuery, PartialModelQueryVariables> {
    document = PartialModelDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PartialModelsDocument = gql`
    query PartialModels {
  partialModels {
    name
    weight
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PartialModelsGQL extends Apollo.Query<PartialModelsQuery, PartialModelsQueryVariables> {
    document = PartialModelsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProjectOfUserDocument = gql`
    query ProjectOfUser($projectOfUserId: ID!) {
  projectOfUser(id: $projectOfUserId) {
    name
    description
    created
    updated
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProjectOfUserGQL extends Apollo.Query<ProjectOfUserQuery, ProjectOfUserQueryVariables> {
    document = ProjectOfUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ProjectsOfUserDocument = gql`
    query ProjectsOfUser {
  projectsOfUser {
    name
    description
    created
    updated
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ProjectsOfUserGQL extends Apollo.Query<ProjectsOfUserQuery, ProjectsOfUserQueryVariables> {
    document = ProjectsOfUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(userLoginRequest: {email: $email, password: $password})
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstname: String!, $lastname: String!) {
  register(
    userRegistrationRequest: {email: $email, password: $password, firstname: $firstname, lastname: $lastname}
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterGQL extends Apollo.Mutation<RegisterMutation, RegisterMutationVariables> {
    document = RegisterDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CheckEmailAddressDocument = gql`
    query CheckEmailAddress($email: String!) {
  checkEmailAddress(emailAddress: $email)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CheckEmailAddressGQL extends Apollo.Query<CheckEmailAddressQuery, CheckEmailAddressQueryVariables> {
    document = CheckEmailAddressDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }