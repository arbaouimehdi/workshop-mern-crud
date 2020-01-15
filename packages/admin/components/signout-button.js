import { useQuery, useMutation } from "@apollo/react-hooks";
import Router from "next/router";

// Queries & Mutations
import ME from "../queries/me";
import SIGN_IN from "../mutations/sign_in";
import SIGN_OUT from "../mutations/sign_out";

const SignOutButton = () => {
  const [logout, { data, error, loading }] = useMutation(SIGN_OUT, {
    onCompleted() {
      console.log("signed you OUT!!");
      Router.reload();
    }
  });

  const {
    loading: queryloading,
    error: queryerror,
    data: querydata
  } = useQuery(ME);

  if (querydata === undefined || querydata.me === undefined) {
    return <p>you aren't signed in</p>;
  }

  // Show logout button is the used is already logged in
  else {
    return (
      <button
        onClick={() => {
          logout();
        }}
      >
        Sign Out
      </button>
    );
  }
};

export default SignOutButton;
