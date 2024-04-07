import React, { useState, useEffect } from "react";

function Modal({ onSubmit, onClose, origtitle, origbody }) {
  const [title, setTitle] = useState(origtitle);
  const [body, setBody] = useState(origbody);
  let ErrorMessage = "";

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const validateInput = ({ title, body }) => {
    if (!title) {
      ErrorMessage = "Title field is required.";
      return false;
    } else if (body.length <= 30) {
      ErrorMessage = "Body must be longer than 30 characters.";
      return false;
    } else {
      // Proceed with form submission (e.g., send data to an API)
      return true;
    }
  };

  const handleSubmit = (data) => {
    if (validateInput({ title, body })) {
      onSubmit({ title, body });
      setTitle("");
      setBody("");
      onClose();
    } else {
      alert(`Invalid Input Fields, Errmsg : ${ErrorMessage}`);
    }
  };

  // Add event listener to handle click outside the modal
  /*
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById("modal");
      if (modal && !modal.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  */

  return (
    <div className="modal" style={modalStyle}>
      <div style={modalContentStyle}>
        <button className="close" onClick={onClose}>
          &times;
        </button>
        <h2>Enter Details</h2>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
        />
        <textarea
          value={body}
          onChange={handleBodyChange}
          placeholder="Body"
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  zIndex: "1",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  overflow: "auto",
  backgroundColor: "rgba(0,0,0,0.4)",
};

const modalContentStyle = {
  backgroundColor: "#fefefe",
  margin: "15% auto",
  padding: "20px",
  border: "1px solid #888",
  width: "80%",
};

export default Modal;
