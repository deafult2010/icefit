import React, { useState, useEffect, useRef, useContext } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import getMinutes from 'date-fns/setMinutes'
import DatePicker from 'react-datepicker'
import DropdownColor from './DropdownColor'

const AddEventModal = ({ isOpen, onClose, onEventAdded }) => {

    const { state, dispatch } = useContext(UserContext)
    const [title, setTitle] = useState("")
    const [start, setStart] = useState(setHours(setMinutes(new Date(), 30), 16))
    const [end, setEnd] = useState(new Date())
    const [color, setColor] = useState("Blue")
    const searchModal = useRef(null)
    const [isChecked, setIsChecked] = useState(true)
    const [isChecked2, setIsChecked2] = useState(false)



    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    useEffect(() => {
        start !== null & !isChecked2 && setEnd(new Date(start.getTime() + 60 * 60000))
    }, [start])



    const onSubmit = (e) => {
        setTitle("")
        setIsChecked(true)
        e.preventDefault();
        onEventAdded({
            title,
            start,
            end,
            color,
            state,
            isChecked
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
                                {/* <label>{state._id}</label> */}
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
                                    disabled={!isChecked2}
                                />
                            </span>
                            <span style={{ margin: 'auto 0 auto 0' }}>
                                <label >
                                    <input style={{
                                        color: "#000000"
                                    }} type="checkbox" className="filled-in" checked={isChecked2} onChange={(e) => setIsChecked2(e.currentTarget.checked)} />
                                    <span> More than one hour?</span>
                                </label>
                            </span>
                        </div>
                        <div>
                            <label>Event Color</label>
                            <DropdownColor color={color} setColor={setColor}></DropdownColor>
                        </div>
                        <p >
                            <label>
                                <input style={{
                                    color: "#000000"
                                }} type="checkbox" className="filled-in" checked={isChecked} onChange={(e) => setIsChecked(e.currentTarget.checked)} />
                                <span>Add yourself to event</span>
                            </label>
                        </p>
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