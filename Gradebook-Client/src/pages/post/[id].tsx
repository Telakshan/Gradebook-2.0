import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import NavBarContainer from "../../components/NavBarContainer";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface PostProps {}

const Post: React.FC = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  let postResult = null;

  if (fetching) postResult = "Loading....";

  if (error) postResult = error.message;

  if (!data?.post) {
    postResult = <Heading>Could not find post</Heading>;
  } else {
    postResult = (
      <>
        <Box>
          <Heading mb={4}>{data.post.title}</Heading>
          <Text>{data.post.text}</Text>
        </Box>
      </>
    );
  }

  return <NavBarContainer>{postResult}</NavBarContainer>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
