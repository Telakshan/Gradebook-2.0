import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "./utils/createUrqlClient";
import { useRouter } from "next/router";
import NavBarContainer from "../components/NavBarContainer";

const ForgotPassword: React.FC = () => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  const router = useRouter();

  return (
    <NavBarContainer>
      <Wrapper variant="small">
      <Heading mb={4}>Forgot password</Heading>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await forgotPassword(values);
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <Box>
                Check your email (Assuming that the email you provided exists)
                <Flex>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mt="3"
                    onClick={() => router.push("/")}
                  >
                    <ArrowBackIcon mr="1" />
                    Home
                  </Button>
                </Flex>
              </Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="email"
                  label="email"
                  type="email"
                />

                <Button
                  mt={4}
                  mx="auto"
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="blue"
                >
                  Send email
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
