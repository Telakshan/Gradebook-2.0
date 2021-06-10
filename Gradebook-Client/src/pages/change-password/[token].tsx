import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.changePassword.errors) {
            [{ field: "email", message: "Something wrong" }];
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {tokenError ? (
              <Alert status="error">
                <AlertIcon />
                {tokenError}, You took too long to change the password. Please
                try again
              </Alert>
            ) : null}
            <InputField
              name="newPassword"
              placeholder="New Password"
              label="New Password"
              type="password"
            />

            <Button
              mt={4}
              mx="auto"
              type="submit"
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
      {tokenError ? (
        <NextLink href="/forgot-password">
          Click here to send email again
        </NextLink>
      ) : null}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
