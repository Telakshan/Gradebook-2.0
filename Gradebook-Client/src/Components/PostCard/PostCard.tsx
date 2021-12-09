import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import { PostSnippetFragment } from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import Upvote from "../Upvote/Upvote";
import "./PostCard.scss";

interface PostCardProps {
  post: PostSnippetFragment;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {darkMode} = useContext(ApplicationContext)
  //
  return (
    <Card className={`${darkMode ? "containerDark" : "container"}`}>
      <h6 className="username">{`u/${post.creator.username}`}</h6>
      {/* <Image src={image} className="image" rounded fluid /> */}
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text className="text">{post.textSnippet}</Card.Text>
        <Upvote post={post} />
      </Card.Body>
    </Card>
  );
};

export default PostCard;
