import { useState } from "react";
import { Mutation } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Router from "next/router";

const ALL_USERS = gql`
  query ALL_USERS {
    users {
      id
      email
    }
  }
`;

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
  // Queries
  const { loading, error, data: usersList } = useQuery(ALL_USERS);

  // States
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(false);
  const [userId, setUserId] = useState("");

  if (error) console.log(error.message);
  if (loading) return <p>Loading</p>;

  return (
    <Mutation
      mutation={ADD_POST}
      onError={error => {
        console.log(error);
      }}
      refetchQueries={[{ query: ALL_POSTS }]}
      onCompleted={() => {}}
    >
      {(addPost, { data, loading, error }) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            e.stopPropagation();
            addPost({
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
                value={"true"}
                onChange={e => setPublished(JSON.parse(e.target.value))}
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
                value={"false"}
                onChange={e => setPublished(JSON.parse(e.target.value))}
                checked={
                  published == false || published == "false" ? true : false
                }
              />
              false
            </label>
          </div>
          <br />
          <div>
            <select name="userID" onChange={e => setUserId(e.target.value)}>
              <option defaultValue="">select a user</option>
              {usersList.users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
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
