import "./App.css";
import { useEffect, useState } from "react";
import Modal from "./Modal.js";
import BlogList from "./BlogList.js";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.js";

import { useBottomScrollListener } from "react-bottom-scroll-listener";

function HandleGithubButton() {
  window.location.assign(
    "https://github.com/login/oauth/authorize?client_id=" +
      client_id +
      "&scope=user:email%20repo"
  );
}

const client_id = process.env.REACT_APP_client_id;
const owner = process.env.REACT_APP_owner;
const repo = process.env.REACT_APP_repo;

function App() {
  // for the redirect url with code query params
  const [reRender, setreRender] = useState(false);
  const [blogs, setblogList] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, sethasNextPage] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const per_page = 10;

  function handleAddPost(data) {
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

    const url = "https://api.github.com" + `/repos/${owner}/${repo}/issues`;
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        // Created response status 201
        if (response.status === 201) {
          return response.json();
        }
      })
      .then((data) => {
        setblogList([data, ...blogs]);
        //fetchblogList();
      });
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    console.log(code);

    if (code) {
      async function getAccessToken() {
        const response = await fetch(
          `http://127.0.0.1:8080/getAccessToken?code=${code}`
        );
        const data = await response.json();
        console.log(data);
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
          console.log("set logged in true");
          setisLoggedIn(true);
        }
      }
      getAccessToken();
    }
  }, []);

  function fetchblogList() {
    //fetch(`http://127.0.0.1:8080/getBlogs`, { method: "GET" });
    // make it so that repo and owner can be dynamically adjusted
    /*
     -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer <YOUR-TOKEN>" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    */

    fetch(
      `https://api.github.com/repos/chinaoel/Blog/issues?per_page=${per_page}&page=1`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.length < 10) {
          console.log("set to false");
          sethasNextPage(false);
        }
        setblogList(data);
      });
  }
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setisLoggedIn(true);
    }
    fetchblogList();
  }, []);

  function fetchMoreblogs() {
    //fetch(`http://127.0.0.1:8080/getBlogs`, { method: "GET" });
    // make it so that repo and owner can be dynamically adjusted
    /*
     -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer <YOUR-TOKEN>" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    */

    fetch(
      `https://api.github.com/repos/chinaoel/Blog/issues?per_page=${per_page}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.length < 10) {
          console.log("set to false");
          sethasNextPage(false);
        }
        // may encounter situation where same blog is retrieved
        // eg. after the first fetch, the user add one post,
        // the second api call would retrieve a duplicated post
        if (!data) return;
        const filteredNewBlogs = data.filter(
          (newBlog) =>
            !blogs.some(
              (originalBlog) => originalBlog.number === newBlog.number
            )
        );
        console.log([...blogs, ...filteredNewBlogs]);
        setblogList([...blogs, ...filteredNewBlogs]);
      });
  }

  useBottomScrollListener(
    () => {
      console.log(hasNextPage);
      if (hasNextPage) {
        setPage(page + 1);
      }
    },
    { offset: 30 }
  );

  useEffect(() => {
    if (page > 1) {
      // Prevent duplicate fetches on initial render
      fetchMoreblogs();
    }
  }, [page]);

  function HandleLogOut() {
    if (localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
      setisLoggedIn(false);
      //alert("Log out successfully");
    } else {
      //alert("You did not even log in! ");
    }
  }

  return (
    <div className="App">
      <Navbar />
      {isLoggedIn && <h2 className="welcome">Hello, {owner}.</h2>}
      {!isLoggedIn && <h2 className="welcome">Hello, Guest.</h2>}
      {!isLoggedIn && (
        <button className="operations" onClick={HandleGithubButton}>
          Oauth Github Log in
        </button>
      )}
      {isLoggedIn && (
        <button className="operations" onClick={HandleLogOut}>
          Log Out
        </button>
      )}
      {isLoggedIn && (
        <button className="operations" onClick={() => setShowModalAdd(true)}>
          Add Post
        </button>
      )}
      {/*
      {blogs && (
        <BlogList
          blogs={blogs}
          handleEditPost={handleEditPost}
          handleDeletePost={handleDeletePost}
        ></BlogList>
      )}
      */}
      {blogs && (
        <div>
          {blogs.map((blog) => (
            <div className="blog-preview" key={blog.number}>
              <Link to={`issue/${blog.number}`}>Title : {blog.title}</Link>
            </div>
          ))}
        </div>
      )}
      {showModalAdd && (
        <Modal
          onSubmit={(data) => {
            handleAddPost(data);
          }}
          onClose={() => {
            console.log("Close Modal");
            setShowModalAdd(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
