import React, { useEffect, createContext, useReducer, useContext } from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/SignIn'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import UserProfile from './components/screens/UserProfile'
import CreatePost from './components/screens/CreatePost'
import Reset from './components/screens/Reset'
import NewPassword from './components/screens/NewPassword'
import { initialState, reducer } from './reducers/userReducers'

export const UserContext = createContext()

const Routing = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    } else {
      if (!location.pathname.startsWith('/reset')) {
        navigate('/signin')
      }
    }
    // eslint-disable-next-line
  }, [])
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route exact path="/profile/:userid" element={<UserProfile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route exact path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}


export default App;
