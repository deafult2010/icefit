import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    const onFormSubmit = e => {
        e.preventDefault();
        PostData();
    }

    const PostData = () => {
        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        }).then(res => res.json())
            .then(data => {
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
                        type="text"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {/* <button type="submit" className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}> */}
                    <button type="submit" className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Reset