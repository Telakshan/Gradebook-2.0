import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import {
  PostSnippetFragment,
  useMeQuery,
  usePointsQuery, useVoteMutation
} from "../../generated/graphql";

interface UpvoteProps {
  post: PostSnippetFragment;
}

const Upvote: React.FC<UpvoteProps> = ({ post }) => {

  const { data } = usePointsQuery({
    variables: {
      id: post.id,
    },
  });

  const [vote] = useVoteMutation();
  const { data: me } = useMeQuery();
  const [count, setCount] = useState<number | undefined>();
  const [liked, setLiked] = useState<"liked" | "disliked" | "neutral">(
    post.voteStatus === 1
      ? "liked"
      : post.voteStatus === 0 || post.voteStatus == null
      ? "neutral"
      : "disliked"
  );
  const [loading, setIsLoading] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");

  const upVote = async () => {
    if(me?.me?.username === null) return;
    setIsLoading("upvote-loading");
    await vote({ variables: { postId: post.id, value: 1 } }).then((c) => {
      setIsLoading("not-loading");
      setLiked("liked");
      let likes = Number(data?.points);
      if (me?.me?.username) count === -1 ? setCount(1) : setCount(likes + 1);
    });
  };

  const downVote = async () => {
    if(me?.me?.username === null) return;
    setIsLoading("downvote-loading");
    await vote({ variables: { postId: post.id, value: -1 } }).then((c) => {
      setIsLoading("not-loading");
      setLiked("disliked");
      let likes = Number(data?.points);
      if (me?.me?.username) count === 1 ? setCount(-1) : setCount(likes - 1);
    });
  };

  useEffect(() => {
    if (data) {
      setCount(data?.points!);
    }
  }, [data]);

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props} show={me?.me?.username == null}>
      {me?.me?.username == null ? "Please Log in" : "Rate"}
    </Tooltip>
  );

  return (
    <div className="vote-group">
      <OverlayTrigger
        placement="left"
        delay={{ show: 250, hide: 1 }}
        overlay={renderTooltip}
      >
        <Button
          variant={liked === "liked" ? "success" : "outline-primary"}
          onClick={() => upVote()}
          // disabled={me?.me?.username == null}
        >
          {loading === "upvote-loading" ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <FiThumbsUp />
          )}
        </Button>
      </OverlayTrigger>

      <Button variant="outline-secondary" disabled>
        {count}
      </Button>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 1 }}
        overlay={renderTooltip}
      >
        <Button
          variant={liked === "disliked" ? "danger" : "outline-primary"}
          //    disabled={me?.me?.username == null}
          onClick={() => downVote()}
        >
          {loading === "downvote-loading" ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <FiThumbsDown />
          )}
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default Upvote;
