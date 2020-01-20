import { useState } from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const ALL_USERS = gql`
  query ALL_USERS {
    users {
      id
      email
    }
  }
`;

const POST = gql`
  query POST($postId: ID!) {
    post(postId: $postId) {
      id
      title
      published
      author {
        id
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UPDATE_POST(
    $postId: ID!
    $title: String!
    $published: Boolean!
    $userId: ID!
  ) {
    updatePost(
      postId: $postId
      title: $title
      published: $published
      userId: $userId
    ) {
      id
    }
  }
`;

const Post = ({ router }) => {
  const {
    query: { slug: currentPostID }
  } = router;

  // Queries
  const { data: usersList } = useQuery(ALL_USERS);
  const { error, loading, data: currentPost } = useQuery(POST, {
    variables: { postId: currentPostID }
  });

  if (error) console.log(error.message);
  if (loading) return <p>Loading</p>;

  return (
    <div>
      <Mutation
        mutation={UPDATE_POST}
        refetchQueries={[{ query: POST, variables: { postId: currentPostID } }]}
        onError={error => console.log(error)}
      >
        {(updatePost, { data, loading, error }) => {
          // States
          const [title, setTitle] = useState(currentPost.post.title);
          const [published, setPublished] = useState(
            currentPost.post.published
          );
          const [userId, setUserId] = useState(currentPost.post.author.id);
          const [postId, setPostId] = useState(currentPost.post.id);

          return (
            <div>
              <h1>{title}</h1>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  updatePost({
                    variables: {
                      postId,
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
                  style={{
                    padding: "5px",
                    width: "200px",
                    marginBottom: "10px"
                  }}
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
                        published == false || published == "false"
                          ? true
                          : false
                      }
                    />
                    false
                  </label>
                </div>
                <br />
                <div>
                  <select
                    name="userID"
                    onChange={e => setUserId(e.target.value)}
                    defaultValue={userId}
                  >
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
                  {loading ? "Loading" : "Update Post"}
                </button>
                <hr />
              </form>
            </div>
          );
        }}
      </Mutation>
    </div>
  );
};

export default withRouter(Post);
