import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpvoteProps {
  post: PostSnippetFragment;
}

const Upvote: React.FC<UpvoteProps> = ({ post }) => {
  const [loadingState, setLoadingState] =
    useState<"upvote-loading" | "downvote-loading" | "not-loading">(
      "not-loading"
    );

  const [, vote] = useVoteMutation();

  console.log(post.points);

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState("upvote-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upvote-loading"}
        aria-label="Upvote"
        fontSize="24px"
        icon={<ChevronUpIcon />}
      />

      <Text fontSize="18px">{post.points}</Text>

      <IconButton
        onClick={async () => {
          setLoadingState("downvote-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downvote-loading"}
        aria-label="Downvote"
        fontSize="24px"
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

export default Upvote;
