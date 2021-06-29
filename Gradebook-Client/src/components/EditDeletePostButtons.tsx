import React from "react";
import { Box, IconButton, Link } from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtons {
  id: number;
  creatorId: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtons> = ({
  id,
  creatorId,
}) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data: loggedIn }] = useMeQuery();

  if (loggedIn?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          ml="auto"
          icon={<AiOutlineEdit />}
          aria-label="Edit"
        />
      </NextLink>

      <IconButton
        ml="auto"
        icon={<HiOutlineTrash />}
        aria-label="Delete"
        onClick={() => deletePost({ id })}
      />
    </Box>
  );
};

export default EditDeletePostButtons;
