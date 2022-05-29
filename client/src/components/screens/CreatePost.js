import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const onFormSubmit = e => {
        e.preventDefault();
        postDetails();
    }

    useEffect(() => {
        if (url) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                    }
                    else {
                        M.toast({ html: "Created Post Successfully", classes: "#388e3c green darken-1" })
                        navigate('/')
                    }
                }).catch(err => {
                    console.log(err)
                })

        }
        // eslint-disable-next-line
    }, [url])
    const postDetails = () => {
        if (!image) {
            M.toast({ html: "No image found", classes: "#c62828 red darken-3" })
            return
        }
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "dmla0lcbu")
        fetch("https://api.cloudinary.com/v1_1/dmla0lcbu/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="card input-field" style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>

            <form onSubmit={onFormSubmit}>
                <input type="text"
                    placeholder="title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input type="text"
                    placeholder="body"
                    onChange={(e) => setBody(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1" >
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button type="submit" className="btn waves-effect waves-light #64b5f6 blue darken-1">
                    Submit Post
                </button>
            </form>
        </div>
    )
}

export default CreatePost