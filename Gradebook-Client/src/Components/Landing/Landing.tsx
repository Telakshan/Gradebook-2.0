import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  PostSnippetFragment,
  PostsQuery,
  useMeQuery,
  usePostsQuery
} from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import Loading from "../Loading/Loading";
import CenteredModal from "../Modal/Modal";
import PostCard from "../PostCard/PostCard";
import "./Landing.scss";

const Landing: React.FC<RouteComponentProps> = ({ history }) => {
  const [post, setPost] = useState<PostSnippetFragment[] | undefined>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { darkMode } = useContext(ApplicationContext);

  const { data: loggedIn } = useMeQuery();

  const handleClick = () => {
    if (loggedIn?.me != null) {
      history.push("/create-post");
    } else {
      setShowModal(true);
    }
  };

  const { data, error, loading, fetchMore, variables } =
    usePostsQuery({
      variables: {
        limit: 15,
        cursor: null,
      },
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    if (data) {
      setPost(data?.posts.posts);
    }
  }, [data]);

  if (!loading && !data) {
    return (
      <div
        className={`${
          darkMode ? "landing-page-container-dark" : "landing-page-container"
        }`}
      >
        <div className="failure">
          <h1>No posts have been created. May be create one?</h1>
          <Button variant="outline-primary" onClick={() => handleClick()}>
            <AiOutlineArrowRight className="arrow" />
            Create Post
          </Button>
          <h6>{error?.message}</h6>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        darkMode ? "landing-page-container-dark" : "landing-page-container"
      }`}
    >
      <CenteredModal show={showModal} onHide={() => setShowModal(false)} />
      {loading && !data ? (
        <Loading />
      ) : (
        <>
          <div className="message">
            <h3>Welcome to Gradebook</h3>
            <Button variant="outline-primary" onClick={() => handleClick()}>
              <AiOutlineArrowRight className="arrow" />
              Create Post
            </Button>
          </div>

          {post!.map((d) => (
            <PostCard key={d.creatorId * Math.random()} post={d} />
          ))}
        </>
      )}
      <div className="load-more">
        {data && data.posts.hasMore ? (
          <Button
            onClick={() =>
              fetchMore({
                variables: {
                  limit: variables!.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                updateQuery: (
                  previousValue,
                  { fetchMoreResult }
                ): PostsQuery => {
                  if (!fetchMoreResult) {
                    return previousValue as PostsQuery;
                  }
                  return {
                    __typename: "Query",
                    posts: {
                      __typename: "PaginatedPosts",
                      hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                      posts: [
                        ...(previousValue as PostsQuery).posts.posts,
                        ...(fetchMoreResult as PostsQuery).posts.posts,
                      ],
                    },
                  };
                },
              })
            }
          >
            <RiArrowDropDownLine />
            Load More
          </Button>
        ) : (
          <p className="end">End of List</p>
        )}
      </div>
    </div>
  );
};

export default withRouter(Landing);
