import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import Sidebar from './SideBar'

const NavBar = () => {
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

    const renderList = () => {
        if (state) {
            return [
                <>
                    <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        <li key="profile"><Link to="/profile">Profile</Link></li>
                        <li key="create"><Link to="/create">Create Post</Link></li>
                        <li key="myfollowingpost"><Link to="/myfollowingpost">My Following Posts</Link></li>
                        <li key="button">
                            <button className="btn waves-effect waves-light #c62828 red darken-3" onClick={() => {
                                localStorage.clear()
                                dispatch({ type: "CLEAR" })
                                navigate("/signin")
                            }}>
                                Logout
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

    return (<nav>
        <div className="nav-wrapper white" style={{ color: "black" }}>
            {matches ? renderList() : Sidebar(sidebar, showSidebar, setSidebar)}
        </div>
    </nav>
    )
}

export default NavBar