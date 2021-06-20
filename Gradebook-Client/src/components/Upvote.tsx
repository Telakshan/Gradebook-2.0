import { Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";
import { RiThumbUpLine, RiThumbDownLine } from "react-icons/ri";

interface UpvoteProps {
  post: PostSnippetFragment;
}

const Upvote: React.FC<UpvoteProps> = ({ post }) => {
  const [loadingState, setLoadingState] =
    useState<"upvote-loading" | "downvote-loading" | "not-loading">(
      "not-loading"
    );

  const [, vote] = useVoteMutation();

  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        //isDisabled={post.voteStatus === 1 ? true : false}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState("upvote-loading");
          await vote({ postId: post.id, value: 1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "upvote-loading"}
        aria-label="Upvote"
        fontSize="24px"
        icon={<RiThumbUpLine />}
      />

      <Text fontSize="18px">{post.points}</Text>

      <IconButton
        //isDisabled={post.voteStatus === -1 ? true : false}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState("downvote-loading");
          await vote({ postId: post.id, value: -1 });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downvote-loading"}
        aria-label="Downvote"
        fontSize="24px"
        icon={<RiThumbDownLine />}
      />
    </Flex>
  );
};

export default Upvote;
