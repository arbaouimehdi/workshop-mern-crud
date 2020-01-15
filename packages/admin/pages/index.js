import { useQuery } from "@apollo/react-hooks";

//
import IsAuth from "../components/is-auth";
import SignOutButton from "../components/signout-button";

const NewHome = () => {
  return (
    <IsAuth>
      <h1>Admin Home Page</h1>
      <SignOutButton />
    </IsAuth>
  );
};

export default NewHome;
