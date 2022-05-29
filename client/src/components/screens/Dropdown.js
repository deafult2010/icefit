import React, { useState } from 'react'

const Dropdown = ({ selected, setSelected }) => {

    const [isActive, setIsActive] = useState(false)
    return (
        <div className='dropdown'>
            <div className='dropdown-btn' onClick={e => setIsActive(!isActive)}>{selected}<i className="material-icons">arrow_drop_down</i></div>
            {isActive && (
                <div className='dropdown-contents'>
                    <div onClick={e => { setSelected(e.target.textContent); setIsActive(false) }} className='dropdown-item'>All</div>
                    <div onClick={e => { setSelected(e.target.textContent); setIsActive(false) }} className='dropdown-item'>Events</div>
                    <div onClick={e => { setSelected(e.target.textContent); setIsActive(false) }} className='dropdown-item'>Followed</div>
                </div>
            )}

        </div>
    )

}

export default Dropdown