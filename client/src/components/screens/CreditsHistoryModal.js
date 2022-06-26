import React, { useState, useEffect, useRef, useContext } from 'react'
import M from 'materialize-css'
import axios from 'axios'
import { UserContext } from '../../App'
import moment from 'moment'
import { Link } from 'react-router-dom'

const CreditsHistoryModal = () => {

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
                                <p> WIP</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px' }}>
                                <h4>Events Played</h4>
                                {
                                    events.sort((a, b) => new Date(a.start) - new Date(b.start)).map(item => {
                                        return (
                                            <div>{item.attending.map(element => {
                                                // element._id === state._id && console.log(item)
                                                return (
                                                    <div>{element._id === state._id &&
                                                        <Link to={`/bookings#${item._id}`}>
                                                            {item.title} + {moment(item.start).format('ll')}
                                                        </Link>}</div>
                                                )
                                            })}</div>
                                        )

                                    })}
                                {/* {events} */}
                            </div>
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