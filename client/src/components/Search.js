import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Search = () => {

    const { pathname } = useLocation();
    const searchModal = useRef(null)
    const [searchEmail, setSearchEmail] = useState('');
    const [searchName, setSearchName] = useState('');
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)

    const navigate = useNavigate()

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

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
        <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
            <div className="modal-content">
                <input
                    type="text"
                    placeholder="search by email"
                    value={searchEmail}
                    onChange={(e) => fetchUsers(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="search by name"
                    value={searchName}
                    onChange={(e) => fetchNames(e.target.value)}
                />
                <ul className="collection" style={{ color: "black" }}>
                    {userDetails.map(item => {
                        return <li className="modal-close collection-item"><Link to={item._id !== state._id ? { pathname: "/profile/" + item._id, state: { from: pathname } } : { pathname: "/profile", state: { from: pathname } }} onClick={() => {
                            pathname.startsWith("/profile/") &&
                                navigate("/profile/" + item._id)
                                    .then(window.location.reload())
                        }}>{item.email}</Link></li>
                    })}
                </ul>
            </div>
            <div className="modal-footer">
                <button className="modal-close waves-effect waves-green btn-flat" onClick={() => { setSearchEmail(''); setSearchName(''); }}>Close</button>
            </div>
        </div>
    )
}

export default Search