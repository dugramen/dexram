import React from 'react';

export async function cacheFetch(request: RequestInfo | URL, options?: any) {
    const cache = await caches.open('pokeapi');
    const response = await cache.match(request)
    if (response !== undefined) {
        // console.log('old request ', request)
        return response
    }
    else {
        // console.log('new request ', request)
        await cache.add(request)
        return cache.match(request)
    }
}

export function Scroller(props: {className?, innerClassName?, children?}) {
    const [scrollAtEnds, setScrollAtEnds] = React.useState(-2)
    const scroller = React.useRef<any>(null)

    function handleScrollCheck() {
        console.log('scroll checking')
        scroller.current && setScrollAtEnds(
            scroller.current?.clientWidth >= scroller.current?.scrollWidth
            ? -2
            : scroller.current?.scrollLeft <= 0
                ? -1
                : scroller.current?.scrollLeft + scroller.current?.clientWidth >= scroller.current?.scrollWidth
                    ? 1
                    : 0
        )
    }

    React.useEffect(() => {
        handleScrollCheck()
    }, [scroller.current, scroller.current?.clientWidth, scroller.current?.scrollWidth, scroller.current?.scrollLeft])

    return <div className={"indicated-scroller-container " + (props.className ?? '')}>
        <div 
            ref={scroller}
            onScroll={handleScrollCheck}
            // onResize={handleScrollCheck}
            className={"indicated-scroller " + props.innerClassName ?? ''}
        >
            {props.children}
        </div>
        {scrollAtEnds !== -2 && <>
            {scrollAtEnds !== -1 && <div className="arrow left"><div>🢔</div></div>}
            {scrollAtEnds !== 1 && <div className="arrow right"><div>🢖</div></div>}
        </>}
    </div>
}

export const capitalize = (string: string) => {
    return (string?.charAt(0).toUpperCase() + string?.slice(1)) ?? '';
} 

export function snakeCaser(...strings: (any)[]) {
    let result = ''
    let isFirst = true
    for (let i = 0; i < strings.length; i++) {
      if (strings[i] === '' || strings[i] === undefined || strings[i] === null) { 
        continue 
      }
      if (!isFirst) {
        result += '_'
      }
      isFirst = false
      result += strings[i]
    }
    return result
  }

export function parseProse(text: string, data) {
    const ntext = text?.split(/(?=\$)/g).reduce((accum, val) => {
        // console.log({val})
        if (val[0] === '$') {
            let snip = val.slice(1)
            const search = Object.getOwnPropertyNames(data).find((key) => snip.startsWith(key))
            if (search) {
                snip = snip.replace(search, '')
                return accum + ' ' + data?.[search]?.toString() + snip
            }
            return accum + ' ' + val
        } 
        return accum + ' ' + val
    }, '')

    const [s, ...rest] = ntext?.split('[') ?? []
    return s + rest.reduce((acc, sec) => {
        const [split, end] = sec.split('}')

        const inSquareBracket = split.slice(0, split.indexOf(']'))
        if (inSquareBracket !== '') {
            return acc + inSquareBracket + end
        } else {
            return acc + split.slice(split.indexOf(':') + 1, split.length) + end
        }
    }, '')

    // return ntext?.replaceAll('[', '[ ').split(/(?:,|\[|\]|{|})+/).reduce((accum, val, index) => {
    //     const remainder = index % 3
    //     if (remainder === 0) {
    //         return [...accum, val]
    //     }
    //     if (remainder === 1) {
    //         if (val === ' ') {
    //             return [...accum, 'TYPE']
    //         }
    //         return [...accum, val]
    //     }
    //     else {
    //         return accum
    //     }
    // }, [] as any[])
} 

export const blankEntryDasher = (text) => text === "" ? "--" : text

export const CollageGrid = ({columns = 2, ...props}) => {
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

export function Modal(props: {onHide?, label, children?}) {
    const [shown, setShown] = React.useState(false)
    const modalRef = React.useRef<any>()

    const hide = () => {
        setShown(false)
        props.onHide?.()
    }

    return (
        <div className='FilterPanel'>
            <button onClick={() => setShown(true)}>{props.label}</button>

            <div 
                className={`modal ${shown ? 'shown' : ''}`} 
                onMouseDown={event => modalRef.current && modalRef.current === event.target && hide()}
                ref={modalRef}
            >   
                <div className='modal-content'>
                    {props.children}
                </div>
            </div>
        </div>
    )
}
