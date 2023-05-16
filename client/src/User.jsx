import { useLoaderData, Form } from "react-router-dom";

const User = () => {
  const { data } = useLoaderData();
  return (
    <div>
      User {data.username}
      <Form method="delete">
        <button>Delete User</button>
      </Form>
    </div>
  );
};

export default User;
