import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import AddEventModal from './AddEventModal'
import axios from 'axios'
import moment from 'moment'
import M from 'materialize-css'

const Calendar = () => {

    const [events, setEvents] = useState([])
    const calendarRef = useRef(null)

    const onEventAdded = event => {
        const { title, start, end } = event
        if (!title || !start || !end) {
            M.toast({ html: "please add all the fields", classes: "#c62828 red darken-3" })
            return
        }
        let calendarApi = calendarRef.current.getApi()
        calendarApi.addEvent({
            start: moment(event.start).toDate(),
            end: moment(event.end).toDate(),
            title: event.title
        })
    }

    const handleEventAdd = (data) => {
        axios.post('/create-event', data.event, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).catch(function (error) {
            if (error.response) {
                M.toast({ html: error.response.data.error, classes: "#c62828 red darken-3" })
            }
        });
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

    const eventClick = (eventClick) => {
        Alert.fire({
            title: eventClick.event.title,
            html:
                `<div class="table-responsive">
          <table class="table">
          <tbody>
          <tr >
          <td>Title</td>
          <td><strong>` +
                eventClick.event.title +
                `</strong></td>
          </tr>
          <tr >
          <td>Start Time</td>
          <td><strong>
          ` +
                eventClick.event.start +
                `
          </strong></td>
          </tr>
          </tbody>
          </table>
          </div>`,

            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Remove Event",
            cancelButtonText: "Close"
        }).then(result => {
            if (result.value) {
                eventClick.event.remove(); // It will remove event from the calendar
                Alert.fire("Deleted!", "Your Event has been deleted.", "success");
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
                // selectable={false}
                />
            </div>
            <AddEventModal onEventAdded={event => onEventAdded(event)} />
        </div>
    )
}

export default Calendar