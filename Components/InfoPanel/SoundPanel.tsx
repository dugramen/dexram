import React from "react";
import { pkData } from "../DexData";

export default function SoundPanel(props: {id}) {
    const [loop, setLoop] = React.useState(false)
    const [playbackRate, setPlaybackRate] = React.useState(1.0)
    const audioRef = React.useRef<any>(null)
    // const [context, setContext] = React.useState(new AudioContext())

    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate
        }
    }, [playbackRate, audioRef.current, props.id])

    return (
        <div className="SoundPanel">
            <audio
                controls
                src={`https://play.pokemonshowdown.com/audio/cries/${pkData[props.id]?.pokemon?.identifier}.mp3`}
                loop={loop}
                ref={audioRef}
            />

            <label> 
                <input
                    type={'checkbox'}
                    checked={loop}
                    onChange={e => setLoop(e.target.checked)}
                ></input>
                Loop? 
            </label>

            <input
                type='range'
                min={0.5}
                max={2.0}
                step={0.1}
                
                value={playbackRate}
                onChange={event => setPlaybackRate(parseFloat(event.target.value))}
            />
        </div>
    )
}