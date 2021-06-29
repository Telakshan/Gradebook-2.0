import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { useEffect } from "react";
import InputField from "../components/InputField";
import { useRouter } from "next/router";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "./utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NavBarContainer from "../components/NavBarContainer";
import { isAuthorized } from "./utils/isAuthorized";

const CreatePost: React.FC<{}> = () => {
  isAuthorized();

  const router = useRouter();
  const [, createPost] = useCreatePostMutation();

  return (
    <NavBarContainer variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              textarea={false}
              name="title"
              placeholder="Add your title here..."
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea={true}
                name="text"
                placeholder="Add your text here..."
                label="Text"
                type="textarea"
              />
            </Box>

            <Button
              mt={4}
              mx="auto"
              type="submit"
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              Add Post
            </Button>
          </Form>
        )}
      </Formik>
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
