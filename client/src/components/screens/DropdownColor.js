import React, { useState, useEffect, useRef } from 'react'
import M from 'materialize-css'
import styled from 'styled-components';

const DropdownDiv = styled.div`
  display: flex;
  color: #000000;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #64b5f6 blue darken-1;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;


const DropdownColor = ({ color, setColor }) => {

    const dropdown = useRef(null)
    const [colorHex, setColorHex] = useState('#2196f3 blue')
    console.log(color)

    useEffect(() => {
        if (color === 'No Color') {
            setColorHex('#9e9e9e grey')
        } else if (color === 'Red') {
            setColorHex('#f44336 red')
        } else if (color === 'Orange') {
            setColorHex('#ff9800 orange')
        } else if (color === 'Yellow') {
            setColorHex('#ffd600 yellow accent-4')
        } else if (color === 'Green') {
            setColorHex('#4caf50 green')
        } else if (color === 'Blue') {
            setColorHex('#2196f3 blue')
        } else if (color === 'Purple') {
            setColorHex('#9c27b0 purple')
        } else if (color === 'Pink') {
            setColorHex('#ff4081 pink accent-2')
        }
        else setColorHex('#2196f3 blue')
        console.log(color)
        console.log(colorHex)
    }, [color])

    useEffect(() => {
        M.Dropdown.init(dropdown.current)
    }, [])

    return (
        <div style={{ margin: 'auto 0 auto 0' }}>
            <div className={'dropdown-trigger btn ' + colorHex} style={{ display: 'flex', width: '180px', justifyContent: 'space-between' }} data-target='dropdown2' ref={dropdown}><span>{color}</span><span className="material-icons" style={{ marginTop: '5px' }}>arrow_drop_down</span></div>
            <ul id='dropdown2' className='dropdown-content' style={{ display: 'flex' }}>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Blue<span className="material-icons" >color_lens</span></DropdownDiv>
                <li className="divider" tabIndex="-1"></li>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Red<span className="material-icons" >color_lens</span></DropdownDiv>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Orange<span className="material-icons" >color_lens</span></DropdownDiv>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Yellow<span className="material-icons" >color_lens</span></DropdownDiv>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Green<span className="material-icons" >color_lens</span></DropdownDiv>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Purple<span className="material-icons" >color_lens</span></DropdownDiv>
                <DropdownDiv onClick={e => { setColor(e.target.textContent.substring(0, e.target.textContent.length - 10)) }}>Pink<span className="material-icons" >color_lens</span></DropdownDiv>
            </ul>
        </div>
    )

}

export default DropdownColor