import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import Sidebar from './SideBar'
import Search from './Search'
import Logo from './Logo'

const NavBar = () => {
    const { state, dispatch } = useContext(UserContext)
    const [sidebar, setSidebar] = useState(false);
    const showSidebar = () => setSidebar(!sidebar);
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 700px)").matches
    )
    const navigate = useNavigate()

    useEffect(() => {
        window
            .matchMedia("(min-width: 700px)")
            .addEventListener('change', e => setMatches(e.matches));
    }, []);


    const renderList = () => {
        if (state) {
            return [
                <>
                    <Link to={state ? "/" : "/signin"} className="brand-logo left">{Logo()}</Link>
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
                    <Link to={state ? "/" : "/signin"} className="brand-logo left">{Logo()}</Link>
                    <ul id="nav-mobile" className="right">
                        <li key="signin"><Link to="/signin" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons" >login</span>Login</Link></li>
                        <li key="signup"><Link to="/signup" style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons" >person_add</span>Signup</Link></li>
                        <li key="about"><Link to='/about' style={{ display: 'flex', alignItems: 'center', padding: '0 8px 0 8px' }}><span className="material-icons" >help_outline</span> About</Link></li>
                    </ul>
                </>
            ]
        }
    }

    return (<nav>
        <div className="nav-wrapper white" style={{ color: "black" }}>
            {matches ? renderList() : Sidebar(sidebar, showSidebar, setSidebar)}
        </div>
        <Search />
    </nav >
    )
}

export default NavBar