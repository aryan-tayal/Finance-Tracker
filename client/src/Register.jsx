import { Form } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <input type="text" name="username" placeholder="username" />
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">New User</button>
      </Form>
    </div>
  );
};

export default Register;
