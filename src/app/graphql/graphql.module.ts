import { NgModule } from "@angular/core";
import { APOLLO_OPTIONS } from "apollo-angular";
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache
} from "@apollo/client/core";
import { HttpLink } from "apollo-angular/http";
import { HttpHeaders } from "@angular/common/http";

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const middlewareAsLinkChain = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer ${localStorage.getItem("token") || null}`
      )
    });
    return forward(operation);
  });

  const http = httpLink.create({
    uri: "https://bma-strategydevelopmentbackend.herokuapp.com/"
  });
  // const http = httpLink.create({ uri: "http://localhost:4000/graphql" });
  const link = middlewareAsLinkChain.concat(http);

  const apolloConfig = {
    link: link,
    cache: new InMemoryCache()
  };
  return apolloConfig;
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
