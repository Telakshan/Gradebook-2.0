import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "./utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import NavBarContainer from "../components/NavBarContainer";
import NextLink from "next/link";
import { Button } from "@chakra-ui/button";
import { Stack, Box, Heading, Text, Flex, Spinner } from "@chakra-ui/react";
import { ArrowForwardIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Wrapper from "../components/Wrapper";
import React, { useState } from "react";

const Index: React.FC = () => {
  const [variables, setVariables] = useState({
    limit: 10,
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

  console.log('hasMore', data?.posts.hasMore)


  return (
    <NavBarContainer>
      <Wrapper>
        <Flex p={2}>
          <Heading color="#90cdf4">Welcome to Gradebook</Heading>
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
              <Box key={d.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{d.title}</Heading>
                
                <Text mt={4}>{d.textSnippet}...</Text>
              </Box>
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
      ) : null}
    </NavBarContainer>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
