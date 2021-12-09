import { Formik } from "formik";
import React, { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import { useMeQuery, useRegisterMutation } from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import "./Register.scss";

type RegisterType = {
  email: string;
  username: string;
  password: string;
};

const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [register] = useRegisterMutation();
  const [error, setErrorMessage] = useState<string>("");
  const { data } = useMeQuery();
  const { darkMode } = useContext(ApplicationContext);
  const handleSubmit = async (formData: RegisterType) => {
    const response = await register({ variables: formData });
    if (response.data?.register.errors) {
      setErrorMessage(response.data?.register.errors[0].message);
    } else if (response.data?.register.user) {
      history.push("/");
      history.go(0);
    }
  };

  if (data?.me?.username) {
    history.push("/");
  }

  return (
    <div className={`${darkMode ? "register-dark" : "register"}`}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          email: "",
          username: "",
          password: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="contain">
            <>
              <h1>Register</h1>
              <h5>
                Already have an account?{" "}
                <Link to="/login" className="login">
                  Log in
                </Link>
              </h5>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isValid={touched.email && !errors.password}
                />
                <Form.Control.Feedback>
                  {error.length > 0 ? (
                    <p className="danger">{error}</p>
                  ) : (
                    <p> "Looks good"</p>
                  )}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isValid={touched.username && !errors.username}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isValid={touched.password && !errors.password}
                />
              </Form.Group>

              <Button type="submit" className="submit-button">
                Submit
              </Button>
            </>
            <Link to="/forgot-password" className="forgot">
              <br />
              Forgot password?
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
