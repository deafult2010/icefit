import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import M from 'materialize-css'

const SignIn = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const { token } = useParams()
    console.log(token)

    const onFormSubmit = e => {
        e.preventDefault();
        PostData();
    }

    const PostData = () => {
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                token: token
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#388e3c green darken-1" })
                    navigate('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <form onSubmit={onFormSubmit}>
                    <input
                        type="password"
                        placeholder="new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <button type="submit" className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}> */}
                    <button type="submit" className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignIn