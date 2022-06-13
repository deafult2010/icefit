import React from 'react'
import ReactPlayer from 'react-player'


const VideoJS = () => {
    console.log(window.innerWidth)

    return (
        <div data-vjs-player>
            <ReactPlayer
                url='https://youtu.be/ec-DSsYTAu4' muted={false} playing={false} controls={true} width={window.innerWidth * .9} height={window.innerWidth * .6} style={{ maxWidth: '760px', maxHeight: '500px' }} />
        </div>
    )
}

export default VideoJS