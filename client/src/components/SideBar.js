import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserContext } from '../App'
import Search from './Search'

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const Nav = styled.div`
  background: #15171c;
  height: 65px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffffff;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #ffffff;
`;

const SidebarNav = styled.nav`
  color: #ffffff;
  background: #15171c;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  top: ${({ sidebar }) => (sidebar ? '0' : '-150%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = (sidebar, showSidebar, setSidebar) => {
    const { state, dispatch } = useContext(UserContext)
    return (
        <>
            <Nav>
                <NavIcon to='#'>
                    <div className="material-icons" style={{ color: "#ffffff", fontSize: "50px" }} onClick={showSidebar}>menu</div>
                </NavIcon>
            </Nav>
            <SidebarNav sidebar={sidebar}>
                <SidebarWrap>
                    <NavIcon to='#'>
                        <div className="material-icons" style={{ color: "#ffffff", fontSize: "40px" }} onClick={showSidebar}>close</div>
                    </NavIcon>
                    {state ?
                        <>
                            <SidebarLink to={'/'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >home</span> Home
                                </div>
                            </SidebarLink>
                            {/* <SidebarLink to="#" onClick={showSidebar} data-target="modal1" className='modal-trigger'>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >search</span> Search Users
                                </div>
                            </SidebarLink> */}
                            <SidebarLink to={'/bookings'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >event</span> Bookings
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/profile'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >person_pin</span> Profile
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/ratings'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >fitness_center</span> Ratings
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/create'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >message</span> Create Post
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/about'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >help_outline</span> About
                                </div>
                            </SidebarLink>
                            <SidebarLink to={"/signin"} onClick={() => {
                                showSidebar()
                                localStorage.clear()
                                dispatch({ type: "CLEAR" })
                            }} >
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >logout</span> Logout
                                </div>
                            </SidebarLink>
                        </>
                        :
                        <>
                            <SidebarLink to={'/signin'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >login</span> Signin
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/signup'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff", display: "inline" }}>
                                    <span className="material-icons" >person_add</span> Signup
                                </div>
                            </SidebarLink>
                            <SidebarLink to={'/about'} onClick={showSidebar}>
                                <div style={{ color: "#ffffff" }}>
                                    <span className="material-icons" >help_outline</span> About
                                </div>
                            </SidebarLink>
                        </>
                    }
                </SidebarWrap>
            </SidebarNav>
            <Search />
        </>
    );
};

export default Sidebar;