import { Formik } from "formik";
import React, { useState, useContext } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link, RouteComponentProps } from "react-router-dom";
import { useLoginMutation } from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import { IsAuthorized } from "../../utils/isAuthorized";
import "./Login.scss";

type EmailAndPassword = {
  email: string;
  password: string;
};

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  IsAuthorized();

  const [login, { loading }] = useLoginMutation();
  const [error, setErrorMessage] = useState<string>("");
  const { darkMode } = useContext(ApplicationContext);
  const handleSubmit = async (formData: EmailAndPassword) => {
    const response = await login({ variables: formData });
    if (response.data?.login.user != null) {
      history.push("/");
      history.go(0);
    } else if (response.data?.login.errors) {
      setErrorMessage(response.data?.login.errors[0].message);
      console.log("errors: " + JSON.stringify(response.data?.login.errors[0]));
    }
  };

  return (
    <div className={`${darkMode ? "login-container-dark" : "login-container"}`}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{
          email: "",
          password: "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="login">
            <>
              <h1>Log in</h1>
              <h5>
                Don't have an account?{" "}
                <Link to="/register" className="register">
                  Register
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
                {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
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

export default Login;
