import React, { useEffect, useRef } from 'react'
import M from 'materialize-css'
import styled from 'styled-components';

const DropdownDiv = styled.div`
  display: flex;
  color: #000000;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 20px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #64b5f6;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;


const DropdownPosts = ({ selected, setSelected }) => {

    const dropdown = useRef(null)

    useEffect(() => {
        M.Dropdown.init(dropdown.current)
    }, [])

    return (
        <div style={{ margin: 'auto 0 auto 0' }}>
            <div className='dropdown-trigger btn #64b5f6 blue darken-1' style={{ display: 'flex', width: '120px', justifyContent: 'space-between' }} data-target='dropdown1' ref={dropdown}><span>{selected}</span><span className="material-icons" style={{ marginTop: '5px' }}>arrow_drop_down</span></div>
            <ul id='dropdown1' className='dropdown-content' style={{ display: 'flex' }}>
                <DropdownDiv onClick={e => { setSelected(e.target.textContent) }}>All</DropdownDiv>
                <li className="divider" tabIndex="-1"></li>
                <DropdownDiv onClick={e => { setSelected(e.target.textContent) }}>Events</DropdownDiv>
                <DropdownDiv onClick={e => { setSelected(e.target.textContent) }}>Followed</DropdownDiv>
            </ul>
        </div>
    )

}

export default DropdownPosts