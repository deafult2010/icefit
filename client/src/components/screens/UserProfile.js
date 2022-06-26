import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'

const Profile = () => {

    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
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
                            {showfollow ?
                                <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>
                                    Follow
                                </button>
                                :
                                <button style={{ margin: "10px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => unfollowUser()}>
                                    Unfollow
                                </button>}
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
                                        <th style={{ padding: '5px' }}>Played</th>
                                        <th style={{ padding: '5px' }}>Rated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Tennis</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tennisRating}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tennisGamesPlayed}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tennisRatedGamesPlayed}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Badminton</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.badmintonRating}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.badmintonGamesPlayed}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.badmintonRatedGamesPlayed}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Table Tennis</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tableTennisRating}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tableTennisGamesPlayed}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.tableTennisRatedGamesPlayed}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '5px' }}>Chess</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.chessRating}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.chessGamesPlayed}</td>
                                        <td style={{ padding: '5px' }}>{userProfile.user.chessRatedGamesPlayed}</td>
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