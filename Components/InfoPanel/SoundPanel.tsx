import React from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import { pkData } from "../DexData";
import { cacheFetch } from "../Utils";

export default function SoundPanel(props: {id}) {
    const [loop, setLoop] = React.useState(false)
    const [playbackRate, setPlaybackRate] = React.useState(1.0)
    const [options, setOptions] = React.useState({
        loop: false,
        reverse: false,
        pitch: 0,
        impulseWave: '',
    })
    const [impulseWaves, setImpulseWaves] = React.useState([])
    const [stopper, setStopper] = React.useState<() => any>()
    const audioRef = React.useRef<any>(null)
    // const [context, setContext] = React.useState(new AudioContext())

    React.useEffect(() => {
        cacheFetch('/api/impulse_waves')
        .then(res => res?.json())
        .then(list => setImpulseWaves(list))
        .catch(console.log)
        return () => {
            setImpulseWaves([])
        }
    }, [])

    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate
        }
    }, [playbackRate, audioRef.current, props.id])

    return (
        <div className="SoundPanel">
            <AudioPlayer
                url={`https://play.pokemonshowdown.com/audio/cries/${pkData[props.id]?.pokemon?.identifier}.mp3`}
                // convolver={true}
                options={options}
                setStopper={setStopper}
                // url="https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3"
                // pitch={15}
            />

            <button onClick={() => stopper?.()}>
                Stop
            </button>

            <select 
                onChange={e => setOptions(old => ({...old, impulseWave: e.target.value})) }
                value={options.impulseWave}
            >
                <option value={''}>---</option>
                {impulseWaves.map(wave => <option key={wave} value={wave}>{wave}</option>)}
            </select>

            {/* <audio
                controls
                src={`https://play.pokemonshowdown.com/audio/cries/${pkData[props.id]?.pokemon?.identifier}.mp3`}
                loop={loop}
                ref={audioRef}
            /> */}

            <label> 
                <input
                    type={'checkbox'}
                    checked={options.loop}
                    onChange={e => setOptions(old => ({...old, loop: e.target.checked}))}
                ></input>
                Loop? 
            </label>

            <label> 
                <input
                    type={'checkbox'}
                    checked={options.reverse}
                    onChange={e => setOptions(old => ({...old, reverse: e.target.checked}))}
                ></input>
                Reverse? 
            </label>

            <label>{options.pitch}</label>
            <input
                type='range'
                min={-25}
                max={25}
                step={1}
                
                value={options.pitch}
                onChange={event => setOptions(old => ({
                    ...old,
                    pitch: parseInt(event.target.value)
                }))}
            />
        </div>
    )
}