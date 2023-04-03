import React from "react";

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

const cloneBuffer = (original: AudioBuffer, context: AudioContext) => {
    const { numberOfChannels, length, sampleRate } = original
    const clone = context.createBuffer(numberOfChannels, length, sampleRate);
    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = original.getChannelData(channel);
        clone.getChannelData(channel).set(channelData);
    }
    return clone
}

export default function AudioPlayer (p: {url: string, options: {pitch, reverse, impulseWave}}) {
    const [context, setContext] = React.useState(new AudioContext())
    const [audioBuffer, setAudioBuffer] = React.useState<AudioBuffer>()

    const {options} = p
    const sourceRef = React.useRef<AudioBufferSourceNode>()
    

    function play() {
        if (!audioBuffer) { return }
        try {
            sourceRef.current?.stop()
        } catch {
            console.log('no other audio is currently playing')
        }

        const source = context.createBufferSource()
        sourceRef.current = source
        source.buffer = cloneBuffer(audioBuffer, context)

        options.pitch !== undefined && changePitch(source, context, options.pitch);
        options.reverse && reverseBuffer(source.buffer);
        options.impulseWave && convolve(source, context, options.impulseWave)

        source.connect(context.destination)
        source.start()
    }

    React.useEffect(() => {
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
            <button onClick={play}>
                Play
            </button>
        </div>
    )
}