import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Box, Button, Heading } from "@chakra-ui/react";
import NavBarContainer from "../../../components/NavBarContainer";
import { Formik, Form } from "formik";
import InputField from "../../../components/InputField";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useGetIntId } from "../../utils/useGetIntId";
import { useRouter } from "next/router";

const EditPost: React.FC = () => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return (
      <NavBarContainer>
        <div>Loading....</div>
      </NavBarContainer>
    );
  }

  if (!data?.post) {
    return (
      <NavBarContainer>
        <Box>Could not find post...</Box>
      </NavBarContainer>
    );
  }

  return (
    <NavBarContainer variant="small">
      <Heading mb={4}>Update your post</Heading>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: intId, ...values });
          router.back();
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
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
