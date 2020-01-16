import { useQuery, useMutation } from "@apollo/react-hooks";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

// Libraries
import AddPost from "../components/add-post";
import IsAuth from "../components/is-auth";

const ALL_POSTS = gql`
  query ALL_POSTS {
    posts {
      id
      title
    }
  }
`;

const DELETE_POST = gql`
  mutation DELETE_POST($postId: ID!) {
    removePost(postId: $postId) {
      id
    }
  }
`;

const PostsList = () => {
  const { error, loading, data } = useQuery(ALL_POSTS);
  const [removePost, { post }] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: ALL_POSTS }]
  });

  if (error) console.log(error.message);
  if (loading) return <p>Loading</p>;

  return (
    <IsAuth>
      <h1>Add a New Post</h1>
      <AddPost />
      <h2>Posts List</h2>
      {data.posts.map(post => {
        return (
          <ul key={post.id}>
            <li>
              <b>Title: </b>
              {post.title}
              <button
                onClick={() => {
                  removePost({ variables: { postId: post.id } });
                }}
              >
                remove
              </button>
            </li>
          </ul>
        );
      })}
    </IsAuth>
  );
};

export default PostsList;
