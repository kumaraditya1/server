import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import moment from 'moment'
const Home = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch(`/getsubpost?page=${page}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.postsdata);
      });
  }, [page]);
  
 window.addEventListener("scroll", () => {
   const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
   if (scrollTop + clientHeight >= scrollHeight) {
     console.log("bottom");
     setPage(page + 1);
     //setPage(prevPage => prevPage + 1)
     console.log(page);
   }
 });
   
  const likepost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log(newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log(newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        //console.log(newData)
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json)
      .then((result) => {
        console.log("res");
        console.log(result._id);
        const newData = data.filter((item) => {
          console.log(item._id);
          return item._id !== result._id;
        });
        console.log("newd");
        console.log(newData);
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile/"
                }
              >
                <div className="avatar">
                  <img
                    src={item.postedBy.pic}
                    alt=""
                    className="circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "16px",
                      marginLeft: "5px",
                    }}
                  />
                  <span>{item.postedBy.name}</span>
                </div>
              </Link>

              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h5>
            <h5>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.username}
              </Link>
            </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              <i className="material-icons">favorite</i>
              {item.viewerliked ? (
                <i
                  className="material-icons"
                  onClick={() => unlikepost(item._id)}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likepost(item._id)}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likesCount} likes</h6>
              <h6>{item.title}</h6>
              <p>
                <span>{item.postedBy.name}</span>
                &nbsp;
                {item.body}
              </p>
              {item.comments.slice(0, 2).map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                    <h6>
                      <span>
                        {moment().diff(moment(record.createdAt)) <
                        7 * 24 * 60 * 60 * 1000
                          ? moment(record.createdAt).fromNow()
                          : moment(record.createdAt).calendar()}
                      </span>
                    </h6>
                  </h6>
                );
              })}
              <Link to={"/post/" + item._id}>
                <p>view all {item.comments.length} comments</p>
              </Link>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
                <h6>
                  {moment().diff(moment(item.createdAt)) <
                  7 * 24 * 60 * 60 * 1000
                    ? moment(item.createdAt).fromNow()
                    : moment(item.createdAt).calendar()}
                </h6>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
