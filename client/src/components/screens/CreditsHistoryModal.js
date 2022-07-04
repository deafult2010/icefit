import React, { useState, useEffect, useRef, useContext } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import { UserContext } from '../../App'
import moment from 'moment'

const CreditsHistoryModal = ({ played }) => {

    const creditsHistoryModal = useRef(null)
    const [events, setEvents] = useState([])

    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        M.Modal.init(creditsHistoryModal.current)
    }, [])

    useEffect(() => {
        axios.get('/get-events', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            setEvents(response.data)
        })
    }, []);

    return (
        <>
            <div id="modal3" className="modal" ref={creditsHistoryModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                        <h3>Credits History</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px' }}>
                                <h4>Payments Made</h4>
                                <ul>
                                    <li style={{ display: 'flex', alignItems: 'center', textAlign: 'right' }}>New Joiner's Credit + 1 <span className="material-icons">stars</span></li>
                                    <li style={{ display: 'flex', alignItems: 'center' }}>Credits Purchased  &nbsp;  &nbsp;+ {state.credits - 1} <span className="material-icons">stars</span></li>
                                </ul>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px' }}>
                                <h4>Events Played</h4>
                                {
                                    events.sort((a, b) => new Date(a.start) - new Date(b.start)).map(item => {
                                        if (moment(item.start).valueOf() < Date.now()) {
                                            return (
                                                <div>{
                                                    item.attending.map(element => {
                                                        // element._id === state._id && console.log(item)
                                                        return (
                                                            <div>{element._id === state._id &&
                                                                <a href={'/bookings#' + item._id}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                        <div>{item.title} </div>
                                                                        <div style={{ color: '#aaa' }}> - {moment(item.start).format('ll')}</div>
                                                                    </div>
                                                                </a>}</div>
                                                        )
                                                    })}</div>
                                            )
                                        }
                                    })}
                                {/* {events} */}
                            </div>
                        </div>
                        <h6 style={{ marginBottom: '0px' }}>Subtotal</h6>
                        <hr style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>+{state.credits}<i className="material-icons">stars</i></div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>-{played}<i className="material-icons">stars</i></div>
                        </div>
                        <h6 style={{ marginBottom: '0px' }}>Total</h6>
                        <hr style={{ width: '100%' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '20px' }}>
                            <div>&nbsp;</div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '55px' }}> &nbsp; {state.credits - played}<i className="material-icons medium">stars</i></div>
                        </div>

                        <div style={{ display: 'flex', fontSize: '20px', gap: '10px' }}>
                            <button className="modal-close btn-small #f44336 red" onClick={(e) => { e.preventDefault(); }}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreditsHistoryModal