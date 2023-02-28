import React from 'react';

export default function DualRangeSlider(props: {minVal, maxVal, minRange, maxRange, onChange?}) {
    const [front, setFront] = React.useState(0)

    const coloredPercent = [
        (props.maxVal - props.minVal)/(props.maxVal - props.minRange),
        (props.maxVal - props.minVal)/(props.maxRange - props.minVal),
    ]
    const color = '#5B7899'
    const mid = i => `calc(${100*coloredPercent[i]}% + 8px - ${16 * coloredPercent[i]}px)`

    return (
        <div className='dual-range-slider'>
            <input 
                type='range'
                min={props.minRange}
                value={props.minVal}
                max={props.maxVal}
                onChange={event => {
                    props.onChange?.([+event.target.value, props.maxVal])
                    setFront(0)
                }}
                style={{
                    right: `${100*(props.maxRange - props.maxVal)/(props.maxRange - props.minRange)}%`,
                    left: '-16px',
                    // top: '8px',
                    zIndex: front === 0 ? 2 : 0,
                    background: `linear-gradient(to left, ${color} 0%, ${color} ${mid(0)}, #333 ${mid(0)}, #333 100%)`
                }}
            />
            <input
                type='range'
                min={props.minVal}
                value={props.maxVal}
                max={props.maxRange}
                onChange={event => {
                    props.onChange?.([props.minVal, +event.target.value])
                    setFront(1)
                }}
                style={{
                    left: `${100*(props.minVal - props.minRange)/(props.maxRange - props.minRange)}%`,
                    right: '-16px',
                    // bottom: '8px',
                    zIndex: front === 1 ? 2 : 0,
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${mid(1)}, #333 ${mid(1)}, #333 100%)`
                }}
            />
        </div>
    )
}