import React from "react";
import {faPlay, faPause} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Reverse an AudioBuffer
function reverseBuffer(audioBuffer) {
    // Get the number of channels and length of the buffer
    const numChannels = audioBuffer.numberOfChannels;
    const bufferLength = audioBuffer.length;
  
    // Iterate through each channel and reverse the audio data
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      const tempBuffer = new Float32Array(channelData.length);
  
      for (let i = 0, j = bufferLength - 1; i < bufferLength; i++, j--) {
        tempBuffer[j] = channelData[i];
      }
  
      channelData.set(tempBuffer);
    }
  
    return audioBuffer;
}

function changePitch(audioBuffer: AudioBufferSourceNode, context: AudioContext, cents) {
    // Calculate the detuning value in cents
    const detune = cents * 100;
  
    // Set the detune value of the AudioBufferSourceNode
    audioBuffer.detune.setValueAtTime(detune, context.currentTime);
}

function convolve(source: AudioBufferSourceNode, audioContext: AudioContext, wave: string) {
    // Create a ConvolverNode and load an impulse response into it
    if (!wave) {return}
    const convolverNode = audioContext.createConvolver();
    const impulseUrl = `/impulse_waves/${wave}`;
    fetch(impulseUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(decodedBuffer => {
        convolverNode.buffer = decodedBuffer;
    })
    .catch(console.log);

    // Connect the sourceNode to the ConvolverNode and the AudioContext's destination
    source.connect(convolverNode);
    convolverNode.connect(audioContext.destination);
}

function dampen(source: AudioBufferSourceNode, context: AudioContext, Q = 1, cutoff = 1000) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = Q;
    source.connect(filter)
    filter.connect(context.destination)
}

const cloneBuffer = (original: AudioBuffer, context: AudioContext) => {
    const { numberOfChannels, length, sampleRate } = original
    const clone = context.createBuffer(numberOfChannels, length, sampleRate);
    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = original.getChannelData(channel);
        clone.getChannelData(channel).set(channelData);
    }
    return clone
}

export default function AudioPlayer (p: {url: string, options: {loop, pitch, reverse, impulseWave}, setStopper?: (stopper: () => any) => any}) {
    const [context, setContext] = React.useState(new AudioContext())
    const [audioBuffer, setAudioBuffer] = React.useState<AudioBuffer>()
    const [isPlaying, setIsPlaying] = React.useState(false)
    const innerReverse = React.useRef(false)

    const {options} = p
    const {loop, pitch, reverse, impulseWave} = options
    const sourceRef = React.useRef<AudioBufferSourceNode>()
    
    function stopAudio() {
        console.log('stopped')
        try {
            sourceRef.current?.disconnect()
            // sourceRef.current?.stop()
            context.suspend()
        } catch {console.log}
        setIsPlaying(false)
    }
    React.useEffect(() => {
        p.setStopper?.(() => {
            return stopAudio
        })
    }, [p.setStopper])
    
    const applyAudioMods = (force?) => {
        if (!sourceRef.current) {return}
        const source = sourceRef.current
        try {
            source.disconnect()
            source.connect(context.destination)
        } catch { console.log }
        options.pitch !== undefined && changePitch(source, context, parseInt(options.pitch));
        ((force && options.reverse) || (options.reverse !== innerReverse.current)) && reverseBuffer(source.buffer);
        innerReverse.current = options.reverse
        dampen(source, context, .001, 0)
        options.impulseWave && convolve(source, context, options.impulseWave)
        source.loop = options.loop
    }
    function play() {
        // stopAudio()
        if (!audioBuffer) { return }

        // const old = sourceRef.current
        const source = context.createBufferSource()
        sourceRef.current = source
        source.buffer = cloneBuffer(audioBuffer, context)
        
        applyAudioMods(true)
        console.log('began ')
        source.onended = () => {
            setTimeout(() => {
                console.log('ended')
                setIsPlaying(false)
            }, 100)
        }
        source.connect(context.destination)
        
        try {
            context.resume()
        } catch {console.log}
        
        source.start(0)
        setIsPlaying(true)
        
    }

    // React.useEffect(() => {
    //     console.log('playing ', isPlaying)
    // }, [isPlaying])
    
    React.useEffect(() => {
        console.log('options ', options)
        applyAudioMods()
    }, [options])

    

    React.useEffect(() => {
        stopAudio()
        fetch(`/api/audio?url=${encodeURIComponent(p.url)}`)
        .then(res => res.arrayBuffer())
        .then(res => context.decodeAudioData(res))
        // .then(context.decodeAudioData)
        .then(res => {
            setAudioBuffer(res)
        })
        .catch(error => {
            console.log(error)
            setAudioBuffer(undefined)
        })
    }, [p.url])

    return (
        <div>
            <button 
                onClick={isPlaying ? stopAudio : play}

            >
                <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                />
            </button>
        </div>
    )
}