<script>
  //import ApolloClient from "apollo-boost";
  import { setClient } from "svelte-apollo";
  import Todo from "./Todo.svelte";
  import { createUploadLink } from "apollo-upload-client";
  import { ApolloClient, InMemoryCache } from "@apollo/client";
  export let name;
  const apiUrl = "http://localhost:4000/graphql";
  const client = new ApolloClient({
    uri: `${apiUrl}`,
    cache: new InMemoryCache(),
    link: createUploadLink({ uri: `${apiUrl}` }),
    onError: ({ networkError, graphQLErrors }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) =>
          console.log(`Message: ${message}`)
        );
      if (networkError) console.log(`[Network Error]: ${networkError}`);
    },
  });
  setClient(client);
</script>

<div class="centrify">
  <h5>{name}!</h5>
  <Todo />
</div>

<style>
  h5 {
    color: grey;
  }

  .centrify {
    text-align: center;
  }
</style>
