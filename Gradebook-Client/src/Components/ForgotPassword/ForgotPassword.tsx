import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

type Email = {
    email: string
};

const ForgotPassword: React.FC = () => {
   const [error,] = useState<string>("");
  // const [, changePassword] = useChangePasswordMutation();
  // const [tokenError, setErrorToken] = useState("");
  const handleSubmit = async (formData: Email) => {

  };

  return (
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
            <h1>Forgot Password?</h1>
            <h5>
              No Worries! Enter Your Account Email
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
            <Button type="submit" className="submit-button">
              Submit
            </Button>
          </>
          <Link to="/login">
            <br />
            Or Do you want to log in?
          </Link>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPassword;

