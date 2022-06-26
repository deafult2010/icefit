import React, { useState, useEffect, useRef, useContext } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import { UserContext } from '../../App'

const AddCreditsModal = () => {

    const [credits, setCredits] = useState(0)
    const addCreditsModal = useRef(null)
    const [isChecked, setIsChecked] = useState(true)
    const [isChecked2, setIsChecked2] = useState(false)

    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        M.Modal.init(addCreditsModal.current)
    }, [])

    const incNum = () => {
        if (credits < 10) {
            setCredits(Number(credits) + 1);
        }
    }

    const decNum = () => {
        if (credits > 0) {
            setCredits(credits - 1);
        }
    }


    const onSubmit = (e) => {
        setCredits(0)
        e.preventDefault();
        addCredits(credits)
    }

    const addCredits = (amt) => {
        axios.put(`/add-credits`, { credits: amt + state.credits }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(result => {
            console.log(result)
            localStorage.setItem("user", JSON.stringify({ ...state, credits: result.data.credits }))
            dispatch({ type: "UPDATECREDITS", payload: result.data.credits })
        }).catch(err => {
            console.log(err)
        })
    }


    return (
        <>
            <div id="modal2" className="modal" ref={addCreditsModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <form onSubmit={onSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                            <h3>Add Credits</h3>
                            <div style={{ display: 'flex', fontSize: '20px' }}>
                                <div>
                                    <button className="btn #64b5f6 blue darken-1" type="button" onClick={decNum}>-</button>
                                </div>
                                <input type="text" className="form-control" style={{ width: '30px', pointerEvents: 'none', border: 'solid', textAlign: 'center', height: '30px' }} value={credits} onChange={(e) => { setCredits(e.target.value) }} />
                                <div>
                                    <button className="btn #64b5f6 blue darken-1" type="button" onClick={incNum}>+</button>
                                </div>
                                <div>
                                    &nbsp;&nbsp;Cost: £{credits * 2.00}.00
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'left', gap: '10px' }}>
                                <p >
                                    <label>
                                        <input style={{
                                            color: "#000000"
                                        }} type="checkbox" className="filled-in" checked={isChecked} onChange={(e) => { setIsChecked(e.currentTarget.checked); setIsChecked2(!e.currentTarget.checked) }} />
                                        <span>Paid in person</span>
                                    </label>
                                </p>
                                <p >
                                    <label>
                                        <input style={{
                                            color: "#000000"
                                        }} type="checkbox" className="filled-in" checked={isChecked2} onChange={(e) => { setIsChecked2(e.currentTarget.checked); setIsChecked(!e.currentTarget.checked) }} />
                                        <span>Pay by card</span>
                                    </label>
                                </p>
                            </div>
                            <div style={{ display: 'flex', fontSize: '20px', gap: '10px' }}>
                                {isChecked
                                    ? <button className="modal-close btn-small #43a047 green darken-2">Confirm</button>
                                    : <button className="btn-small #9e9e9e grey" disabled>Pay</button>}
                                <button className="modal-close btn-small #f44336 red" onClick={(e) => { e.preventDefault(); setCredits(0) }}>Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddCreditsModal