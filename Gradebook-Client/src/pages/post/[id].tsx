import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { RiThumbDownLine, RiThumbUpLine } from "react-icons/ri";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import NavBarContainer from "../../components/NavBarContainer";
import { usePostQuery, useVoteMutation } from "../../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Post: React.FC = () => {
  const router = useRouter();
  const [, vote] = useVoteMutation();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [loadingState, setLoadingState] =
    useState<"upvote-loading" | "downvote-loading" | "not-loading">(
      "not-loading"
    );

  let postResult = null;

  if (fetching) postResult = "Loading....";

  if (error) postResult = error.message;

  if (!data?.post) {
    postResult = <Heading>Could not find post</Heading>;
  } else {
    postResult = (
      <>
        <Flex>
          <Button
            leftIcon={<ArrowBackIcon />}
            colorScheme="blue"
            variant="outline"
            mb={4}
            onClick={() => router.back()}
          >
            Back to the front page
          </Button>
        </Flex>
        <Box shadow="2xl" padding={5} borderRadius="5">
          <Flex flexDirection="row">
            <Heading mb={4}>{data.post.title}</Heading>
            <Flex direction="row" alignItems="center" ml="auto">
            <IconButton
              isLoading={loadingState === "upvote-loading"}
              colorScheme={data!.post.voteStatus === 1 ? "green" : undefined}
              aria-label="Upvote"
              icon={<RiThumbUpLine />}
              onClick={async () => {
                setLoadingState("upvote-loading");
                await vote({ postId: data!.post!.id, value: 1 });
                setLoadingState("not-loading");
              }}
            />

            <Text fontSize="18px" m={2}>
              {data.post.points}
            </Text>

            <IconButton
              isLoading={loadingState === "downvote-loading"}
              colorScheme={data!.post.voteStatus === -1 ? "red" : undefined}
              aria-label="Downvote"
              icon={<RiThumbDownLine />}
              onClick={async () => {
                setLoadingState("upvote-loading");
                await vote({ postId: data!.post!.id, value: -1 });
                setLoadingState("not-loading");
              }}
            />
          </Flex>
          </Flex>
          <Text>{data.post.text}</Text>
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
          
        </Box>
      </>
    );
  }

  return <NavBarContainer>{postResult}</NavBarContainer>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
