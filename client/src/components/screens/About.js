import React from 'react'
import VideoJS from './VideoJS'

const About = () => {
    return (
        <div className="card home-card" style={{ padding: '20px' }}>
            <h2 style={{ left: '50%' }}>About</h2>
            <h5>Thanks for visiting ICE Fit, please watch the below introductory video</h5>
            <VideoJS />
            <h3>How to get there</h3>
            <img width={window.innerWidth * .9} height={window.innerWidth * .6} style={{ maxWidth: '760px', maxHeight: '500px' }}
                src='https://res.cloudinary.com/dmla0lcbu/image/upload/v1655135674/GolLnS_FMap_buw7s6.png'
                alt="GolLnSFMap"
            />
            <h3>Share via QR Code</h3>
            <img width={window.innerWidth * .9} height={window.innerWidth * .9} style={{ maxWidth: '760px', maxHeight: '760px' }}
                src='https://res.cloudinary.com/dmla0lcbu/image/upload/v1655149027/IceFitQR_srduvm.png'
                alt="QR Code"
            />


            <p>
                This is a full stack react app for sports bookings made by Tom J.
            </p>
            <p>
                <strong>Version: </strong>1.0
            </p>
            <a href='https://github.com/deafult2010/icefit' >
                <img width='20px' height='20px'
                    src='https://res.cloudinary.com/dmla0lcbu/image/upload/v1655149434/GitHub-Mark-64px_cdwfkl.png'
                    alt="GithubLogo"
                />
                Check out the repo on Github


            </a>
            <div style={{ padding: '100px' }}></div>
        </div>
    );
}

export default About