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

function changePitch(audioBuffer, context: AudioContext, cents) {
    // Calculate the detuning value in cents
    const detune = cents * 100;
  
    // Set the detune value of the AudioBufferSourceNode
    audioBuffer.detune.setValueAtTime(detune, context.currentTime);
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

export default function(p: {url: string, pitch?, reverse?: boolean}) {
    const [context, setContext] = React.useState(new AudioContext())
    const [audioBuffer, setAudioBuffer] = React.useState<AudioBuffer>()


    function play() {
        if (!audioBuffer) { return }

        const source = context.createBufferSource()
        source.buffer = cloneBuffer(audioBuffer, context)

        p.pitch !== undefined && changePitch(source, context, p.pitch);
        p.reverse && reverseBuffer(source.buffer);

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
        // .then(console.log)
    }, [p.url])

    return (
        <div>
            <button onClick={play}>
                Play
            </button>
        </div>
    )
}