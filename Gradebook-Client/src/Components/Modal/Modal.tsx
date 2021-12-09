import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const CenteredModal = (props: any) => {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Please Login to Create Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>It'll be worth your while</p>
      </Modal.Body>
      <Modal.Footer>
        <Link to="/login">
          <Button> Log in</Button>
        </Link>
        <Button onClick={props.onHide} variant="danger">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CenteredModal;
