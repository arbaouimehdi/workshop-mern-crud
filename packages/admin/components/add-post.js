import { useState } from "react";
import { Mutation } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
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
  const [published, setPublished] = useState(false);
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
      {(signup, { data, loading, error, usersList }) => (
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
            style={{ padding: "5px", width: "200px", marginBottom: "10px" }}
          />
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                name="answer"
                value="true"
                onChange={e => setPublished(e.target.value)}
                checked={
                  published == true || published == "true" ? true : false
                }
              />
              true
            </label>
            <label className="radio">
              <input
                type="radio"
                name="answer"
                value="false"
                onChange={e => setPublished(e.target.value)}
                checked={
                  published == false || published == "false" ? true : false
                }
              />
              false
            </label>
          </div>
          <br />
          <button
            style={{
              background: "#118420",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "3px",
              fontSize: "14px"
            }}
          >
            {loading ? "Loading" : "Add Post"}
          </button>
          <hr />
        </form>
      )}
    </Mutation>
  );
};

export default AddPost;
