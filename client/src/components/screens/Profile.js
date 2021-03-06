import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import Alert from "sweetalert2";
import M from 'materialize-css'
import AddCreditsModal from './AddCreditsModal'
import CreditsHistoryModal from './CreditsHistoryModal'
import axios from 'axios'
import moment from 'moment'

const Profile = () => {

    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    const [played, setPlayed] = useState([])
    const [tennisPlayed, setTennisPlayed] = useState([])
    const [tableTennisPlayed, setTableTennisPlayed] = useState([])
    const [badmintonPlayed, setBadmintonPlayed] = useState([])
    const [chessPlayed, setChessPlayed] = useState([])
    const [tennisRatedPlayed, setTennisRatedPlayed] = useState([])
    const [tableTennisRatedPlayed, setTableTennisRatedPlayed] = useState([])
    const [badmintonRatedPlayed, setBadmintonRatedPlayed] = useState([])
    const [chessRatedPlayed, setChessRatedPlayed] = useState([])
    const [tennisWins, setTennisWins] = useState([])
    const [tableTennisWins, setTableTennisWins] = useState([])
    const [badmintonWins, setBadmintonWins] = useState([])
    const [chessWins, setChessWins] = useState([])
    const [tennisLosses, setTennisLosses] = useState([])
    const [tableTennisLosses, setTableTennisLosses] = useState([])
    const [badmintonLosses, setBadmintonLosses] = useState([])
    const [chessLosses, setChessLosses] = useState([])
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 700px)").matches
    )

    useEffect(() => {
        window
            .matchMedia("(min-width: 700px)")
            .addEventListener('change', e => setMatches(e.matches));
    }, []);


    useEffect(() => {
        axios.get('/get-events', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            let i = 0
            let j = 0
            let k = 0
            response.data.forEach(item => {
                if (moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === state._id) {
                            i += 1
                        }
                    })
                }
            })
            setPlayed(i)
            i = 0
            j = 0
            k = 0
            response.data.forEach(item => {
                console.log(item.start)
                console.log(Date.now())
                if (item.title === 'Tennis' & moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === state._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === element._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === element._id) {
                                    k += 1
                                }
                            })
                        }
                    })
                }
            })
            setTennisPlayed(i)
            setTennisRatedPlayed(j + k)
            setTennisWins(j)
            setTennisLosses(k)
            i = 0
            j = 0
            k = 0
            response.data.forEach(item => {
                if (item.title === 'Table Tennis' & moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === state._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === element._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === element._id) {
                                    k += 1
                                }
                            })
                        }
                    })
                }
            })
            setTableTennisPlayed(i)
            setTableTennisRatedPlayed(j + k)
            setTableTennisWins(j)
            setTableTennisLosses(k)
            i = 0
            j = 0
            k = 0
            response.data.forEach(item => {
                if (item.title === 'Badminton' & moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === state._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === element._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === element._id) {
                                    k += 1
                                }
                            })
                        }
                    })
                }
            })
            setBadmintonPlayed(i)
            setBadmintonRatedPlayed(j + k)
            setBadmintonWins(j)
            setBadmintonLosses(k)
            i = 0
            j = 0
            k = 0
            response.data.forEach(item => {
                if (item.title === 'Chess' & moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === state._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === element._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === element._id) {
                                    k += 1
                                }
                            })
                        }
                    })
                }
            })
            setChessPlayed(i)
            setChessRatedPlayed(j + k)
            setChessWins(j)
            setChessLosses(k)
        })
    }, [state]);

    // console.log(tennisPlayed + 'tennis played')
    // console.log(badmintonPlayed + 'badminton played')
    // console.log(tableTennisPlayed + 'table tennis played')
    // console.log(chessPlayed + 'chess played')

    useEffect(() => {
        fetch("/mypost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
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
        // eslint-disable-next-line
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }


    const editEmail = () => {
        Alert.fire({
            title: 'Change Email:',
            html:
                '<input id="swal-input1" className="swal2-input">',

            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: "#3085d6",
            confirmButtonColor: "#d33",
            cancelButtonText: "Close",
            confirmButtonText: "Change",
        }).then(result => {
            if (result.isConfirmed === false) {
                return
            }
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById('swal-input1').value)) {
                M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
                return
            }
            if (result.isConfirmed === true) {
                console.log(result)
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
            }
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: '30px', marginTop: '20px' }}>{state ? state.name : "loading"}</div>
                                <div></div>


                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                                <div></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                    <div>                                <h5 style={{ marginBottom: '0px' }}>Credits:</h5></div>
                                    <div style={{ fontSize: '30px', backgroundColor: '#f5ce22', padding: '0 10px 0 10px', width: '145px', textAlign: 'center' }}><span className="material-icons">stars</span>{state ? state.credits - played : "loading"}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                                <div></div>
                                <div>
                                    <button data-target="modal2" className="modal-trigger btn-small #43a047 green darken-2">Add</button>
                                    <button data-target="modal3" className="modal-trigger btn-small #43a047 green darken-2">History</button>
                                </div>
                            </div>

                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h5>{state ? state.email : "loading"}</h5>
                            <button className="btn-small #64b5f6 blue darken-1" onClick={() => editEmail()}>Edit</button>
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
                                    <th style={{ padding: '5px', textAlign: 'center' }}>Played</th>
                                    {/* <th style={{ padding: '5px' }}>Rated</th> */}
                                    <th style={{ padding: '5px' }}>Won</th>
                                    <th style={{ padding: '5px' }}>Lost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '5px' }}>Tennis</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tennisRating : 0}</td>
                                    <td style={{ padding: '5px', textAlign: 'center' }}>{state ? tennisPlayed : 0}</td>
                                    {/* <td style={{ padding: '5px' }}>{state ? tennisRatedPlayed : 0}</td> */}
                                    <td style={{ padding: '5px' }}>{state ? tennisWins : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? tennisLosses : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Badminton</td>
                                    <td style={{ padding: '5px' }}>{state ? state.badmintonRating : 0}</td>
                                    <td style={{ padding: '5px', textAlign: 'center' }}>{state ? badmintonPlayed : 0}</td>
                                    {/* <td style={{ padding: '5px' }}>{state ? badmintonRatedPlayed : 0}</td> */}
                                    <td style={{ padding: '5px' }}>{state ? badmintonWins : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? badmintonLosses : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Table Tennis</td>
                                    <td style={{ padding: '5px' }}>{state ? state.tableTennisRating : 0}</td>
                                    <td style={{ padding: '5px', textAlign: 'center' }}>{state ? tableTennisPlayed : 0}</td>
                                    {/* <td style={{ padding: '5px' }}>{state ? tableTennisRatedPlayed : 0}</td> */}
                                    <td style={{ padding: '5px' }}>{state ? tableTennisWins : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? tableTennisLosses : 0}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '5px' }}>Chess</td>
                                    <td style={{ padding: '5px' }}>{state ? state.chessRating : 0}</td>
                                    <td style={{ padding: '5px', textAlign: 'center' }}>{state ? chessPlayed : 0}</td>
                                    {/* <td style={{ padding: '5px' }}>{state ? chessRatedPlayed : 0}</td> */}
                                    <td style={{ padding: '5px' }}>{state ? chessWins : 0}</td>
                                    <td style={{ padding: '5px' }}>{state ? chessLosses : 0}</td>
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
            <AddCreditsModal />
            <CreditsHistoryModal played={played} />
        </div>
    )
}

export default Profile