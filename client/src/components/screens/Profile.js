import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import Alert from "sweetalert2";
import M from 'materialize-css'


const Profile = () => {

    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 700px)").matches
    )

    useEffect(() => {
        window
            .matchMedia("(min-width: 700px)")
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



    const editEmail = () => {
        Alert.fire({
            title: 'Change Email:',
            // input: 'text',
            html:
                '<input id="swal-input1" className="swal2-input">',

            showCancelButton: true,
            // showDenyButton: false,
            showConfirmButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            confirmButtonText: "Remove Event",
            cancelButtonText: "Close",
            confirmButtonText: "Change",
            // showLoaderOnDeny: true,
        }).then(result => {
            console.log(state)
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('swal-input1').value)) {
                M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
                return
            }
            result.isConfirmed === true &&
                console.log(result)
            console.log()
            fetch('/updateemail', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    email: document.getElementById('swal-input1').value
                })
            }).then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({ ...state, email: result.email }))
                    dispatch({ type: "UPDATEEMAIL", payload: result.email })
                })
        });
    };

    return (
        <div style={{ maxWidth: "1400px", margin: "0px auto" }}>

            <div style={{ borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "center", }}>
                    <div style={{ display: "flex", justifyContent: "right", margin: "10px 10px", flexDirection: 'column', alignItems: 'center' }}>
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
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Upload Pic</span>
                                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '5%' }}>

                    </div>
                    <div style={{ width: '30%', minWidth: '250px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'right', fontSize: '20px' }}>credits</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '30px' }}>{state ? state.name : "loading"}</div>
                                <div style={{ fontSize: '30px', backgroundColor: '#f5ce22', padding: '0 10px 0 10px' }}><span className="material-icons">stars</span>{state ? state.credits : "loading"}</div>
                            </div>

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h5>{state ? state.email : "loading"}</h5>
                            <button className="btn #64b5f6 blue darken-1" onClick={() => editEmail()}>Edit</button>
                        </div>
                        <div style={{ display: "flex", gap: '20px' }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : 0} followers</h6>
                            <h6>{state ? state.following.length : 0} following</h6>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ padding: '5px' }}>Game</th>
                                    <th style={{ padding: '5px' }}>Rating</th>
                                    <th style={{ padding: '5px' }}>Played</th>
                                    <th style={{ padding: '5px' }}>Rated</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '5px' }}>Tennis</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tennisRating : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tennisGamesPlayed : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tennisRatedGamesPlayed : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Badminton</td>
                                    <td style={{ padding: '5px' }}>{state ? state.badmintonRating : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.badmintonGamesPlayed : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.badmintonRatedGamesPlayed : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Table Tennis</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tableTennisRating : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tableTennisGamesPlayed : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tableTennisRatedGamesPlayed : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Chess</td>
                                    <td style={{ padding: '5px' }}>{state ? state.chessRating : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.chessGamesPlayed : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? state.chessRatedGamesPlayed : 0}</td>
                                </tr>
                            </tbody>
                        </table>
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