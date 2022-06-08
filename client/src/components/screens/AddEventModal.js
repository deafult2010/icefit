import React, { useState, useEffect, useRef } from 'react'
import M from 'materialize-css'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import DatePicker from 'react-datepicker'
import DropdownColor from './DropdownColor'

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {

    const [title, setTitle] = useState("")
    const [start, setStart] = useState(setHours(setMinutes(new Date(), 30), 16))
    const [end, setEnd] = useState(new Date())
    const [color, setColor] = useState("Blue")
    const searchModal = useRef(null)

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const onSubmit = (event) => {
        event.preventDefault();
        onEventAdded({
            title,
            start,
            end,
            color
        })
        onClose();
    }

    return (
        <>
            <div id="modal2" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <form onSubmit={onSubmit}>
                        <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}></input>
                        <div style={{ display: 'flex' }}>
                            <span>
                                <label>Start Date</label>
                                <DatePicker
                                    selected={start}
                                    onChange={(date) => setStart(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                />
                            </span>
                            <span>
                                <label>End Date</label>
                                <DatePicker
                                    selected={end}
                                    onChange={(date) => setEnd(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                />
                            </span>
                        </div>
                        <div>
                            <label>Event Color</label>
                            <DropdownColor color={color} setColor={setColor}></DropdownColor>
                        </div>
                        <button className="modal-close" style={{ marginTop: '10px' }}>Add Event</button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat">Close</button>
                </div>
            </div>
        </>
    )
}

export default AddEventModal