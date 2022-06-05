import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../App'
import Sidebar from './SideBar'
import M from 'materialize-css'

const NavBar = () => {
    const { pathname } = useLocation();
    const searchModal = useRef(null)
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 650px)").matches
    )
    const navigate = useNavigate()

    useEffect(() => {
        window
            .matchMedia("(min-width: 650px)")
            .addEventListener('change', e => setMatches(e.matches));
    }, []);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const renderList = () => {
        if (state) {
            return [
                <>
                    <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        <li key="search"><Link to="#" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span data-target="modal1" className="material-icons modal-trigger">search</span>&nbsp;</Link></li>
                        <li key="bookings"><Link to="/bookings" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons">event</span> &nbsp; Bookings</Link></li>
                        <li key="profile"><Link to="/profile" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons">person_pin</span> &nbsp; Profile</Link></li>
                        <li key="create"><Link to="/create" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons">message</span> &nbsp; Create Post</Link></li>
                        <li key="about"><Link to="/about" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons">help_outline</span> &nbsp; About</Link></li>
                        <li key="button">
                            <button className="btn waves-effect waves-light #c62828 red darken-3" style={{ padding: '8px', marginTop: '15px', display: 'flex', alignItems: 'center' }} onClick={() => {
                                localStorage.clear()
                                dispatch({ type: "CLEAR" })
                                navigate("/signin")
                            }}>
                                <span className="material-icons" >logout</span> &nbsp; Logout
                            </button>
                        </li>
                    </ul>
                </>
            ]
        } else {
            return [
                <>
                    <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        <li key="signin"><Link to="/signin">Login</Link></li>
                        <li key="signup"><Link to="/signup">Signup</Link></li>
                    </ul>
                </>
            ]
        }
    }

    const fetchUsers = (query) => {
        setSearch(query)
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

    return (<nav>
        <div className="nav-wrapper white" style={{ color: "black" }}>
            {matches ? renderList() : Sidebar(sidebar, showSidebar, setSidebar)}
        </div>
        <div id="modal1" className="modal" ref={searchModal} style={{ color: "black" }}>
            <div className="modal-content">
                <input
                    type="text"
                    placeholder="search users"
                    value={search}
                    onChange={(e) => fetchUsers(e.target.value)}
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
                <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
            </div>
        </div>
    </nav >
    )
}

export default NavBar