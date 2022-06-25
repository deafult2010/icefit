import React, { useState, useRef, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import AddEventModal from './AddEventModal'
import axios from 'axios'
import moment from 'moment'
import M from 'materialize-css'

const Calendar = () => {

    const { state, dispatch } = useContext(UserContext)
    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)
    // console.log(events)

    useEffect(() => {
        console.log(events)
    }, [events])

    const onEventAdded = event => {
        const { title, start, end, color } = event
        if (!title || !start || !end || !color) {
            M.toast({ html: "please add all the fields", classes: "#c62828 red darken-3" })
            return
        }
        let calendarApi = calendarRef.current.getApi()
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: event.title,
            color: event.color,
            attending: [event.isChecked ? event.state._id : null]
        }, true)
    }

    const handleEventAdd = (data) => {
        axios.post('/create-event', data.event, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            setEvents([...events, response.data.event])
        }).catch(function (error) {
            if (error.response) {
                M.toast({ html: error.response.data.error, classes: "#c62828 red darken-3" })
            }
        });
    }

    const handleEventDelete = (id) => {
        axios.delete(`/delete-event/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((result) => {
            const newData = events.filter(item => {
                return item._id !== result.data.id
            })
            setEvents(newData)
        }).catch(function (error) {
            if (error.response) {
                M.toast({ html: error.response.data.msg, classes: "#c62828 red darken-3" })
                setEvents([...events])
            }
        });
    }


    const handleUpdateEventAdd = (id) => {
        axios.put(`/attend-event`, { eventId: id }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(result => {
            const newData = events.map(event => {
                if (event._id === result.data._id) {
                    return result.data
                } else {
                    return event
                }
            })
            setEvents(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleUpdateEventRemove = (id) => {
        axios.put(`/unattend-event`, { eventId: id }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(result => {
            const newData = events.map(event => {
                if (event._id === result.data._id) {
                    return result.data
                } else {
                    return event
                }
            })
            setEvents(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleDatesSet = (data) => {
        axios.get('/get-events?start=' + moment(data.start).toISOString() + '&end=' + moment(data.end).toISOString(), {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            if (data.error) {
                M.toast({ html: data.error, classes: "#c62828 red darken-3" })
            }
            else {
                setEvents(response.data)
            }
        })
    }

    const eventClick = (e) => {
        Alert.fire({
            title: e.event.title,
            html:
                `<div class="table-responsive">
          <table class="table">
          <tbody>
          <tr >
          <div style={{ display: 'flex' }}>
          <span>
          <td>Start Date</td>
          <td><strong>
          ` +
                moment(e.event.start).format('	ll') +
                `
          </strong></td>
          </span>
          <span>
          <td>End Date</td>
          <td><strong>
          ` +
                moment(e.event.end).format('	ll') +
                `
          </strong></td>
          </span>
        </div>
          </tr>
          <tr >
          <div style={{ display: 'flex' }}>
            <span>
            <td>Start Time</td>
            <td><strong>
            ` +
                moment(e.event.start).format('LT') +
                `
            </strong></td>
            </span>
            <span>
            <td>End Time</td>
            <td><strong>
            ` +
                moment(e.event.end).format('LT') +
                `
            </strong></td>
            </span>
          </div>
          </tr>
          <tr >
          <td>Title</td>
          <td><strong>` +
                e.event.title +
                `
          </strong></td>
          </tr>
          <tr >
          <td>Created By</td>
          <td><strong>` +
                e.event.extendedProps.user.name +
                `
          </strong></td>
          </tr>
          <tr >
          <td>Attending</td>
          <td><strong>
          ` +
                e.event.extendedProps.attending.map(item => {
                    return (
                        "<a href='https://icefit.herokuapp.com/profile/" + item._id + "'>" + item.name + "</a>"
                    )
                }) +
                // <a href='https://icefit.herokuapp.com/profile/${item._id}' >item.name</a>
                // <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} >{record.postedBy.name}</Link>
                `
          </strong></td>
          </tr>
          </tbody>
          </table>
          </div>`,

            showCancelButton: true,
            showDenyButton: true,
            showConfirmButton: state._id === e.event.extendedProps.user._id ? true : false,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            denyButtonColor: e.event.extendedProps.attending.findIndex(item => item._id === state._id) === -1 ? "#0ea60c" : "#d33",
            confirmButtonText: "Remove Event",
            cancelButtonText: "Close",
            // console.log(events.findIndex((item) => item._id === e.event.extendedProps._id))
            denyButtonText: e.event.extendedProps.attending.findIndex(item => item._id === state._id) === -1 ? "Attend" : "Leave",
            showLoaderOnDeny: true,
            preDeny: () => {
                e.event.extendedProps.attending.findIndex(item => item._id === state._id) === -1
                    ? handleUpdateEventAdd(e.event.extendedProps._id)
                    : handleUpdateEventRemove(e.event.extendedProps._id)
            }
        }).then(result => {
            if (result.value) {
                e.event.remove(); // It will remove event from the calendar
                handleEventDelete(e.event._def.extendedProps._id)
                Alert.fire("Deleted!", "Your Event has been deleted.", "success");
            } else if (result.isDenied) {
                console.log('123')
            }
        });
    };




    return (
        <div>
            <button data-target="modal2" className="modal-trigger" style={{ marginTop: "20px" }}>Add Event</button>
            <div style={{ position: "relative", zIndex: 0 }}>
                <FullCalendar
                    ref={calendarRef}
                    events={events}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    eventAdd={event => handleEventAdd(event)}
                    datesSet={(date) => handleDatesSet(date)}
                    eventClick={event => eventClick(event)}
                // editable={false}
                // selectable={true}
                />
            </div>
            <AddEventModal onEventAdded={e => onEventAdded(e)} />
        </div>
    )
}

export default Calendar