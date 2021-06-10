import React from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "./utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { createUrqlClient } from "./utils/createUrqlClient";
import NavBarContainer from "../components/NavBarContainer";

interface loginProps {}

const Login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <NavBarContainer>
      <Wrapper variant="small">
      <Heading mb={4}>Log in</Heading>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login(values);
            if (response.data?.login.errors) {
              [{ field: "email", message: "Something wrong" }];
              setErrors(toErrorMap(response.data.login.errors));
            } else if (response.data?.login.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push("/");
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="email" placeholder="email" label="Email" />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>

              <Button
                mt={4}
                mx="auto"
                type="submit"
                isLoading={isSubmitting}
                colorScheme="blue"
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <Flex>
          <NextLink href="/forgot-password">Forgot password?</NextLink>
        </Flex>
      </Wrapper>
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
