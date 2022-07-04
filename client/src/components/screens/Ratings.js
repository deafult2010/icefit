import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'
import axios from 'axios'
import moment from 'moment'

const Ratings = () => {

    const { pathname } = useLocation();
    const searchModal = useRef(null)
    const searchTabs = useRef(null)
    const [searchEmail, setSearchEmail] = useState('');
    const [searchName, setSearchName] = useState('');
    const [userDetails, setUserDetails] = useState([])
    const [events, setEvents] = useState([])
    const { state, dispatch } = useContext(UserContext)

    const navigate = useNavigate()

    useEffect(() => {
        M.Tabs.init(searchTabs.current);
        axios.get('/get-events', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            setEvents(response.data)

        })
    }, [])

    useEffect(() => {
        fetchUsers('')
    }, [events])

    const fetchUsers = (query) => {
        setSearchEmail(query)
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        }).then(res => res.json())
            .then(results => {
                // Add games data:
                results.user.map(item => {
                    let i = 0
                    let user = item
                    events.map(item => {
                        if (item.title === 'Tennis' & moment(item.start).valueOf() < Date.now()) {
                            item.attending.map(element => {
                                if (element._id === user._id) {
                                    i += 1
                                }
                            })
                        }
                    })
                    item.tennisGamesPlayed = i
                    i = 0
                    events.map(item => {
                        if (item.title === 'Table Tennis' & moment(item.start).valueOf() < Date.now()) {
                            item.attending.map(element => {
                                if (element._id === user._id) {
                                    i += 1
                                }
                            })
                        }
                    })
                    item.tableTennisGamesPlayed = i
                    i = 0
                    events.map(item => {
                        if (item.title === 'Badminton' & moment(item.start).valueOf() < Date.now()) {
                            item.attending.map(element => {
                                if (element._id === user._id) {
                                    i += 1
                                }
                            })
                        }
                    })
                    item.badmintonGamesPlayed = i
                    i = 0
                    events.map(item => {
                        if (item.title === 'Chess' & moment(item.start).valueOf() < Date.now()) {
                            item.attending.map(element => {
                                if (element._id === user._id) {
                                    i += 1
                                }
                            })
                        }
                    })
                    item.chessGamesPlayed = i
                })
                setUserDetails(results.user)
            })
    }

    const fetchNames = (query) => {
        setSearchName(query)
        fetch('/search-names', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
    }

    return (
        <div>
            <div className="card home-card" style={{ padding: '20px' }}>
                <h2>Ratings</h2>
                <input
                    type="text"
                    placeholder="search by name"
                    value={searchName}
                    onChange={(e) => { fetchNames(e.target.value); setSearchEmail('') }}
                />
                <input
                    type="text"
                    placeholder="search by email"
                    value={searchEmail}
                    onChange={(e) => { fetchUsers(e.target.value); setSearchName('') }}
                />
            </div>
            <div className="card home-card" style={{ padding: '20px' }}>
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs" ref={searchTabs}>
                            <li className="tab col s2"><a className="active" href="#test1">Overall</a></li>
                            <li className="tab col s2"><a href="#test2">Tennis</a></li>
                            <li className="tab col s3"><a href="#test3">Badminton</a></li>
                            <li className="tab col s3"><a href="#test4">Table Tennis</a></li>
                            <li className="tab col s2"><a href="#test5">Chess</a></li>
                        </ul>
                    </div>
                    <div id="test1" className="col s12">
                        <table className="tg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Games Played</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails.sort((a, b) => parseFloat(b.tennisGamesPlayed + b.badmintonGamesPlayed + b.tableTennisGamesPlayed + b.chessGamesPlayed) - parseFloat(a.tennisGamesPlayed + a.badmintonGamesPlayed + a.tableTennisGamesPlayed + a.chessGamesPlayed)).map(item => {
                                    return <tr key={item._id}>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.name}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.email}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.tennisGamesPlayed + item.badmintonGamesPlayed + item.tableTennisGamesPlayed + item.chessGamesPlayed}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div id="test2" className="col s12">
                        <table className="tg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Tennis Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails.sort((a, b) => parseFloat(b.tennisRating) - parseFloat(a.tennisRating)).map(item => {
                                    return <tr key={item._id}>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.name}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.email}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.tennisRating}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div id="test3" className="col s12">
                        <table className="tg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Badminton Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails.sort((a, b) => parseFloat(b.badmintonRating) - parseFloat(a.badmintonRating)).map(item => {
                                    return <tr key={item._id}>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.name}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.email}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.badmintonRating}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div id="test4" className="col s12">
                        <table className="tg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Table Tennis Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails.sort((a, b) => parseFloat(b.tableTennisRating) - parseFloat(a.tableTennisRating)).map(item => {
                                    return <tr key={item._id}>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.name}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.email}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.tableTennisRating}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div id="test5" className="col s12">
                        <table className="tg">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Chess Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails.sort((a, b) => parseFloat(b.chessRating) - parseFloat(a.chessRating)).map(item => {
                                    return <tr key={item._id}>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.name}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.email}</Link></td>
                                        <td><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                                            pathname.startsWith("/profile/") &&
                                                navigate("/profile/" + item._id)
                                                    .then(window.location.reload())
                                        }}>{item.chessRating}</Link></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ratings