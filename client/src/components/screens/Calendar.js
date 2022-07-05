import React, { useState, useRef, useContext, useEffect } from 'react'
import { UserContext } from '../../App'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import Alert from "sweetalert2";
import AddEventModal from './AddEventModal'
import axios from 'axios'
import moment from 'moment'
import M from 'materialize-css'
import { useLocation, useNavigate } from 'react-router-dom'

const Calendar = () => {

    const { state, dispatch } = useContext(UserContext)
    const [events, setEvents] = useState([])
    const [users, setUsers] = useState([])
    const calendarRef = useRef(null)
    const { hash } = useLocation();
    const navigate = useNavigate()

    console.log(events)
    console.log(users)

    useEffect(() => {
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: ''
            })
        }).then(res => res.json())
            .then((response) => {
                setUsers(response)
            })
    }, []);

    useEffect(() => {
        const calendarApi = calendarRef.current.getApi()
        const data = calendarApi.getEvents()
        if (events.length > 0) {
            data.forEach(item => {
                if (item._def.extendedProps._id === hash.substring(1)) {
                    console.log(item)
                    const e = {};
                    e.event = item;
                    eventClick(e)
                }
            })
        }
        // eslint-disable-next-line
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
        // if (data.event.title === 'dummy2') {
        //     return
        // }
        axios.post('/create-event', data.event, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((response) => {
            setEvents([...events, response.data.event])
        }).catch(function (error) {
            if (error.response) {
                M.toast({ html: error.response.data.error, classes: "#c62828 red darken-3" })
                console.log('ssssssss')
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
        // axios.get('/get-events?start=' + moment(data.start).toISOString() + '&end=' + moment(data.end).toISOString(), {
        axios.get('/get-events', {
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

    const handleUpdateResults = (event) => {
        console.log(users)
        let i = 0
        let w = 0
        let l = 0
        let K = 32
        let RA1 = 0
        let RB1 = 0
        let QA = 0
        let QB = 0
        let EA = 0
        let EB = 0
        let RA2 = 0
        let RB2 = 0
        let winners = []
        let losers = []
        event.extendedProps.attending.forEach(item => {
            const player = users.user.find(el => el._id === item._id)
            if (document.getElementById(item._id + 'WCB').checked === true & document.getElementById(item._id + 'LCB').checked === true) {
                i += 1
                console.log('check')
            }
            if (document.getElementById(item._id + 'WCB').checked) {
                w += 1
                if (event.title === 'Badminton') {
                    RA1 += player.badmintonRating
                } else if (event.title === 'Tennis') {
                    RA1 += player.tennisRating
                } else if (event.title === 'Table Tennis') {
                    RA1 += player.tableTennisRating
                } else if (event.title === 'Chess') {
                    RA1 += player.chessRating
                }
            } else if (document.getElementById(item._id + 'LCB').checked) {
                l += 1
                if (event.title === 'Badminton') {
                    RB1 += player.badmintonRating
                } else if (event.title === 'Tennis') {
                    RB1 += player.tennisRating
                } else if (event.title === 'Table Tennis') {
                    RB1 += player.tableTennisRating
                } else if (event.title === 'Chess') {
                    RB1 += player.chessRating
                }
            }
        })
        if (i > 0) {
            M.toast({ html: "One cannot be both a winner and a loser", classes: "#c62828 red darken-3" })
            return
        }
        QA = 10 ^ ((RA1 / w) / 400)
        QB = 10 ^ ((RB1 / l) / 400)
        EA = QA / (QA + QB)
        EB = QB / (QA + QB)
        RA2 = K * (1 - EA)
        RB2 = K * (-EB)
        event.extendedProps.attending.forEach(item => {
            const player = users.user.find(el => el._id === item._id)
            if (document.getElementById(item._id + 'WCB').checked) {
                winners.push(item._id)
                w += 1
                if (event.title === 'Badminton') {
                    player.badmintonRating += Math.round(RA2)
                } else if (event.title === 'Tennis') {
                    player.tennisRating += Math.round(RA2)
                } else if (event.title === 'Table Tennis') {
                    player.tableTennisRating += Math.round(RA2)
                } else if (event.title === 'Chess') {
                    player.chessRating += Math.round(RA2)
                }
            } else if (document.getElementById(item._id + 'LCB').checked) {
                losers.push(item._id)
                l += 1
                if (event.title === 'Badminton') {
                    player.badmintonRating += Math.round(RB2)
                } else if (event.title === 'Tennis') {
                    player.tennisRating += Math.round(RB2)
                } else if (event.title === 'Table Tennis') {
                    player.tableTennisRating += Math.round(RB2)
                } else if (event.title === 'Chess') {
                    player.chessRating += Math.round(RB2)
                }
            }
            axios.put(`/updateRating`, { player: player }, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            }).then(result => {
                console.log(result)
                if (state._id === item._id) {
                    localStorage.setItem("user", JSON.stringify({ ...state, badmintonRating: result.data.badmintonRating, tennisRating: result.data.tennisRating, tableTennisRating: result.data.tableTennisRating, chessRating: result.data.chessRating }))
                    dispatch({ type: "UPDATERATING", payload: { badmintonRating: result.data.badmintonRating, tennisRating: result.data.tennisRating, tableTennisRating: result.data.tableTennisRating, chessRating: result.data.chessRating } })
                }
            }).catch(err => {
                console.log(err)
            })
        })
        axios.put(`/updateEvent`, { event: event, winners: winners, losers: losers }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(result => {
            console.log(result)
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


    const eventClick = (e) => {
        const today = new Date().getTime()
        let rated = 'No'
        if (e.event.extendedProps.winners.length + e.event.extendedProps.winners.length > 0) { rated = 'Yes' }
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
          <td>Rated</td>
          <td><strong>${rated}</strong></td>
          </tr>
          <tr >
          <td>Attending</td>
          <td colspan="2"><strong>
          <p style="height: 1px"/>
          ` +
                e.event.extendedProps.attending.map(item => {
                    return (
                        `<li style="height: 24px"><a href='https://icefit.herokuapp.com/profile/` + item._id + "'>" + item.name + `</a></li>`
                    )
                }).join(' ') +
                // <a href='https://icefit.herokuapp.com/profile/${item._id}' >item.name</a>
                // <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} >{record.postedBy.name}</Link>
                `
          </strong></td>
          <td  style="padding: 0px">
                <ul style={{listStyle: 'none'}}>&nbsp;&nbsp;&nbsp;R &nbsp;&nbsp;&nbsp;&nbsp; W &nbsp;&nbsp;&nbsp;&nbsp; L
                ` +
                e.event.extendedProps.attending.map(item => {
                    console.log(e.event)
                    let rating = null
                    let win = ''
                    let lose = ''
                    console.log(e.event.title)
                    if (e.event.title === "Badminton") {
                        rating = users.user.find(el => el._id === item._id).badmintonRating
                    } else if (e.event.title === "Tennis") {
                        rating = users.user.find(el => el._id === item._id).tennisRating
                    } else if (e.event.title === "Table Tennis") {
                        rating = users.user.find(el => el._id === item._id).tableTennisRating
                    } else if (e.event.title === "Chess") {
                        rating = users.user.find(el => el._id === item._id).chessRating
                    }
                    if (e.event.extendedProps.winners.find(el => el === item._id)) {
                        win = 'checked="checked"'
                    }
                    if (e.event.extendedProps.losers.find(el => el === item._id)) {
                        lose = 'checked="checked"'
                    }
                    if (state._id === e.event.extendedProps.user._id & moment(e.event.start).valueOf() < Date.now()) {

                        return (
                            `
                        <li >
                        <label style="text-align: center; line-height: 150%; font-size: 1em; vertical-align: top;" >`+ rating + `&nbsp;&nbsp;</label>
                        <label for="${item._id}WCB">
                        <input style="color: #000000;" type="checkbox" class="filled-in" value="" id="${item._id}WCB" ${win}/>
                            <span style={{height: "0px !important"}} > </span>
                        </label>
                        
                        <label for="${item._id}LCB">
                        <input style="color: #000000;" type="checkbox" class="filled-in" value="" id="${item._id}LCB" ${lose}/>
                            <span style={{height: "0px !important"}} > </span>
                        </label>
                        </li>
                        
                        `
                        )
                    } else {
                        return (
                            `
                                <li >
                                <label style="text-align: center; line-height: 150%; font-size: 1em; vertical-align: top;" >`+ rating + `&nbsp;&nbsp;</label>
                                <label >
                                    <input style={{
                                        color: "#000000"
                                    }} type="checkbox" class="filled-in" ${win} disabled=true />
                                    <span style={{height: "0px !important"}} > </span>
                                </label>
                                
                                <label >
                                    <input style={{
                                        color: "#000000"
                                    }} type="checkbox" class="filled-in" ${lose} disabled=true />
                                    <span style={{height: "0px !important"}} > </span>
                                </label>
                                </li>
                                
                                `
                        )
                    }
                }).join(' ') +
                // <a href='https://icefit.herokuapp.com/profile/${item._id}' >item.name</a>
                // <Link to={record.postedBy._id !== state._id ? "/profile/" + record.postedBy._id : "/profile"} >{record.postedBy.name}</Link>
                `
                </ul>
          </td>
          </tr>
          </tbody>
          </table>
          </div>`,

            showCancelButton: true,
            showDenyButton: moment(e.event.start).valueOf() > today ? true : state._id === e.event.extendedProps.user._id ? true : false,
            showConfirmButton: state._id === e.event.extendedProps.user._id ? true : false,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            denyButtonColor: moment(e.event.start).valueOf() < today ? "#3085d6" : e.event.extendedProps.attending.findIndex(item => item._id === state._id) === -1 ? "#0ea60c" : "#d33",
            confirmButtonText: "Remove Event",
            cancelButtonText: "Close",
            // console.log(events.findIndex((item) => item._id === e.event.extendedProps._id))
            denyButtonText: moment(e.event.start).valueOf() < today & state._id === e.event.extendedProps.user._id ? "Update Results" : e.event.extendedProps.attending.findIndex(item => item._id === state._id) === -1 ? "Attend" : "Leave",
            showLoaderOnDeny: true,
            preDeny: () => {
                moment(e.event.start).valueOf() < today ? handleUpdateResults(e.event) :
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
            navigate('/bookings')
        });
    };



    events.forEach(item => {
        item.attending.forEach(element => {
            if (element._id === state._id) {
                item.classNames = [`pill-${item.borderColor}`]
            }
        })
    })

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