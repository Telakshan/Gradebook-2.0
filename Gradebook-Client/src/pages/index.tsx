import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "./utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import NavBarContainer from "../components/NavBarContainer";
import NextLink from "next/link";
import { Button } from "@chakra-ui/button";
import {
  Stack,
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import {
  ArrowForwardIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import Wrapper from "../components/Wrapper";
import React, { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import Upvote from "../components/Upvote";

const Index: React.FC = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <NavBarContainer>
        <Heading>No posts have been created. May be create one?</Heading>
        <NextLink href="create-post">
          <Button
            mt={4}
            rightIcon={<ArrowForwardIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Create Post
          </Button>
        </NextLink>
      </NavBarContainer>
    );
  }

  return (
    <NavBarContainer>
      <Wrapper>
        <Flex p={2}>
          <Heading color="#90cdf4" className="welcome">Welcome to Gradebook</Heading>
          <NextLink href="create-post">
            <Button
              ml="auto"
              mb={4}
              rightIcon={<ArrowForwardIcon />}
              colorScheme="blue"
              variant="outline"
            >
              Create Post
            </Button>
          </NextLink>
        </Flex>
        {fetching && !data ? (
          <Spinner />
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((d) => (
              <Flex key={d.id} p={5} shadow="md" borderWidth="1px">
                <Upvote post={d}/>
                <Box>
                  <Heading fontSize="xl">{d.title}</Heading>
                  <Heading fontSize="xs" mt={3}>
                    Posted by {d.creator.username}
                  </Heading>
                  <Text mt={4}>{d.textSnippet}...</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      </Wrapper>
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            isLoading={fetching}
            m="auto"
            my={8}
            variant="outline"
            colorScheme="blue"
            leftIcon={<ChevronDownIcon />}
            onClick={() =>
              setVariables({
                limit: variables?.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
          >
            Load more
          </Button>
        </Flex>
      ) : (
        <Heading fontSize="s" mb={10} mt={10}>
          End of list
        </Heading>
      )}
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
