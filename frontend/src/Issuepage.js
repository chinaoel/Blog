import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Markdown from "react-markdown";
import Navbar from "./Navbar";

const IssuePage = () => {
  const owner = process.env.REACT_APP_owner;
  const repo = process.env.REACT_APP_repo;
  const navigate = useNavigate();
  const { issueNo } = useParams();
  const [issueDetails, setissueDetails] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [Comments, setComments] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  function handleDeletePost(issueNo) {
    if (!localStorage.getItem("accessToken")) {
      alert("Not authorized!");
      return;
    }

    const url =
      "https://api.github.com" + `/repos/${owner}/${repo}/issues/${issueNo}`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ state: "closed" }),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          //setblogList(blogs.filter((blog) => blog.number !== issueNo));
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        setTimeout(5000);
        navigate("/");
        //fetchblogList();
      });
  }

  const handleEditPost = (issueNo, data) => {
    // Here you can do whatever you want with the submitted data
    /*
          -H "Accept: application/vnd.github+json" \
        -H "Authorization: Bearer <YOUR-TOKEN>" \
        -H "X-GitHub-Api-Version: 2022-11-28" \
        */
    if (!localStorage.getItem("accessToken")) {
      alert("Not authorized!");
      return;
    }

    const url =
      "https://api.github.com" + `/repos/${owner}/${repo}/issues/${issueNo}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/vnd.github.raw+json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        // local change if the server return 200 instead of calling api for latest data
        if (response.status === 200) {
          /*
            const editblogIdx = blogs.findIndex((blog) => blog.number === issueNo);
            blogs[editblogIdx].title = data.title;
            blogs[editblogIdx].body = data.body;
            setblogList(blogs);
            */

          return response.json();
        }
      })
      .then((data) => {
        setissueDetails(data);
      });
  };

  function fetchIssueDetails(issueNo) {
    const url =
      "https://api.github.com" + `/repos/${owner}/${repo}/issues/${issueNo}`;
    console.log(url);
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
    })
      .then((response) => {
        if (response.status === 403) {
          throw new Error("API Exceed Limit, maybe you request too fast");
        } else if (response.status === 404) {
          throw new Error("Not Found");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        setissueDetails(data);
      })
      .catch((e) => alert(`Error Message : ${e.message}`));
  }

  function handleLoadComments(issueNo) {
    // Maybe turn comment into a component
    const url =
      "https://api.github.com" +
      `/repos/${owner}/${repo}/issues/${issueNo}/comments`;
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
    })
      .then((response) => {
        if (response.status === 403) {
          throw new Error("API Exceed Limit, maybe you request too fast");
        } else if (response.status === 404) {
          throw new Error("Not Found");
        } else {
          response.json();
        }
      })
      .then((data) => {
        if (data) {
          setComments(data);
        }

        return data;
      })
      .catch((e) => alert(`Error Message : ${e.message}`));
  }
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setisLoggedIn(true);
    }
    fetchIssueDetails(issueNo);
  }, []);

  return (
    <div className="blog-details">
      <Navbar />
      <div>
        <h2>Issue #{issueDetails && issueDetails.number}</h2>
        <h2>
          Created at{" "}
          <relative-time datetime={issueDetails && issueDetails.created_at}>
            {issueDetails &&
              `${new Date(
                issueDetails && issueDetails.created_at
              ).toLocaleString("zh-TW")}`}
          </relative-time>
        </h2>
        <h2>
          Created by{" "}
          {issueDetails && issueDetails.user && issueDetails.user.login}
        </h2>
        <div>
          <h2>Title : {issueDetails && issueDetails.title}</h2>
        </div>

        <div className="content">
          <h3>Blog Content</h3>
          <Markdown children={issueDetails && issueDetails.body} />
          {showModalEdit && (
            <Modal
              onSubmit={(data) => {
                handleEditPost(issueDetails.number, data);
              }}
              onClose={() => {
                console.log("Close Modal");
                setShowModalEdit(false);
              }}
              origtitle={issueDetails.title}
              origbody={issueDetails.body}
            />
          )}
        </div>
        <div>Comment Count : {issueDetails && issueDetails.comments}</div>
        {isLoggedIn && (
          <button onClick={() => setShowModalEdit(true)}>Edit</button>
        )}
        {isLoggedIn && (
          <button onClick={() => handleDeletePost(issueDetails.number)}>
            Delete
          </button>
        )}
        <button onClick={() => handleLoadComments(issueDetails.number)}>
          Load Comments
        </button>
        <button onClick={() => setComments([])}>Hide Comments</button>
        <div className="comments">
          {Comments.length !== 0 &&
            Comments.map((comment, idx) => (
              <div className="comment">
                <h4>Comment Num : {idx + 1}</h4>
                <Markdown children={comment.body} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
