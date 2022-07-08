import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

const Profile = () => {

    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
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
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setProfile(result)
            })
            .catch(err => {
                console.log(err)
            })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        axios.get('/get-events', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            console.log(response)
            console.log(userProfile)
            let i = 0
            let j = 0
            let k = 0
            response.data.forEach(item => {
                if (moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === userProfile.user._id) {
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
                if (item.title === 'Tennis' & moment(item.start).valueOf() < Date.now()) {
                    item.attending.forEach(element => {
                        if (element._id === userProfile.user._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === userProfile.user._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === userProfile.user._id) {
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
                        if (element._id === userProfile.user._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === userProfile.user._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === userProfile.user._id) {
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
                        if (element._id === userProfile.user._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === userProfile.user._id) {
                                    j += 1
                                    console.log('123123')
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === userProfile.user._id) {
                                    k += 1
                                    console.log('cyacya')
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
                        if (element._id === userProfile.user._id) {
                            i += 1
                            item.winners.forEach(el => {
                                if (el === userProfile.user._id) {
                                    j += 1
                                }
                            })
                            item.losers.forEach(el => {
                                if (el === userProfile.user._id) {
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
    }, [userProfile]);

    // console.log(tennisPlayed + 'tennis played')
    // console.log(badmintonPlayed + 'badminton played')
    // console.log(tableTennisPlayed + 'table tennis played')
    // console.log(chessPlayed + 'chess played')

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }


    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }

    return (
        <>
            {userProfile ?
                <div style={{ maxWidth: "1400px", margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-evenly", marginBottom: "18px", borderBottom: "1px solid grey" }}>
                        <div style={{ display: "flex", justifyContent: "right", margin: "10px 10px", flexDirection: 'column', alignItems: 'center' }}>
                            {matches ?
                                <img className="profile-pic" style={{ width: "240px", height: "240px" }}
                                    src={userProfile.user.pic}
                                    alt="profile pic"
                                />
                                :
                                <img className="profile-pic" style={{ width: "160px", height: "160px" }}
                                    src={userProfile.user.pic}
                                    alt="profile pic"
                                />
                            }
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {showfollow ?
                                    <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>
                                        Follow
                                    </button>
                                    :
                                    <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => unfollowUser()}>
                                        Unfollow
                                    </button>}
                                <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" disabled>
                                    Message
                                </button>
                            </div>
                        </div>
                        <div style={{ width: '40%', minWidth: '250px' }}>
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", gap: '20px' }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
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
                                        <td style={{ padding: '5px' }}>{userProfile.user.tennisRating}</td>
                                        <td style={{ padding: '5px', textAlign: 'center' }}>{tennisPlayed}</td>
                                        {/* <td style={{ padding: '5px' }}>{tennisRatedPlayed}</td> */}
                                        <td style={{ padding: '5px' }}>{tennisWins}</td>
                                        <td style={{ padding: '5px' }}>{tennisLosses}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Badminton</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.badmintonRating}</td>
                                        <td style={{ padding: '5px', textAlign: 'center' }}>{badmintonPlayed}</td>
                                        {/* <td style={{ padding: '5px' }}>{badmintonRatedPlayed}</td> */}
                                        <td style={{ padding: '5px' }}>{badmintonWins}</td>
                                        <td style={{ padding: '5px' }}>{badmintonLosses}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Table Tennis</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tableTennisRating}</td>
                                        <td style={{ padding: '5px', textAlign: 'center' }}>{tableTennisPlayed}</td>
                                        {/* <td style={{ padding: '5px' }}>{tableTennisRatedPlayed}</td> */}
                                        <td style={{ padding: '5px' }}>{tableTennisWins}</td>
                                        <td style={{ padding: '5px' }}>{tableTennisLosses}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Chess</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.chessRating}</td>
                                        <td style={{ padding: '5px', textAlign: 'center' }}>{chessPlayed}</td>
                                        {/* <td style={{ padding: '5px' }}>{chessRatedPlayed}</td> */}
                                        <td style={{ padding: '5px' }}>{chessWins}</td>
                                        <td style={{ padding: '5px' }}>{chessLosses}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
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
                : <h2>loading...</h2>}
        </>
    )
}

export default Profile