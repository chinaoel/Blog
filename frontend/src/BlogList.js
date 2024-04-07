import { Link } from "react-router-dom";
import Modal from "./Modal.js";
import { useState } from "react";

const owner = "chinaoel";
const repo = "Blog";

const BlogList = ({
  blogs,
  handleEditPost,
  handleDeletePost,
  handleLoadComments,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedModal, setSelectedModal] = useState(null);

  const [Comments, setComments] = useState([]);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="BlogList">
      {blogs.map((blog) => (
        <div className="blog" key={blog.id} data-id={blog.number}>
          <a href={blog.url}>link</a>
          <button
            onClick={() => {
              setSelectedModal(blog.number);
              setShowModal(true);
            }}
          >
            Edit
          </button>

          <button onClick={() => handleDeletePost(blog.number)}>Delete</button>

          <h2>{blog.title}</h2>
          <p>{blog.body}</p>

          <button onClick={(e) => handleLoadComments(e, blog.number)}>
            Load COmment
          </button>
        </div>
      ))}

      {showModal && (
        <Modal
          onSubmit={(data) => {
            handleEditPost(selectedModal, data);
          }}
          onClose={() => {
            console.log("Close Modal");
            setShowModal(false);
            console.log(showModal);
          }}
        />
      )}
    </div>
  );
};

export default BlogList;
