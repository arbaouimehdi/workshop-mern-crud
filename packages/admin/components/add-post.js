import { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

// Queries
import ME from "../queries/me";

const ALL_POSTS = gql`
  query ALL_POSTS {
    posts {
      id
      title
    }
  }
`;

const ADD_POST = gql`
  mutation ADD_POST($title: String!, $published: Boolean!, $userId: ID!) {
    addPost(title: $title, published: $published, userId: $userId) {
      id
    }
  }
`;

const AddPost = () => {
  const [title, setTitle] = useState("Oh my Gosh!");
  const [published, setPublished] = useState(true);
  const [userId, setUserId] = useState("5e1c8f5ebe07770007b58496");
  return (
    <Mutation
      mutation={ADD_POST}
      onError={error => {
        console.log(error);
      }}
      refetchQueries={[{ query: ALL_POSTS }]}
      onCompleted={() => {}}
    >
      {(signup, { data, loading, error }) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            signup({
              variables: {
                title,
                published,
                userId
              }
            });
          }}
        >
          {error && <p>{error.message}</p>}
          <input
            name="title"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <br />
          <input
            name="published"
            placeholder="true"
            value={published}
            onChange={e => setPublished(e.target.value)}
          />
          <br />
          <input
            name="userId"
            placeholder="User ID"
            value={userId}
            onChange={e => setEmail(e.target.value)}
          />
          <br />
          <button>{loading ? "Loading" : "Add Post"}</button>
        </form>
      )}
    </Mutation>
  );
};

export default AddPost;
