import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import { Link } from 'react-router-dom'
import DropdownPosts from './DropdownPosts'

const Home = () => {
    const [data, setData] = useState([])
    const [selected, setSelected] = useState("All")
    const { state, dispatch } = useContext(UserContext)
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 700px)").matches
    )
    const [font, setFont] = useState("10px")
    const [title, setTitle] = useState("")

    useEffect(() => {
        window.innerWidth >= 700 ? setTitle("User Posts and Events") : setTitle("Posts & Events");
        window.innerWidth >= 700 ? setFont("40px") : setFont("30px");
        window
            .matchMedia("(min-width: 700px)")
            .addEventListener('change', e => { setMatches(e.matches); window.innerWidth >= 700 ? setFont("40px") : setFont("30px"); window.innerWidth >= 700 ? setTitle("User Posts and Events") : setTitle("Posts & Events") });
    }, []);

    useEffect(() => {
        if (selected === 'All') {
            fetch('/allpost', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
                .then(result => {
                    console.log(result)
                    setData(result.posts)
                })
        } else if (selected === 'Followed') {
            fetch('/getsubpost', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
                .then(result => {
                    console.log(result)
                    setData(result.posts)
                })
        } else if (selected === 'Events') {
            fetch('/allpost', {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res => res.json())
                .then(result => {
                    console.log(result)
                    setData(result.posts)
                })
        }
    }, [selected])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    const deleteComment = (postid, commentid) => {
        fetch(`/deletecomment/${postid}/${commentid}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        result.postedBy = item.postedBy;
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData);
                M.toast({ html: "Comment Deleted Successfully", classes: "#388e3c green darken-1" });
            })
    }


    return (
        <div className="home">
            <div className="card home-card" style={{ padding: '10px', display: "flex" }}>
                <div className="brand-logo left" style={{ fontSize: font }}>{title}</div>
                <div style={{ marginLeft: "auto" }}>
                </div>
                <DropdownPosts selected={selected} setSelected={setSelected}></DropdownPosts>
            </div>
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ paddingLeft: "24px", paddingTop: "10px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} >{item.postedBy.name}</Link>{item.postedBy._id === state._id &&
                                <button className="btn waves-effect waves-light #64b5f6 red" style={{ float: "right", marginRight: "10px", marginBottom: "10px" }} onClick={() => {
                                    deletePost(item._id)
                                }}>
                                    <i className="material-icons" style={{ color: "white" }}>delete</i>
                                </button>
                            }</h5>
                            <div className="card-image">
                                <img
                                    src={item.photo}
                                    alt="home background"
                                />
                            </div>
                            <div className="card-content">
                                <button className="btn waves-effect waves-light #64b5f6 blue darken-1">
                                    <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                </button>
                                {item.likes.includes(state._id)
                                    ? <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => { unlikePost(item._id) }}><i className="material-icons" style={{ color: "white" }}>thumb_down</i></button>
                                    : <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => { likePost(item._id) }}><i className="material-icons" style={{ color: "white" }}>thumb_up</i></button>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}>
                                                <span style={{ display: "flex", justifyContent: "space-between", marginBottom: "auto" }}>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                                        <span style={{ fontWeight: "500", alignItems: "center" }}>{record.postedBy.name}:</span>
                                                        <span style={{ alignItems: "center" }}>{record.text}</span>
                                                    </div>
                                                    {record.postedBy._id === state._id ?
                                                        <button style={{ marginLeft: "auto", minWidth: "50px" }} className="btn waves-effect waves-light #64b5f6 red" onClick={() => {
                                                            deleteComment(item._id, record._id)
                                                        }}>
                                                            <i className="material-icons" style={{ color: "white", height: '20px' }}>delete</i>
                                                        </button>
                                                        : <span style={{ marginLeft: "auto" }}> </span>
                                                    }
                                                </span>
                                            </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                    e.target[0].value = ""
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home