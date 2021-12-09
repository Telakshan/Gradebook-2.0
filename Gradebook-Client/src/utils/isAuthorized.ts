import { useMeQuery } from "../generated/graphql";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const IsAuthorized = () => {
  const { data, loading } = useMeQuery();
  const history = useHistory();

  useEffect(() => {
    if (!data?.me?.username) {
      history.push("/login");
    }
  }, [loading, data, history]);
};
