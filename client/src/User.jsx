import { useLoaderData } from "react-router-dom";

const User = () => {
  const { data } = useLoaderData();
  return <div>User {data.username}</div>;
};

export default User;
