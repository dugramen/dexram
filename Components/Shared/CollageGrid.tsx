import React from 'react';

export default function CollageGrid ({columns = 2, ...props}) {
    // console.log({children: props.children})
    return (
        <div 
            className='collage-grid'
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`
            }}
        >
            {[...Array(columns)].map((val, colIndex) => (
                <div className='column' key={colIndex}>
                    { props.children
                    ?.filter?.((child, index) => index % columns === colIndex) }
                </div>
            ))}
        </div>
    )
}