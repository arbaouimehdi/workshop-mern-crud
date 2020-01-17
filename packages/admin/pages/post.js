import { withRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Link from "next/link";

const POST = gql`
  query POST($postId: ID!) {
    post(postId: $postId) {
      id
      title
    }
  }
`;

const Post = ({ router }) => {
  const {
    query: { slug: currentPostID }
  } = router;

  const { error, loading, data } = useQuery(POST, {
    variables: { postId: currentPostID }
  });

  if (error) console.log(error.message);
  if (loading) return <p>Loading</p>;

  return (
    <div>
      <Link href="/posts">
        <a>Posts List</a>
      </Link>
      <h1>{data.post.title}</h1>
    </div>
  );
};

export default withRouter(Post);
