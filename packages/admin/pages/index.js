import { useQuery } from "@apollo/react-hooks";
import Link from "next/link";

//
import IsAuth from "../components/is-auth";
import SignOutButton from "../components/signout-button";

const NewHome = () => {
  return (
    <IsAuth>
      <h1 style={{ margin: 0 }}>Admin Home Page</h1>
      <Link href="/posts">
        <a>Posts List</a>
      </Link>
      <br />
      <br />
      <SignOutButton />
    </IsAuth>
  );
};

export default NewHome;
