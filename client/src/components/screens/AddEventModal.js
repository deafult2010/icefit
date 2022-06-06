import React, { useState, useEffect, useRef } from 'react'
import M from 'materialize-css'
import DateTime from 'react-datetime'
import DropdownColor from './DropdownColor'

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {

    const [title, setTitle] = useState("")
    const [start, setStart] = useState(new Date())
    const [end, setEnd] = useState(new Date())
    const [color, setColor] = useState("No Color")
    const searchModal = useRef(null)

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const onSubmit = (event) => {
        event.preventDefault();
        onEventAdded({
            title,
            start,
            end
        })
        onClose();
    }

    return (
        <>
            <div id="modal2" className="modal" ref={searchModal} style={{ color: "black" }}>
                <div className="modal-content">
                    <form onSubmit={onSubmit}>
                        <input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)}></input>
                        <div>
                            <label>Start Date</label>
                            <DateTime value={start} onChange={date => setStart(date)} />
                        </div>
                        <div>
                            <label>End Date</label>
                            <DateTime value={end} onChange={date => setEnd(date)} />
                        </div>
                        <div>
                            <label>Event Color</label>
                            <DropdownColor color={color} setColor={setColor}></DropdownColor>
                        </div>
                        {/* <input placeholder='Color' value={color} onChange={e => setColor(e.target.value)}></input> */}
                        <button>Add Event</button>
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