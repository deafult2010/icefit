import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {

    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 650px)").matches
    )

    useEffect(() => {
        window
            .matchMedia("(min-width: 650px)")
            .addEventListener('change', e => setMatches(e.matches));
    }, []);

    useEffect(() => {
        fetch("/mypost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                setPics(result.mypost)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (image) {
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
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div style={{ maxWidth: "1400px", margin: "0px auto" }}>

            <div style={{ borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div style={{ display: "flex", justifyContent: "right", margin: "10px 10px" }}>
                        {matches ?
                            <img className="profile-pic" style={{ marginTop: "20px", width: "240px", height: "240px" }}
                                src={state ? state.pic : "loading"}
                                alt="profile pic"
                            />
                            :
                            <img className="profile-pic" style={{ marginTop: "20px", width: "160px", height: "160px" }}
                                src={state ? state.pic : "loading"}
                                alt="profile pic"
                            />
                        }
                    </div>
                    <div style={{ marginRight: "50px" }}>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "118%" }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : 0} followers</h6>
                            <h6>{state ? state.following.length : 0} following</h6>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div style={{ display: "flex", justifyContent: "right", margin: "10px 10px" }}>
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1" >
                                <span>Upload Pic</span>
                                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginRight: "250px" }}>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item"
                                src={item.photo}
                                alt="gallery pic"
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile