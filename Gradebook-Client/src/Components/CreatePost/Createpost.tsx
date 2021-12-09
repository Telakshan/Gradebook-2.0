import React, { ChangeEvent, useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { RouteComponentProps } from "react-router-dom";
import { useCreatePostMutation } from "../../generated/graphql";
import { ApplicationContext } from "../../Hooks/ApplicationContext";
import "./CreatePost.scss";

const Createpost: React.FC<RouteComponentProps> = ({ history }) => {
  const [createPost] = useCreatePostMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { darkMode } = useContext(ApplicationContext);

  const [postData, setPostData] = useState({
    title: "",
    text: "",
  });

  const { title, text } = postData;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleSubmit = async () => {
    if (title.length === 0 || text.length === 0) {
      setErrorMessage("Title and text must be filled");
    } else {
      await createPost({ variables: { input: postData } });
      history.push("/");
    }
  };

  return (
    <div className={`${darkMode ? "login-dark" : "login"}`}>
      <Form onSubmit={handleSubmit} className="contain">
        <Button variant="outline-primary" onClick={() => history.push("/")}>
          <AiOutlineArrowLeft /> Back to home
        </Button>
        <h1 className="title">Create Post</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="subtitle">Title</Form.Label>
          <Form.Control
            name="title"
            type="text"
            placeholder="Enter your title here..."
            value={title}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback>
            {errorMessage.length > 0 ? (
              <p className="danger">{errorMessage}</p>
            ) : (
              <p> "Looks good"</p>
            )}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="text">Enter your post here</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="text"
            placeholder="Enter you text here..."
            value={text}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback>
            {errorMessage.length > 0 ? (
              <p className="danger">{errorMessage}</p>
            ) : (
              <p> "Looks good"</p>
            )}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" className="button">
          Post
        </Button>
      </Form>
    </div>
  );
};

export default Createpost;
