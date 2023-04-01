import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faAngleDoubleLeft, faAngleDoubleDown, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";

export default function Scroller(props: {className?, innerClassName?, children?, vertical?}) {
    const [scrollAtEnds, setScrollAtEnds] = React.useState(-2)
    const scroller = React.useRef<any>(null)
    const {vertical} = props
    const {current} = scroller
    
    const getDimensions = () => [
        vertical ? current?.clientHeight : current?.clientWidth,
        vertical ? current?.scrollHeight : current?.scrollWidth,
        vertical ? current?.scrollTop : current?.scrollLeft,
    ]

    const [size, scrollSize, scrollPos] = getDimensions()
    
    function handleScrollCheck() {
        const [size, scrollSize, scrollPos] = getDimensions()
        scroller.current && setScrollAtEnds(
            size >= scrollSize ? -2
            : scrollPos <= 0 ? -1
            : scrollPos + size >= scrollSize - 1 ? 1
            : 0
        )
    }

    React.useEffect(() => {
        // console.log('shan')
        handleScrollCheck()
    }, [current, size, scrollSize, scrollPos])

    return <div className={"Scroller indicated-scroller-container " + (vertical ? ' vertical ' : ' horizontal ') + (props.className ?? '')}>
        <div 
            ref={scroller}
            onScroll={handleScrollCheck}
            // onResize={handleScrollCheck}
            className={"flex-container indicated-scroller " + (props.innerClassName ?? '')}
        >
            {props.children}
        </div>
        <div 
            className={`arrow ${vertical ? 'top' :'left'} ` + (![-2, -1].includes(scrollAtEnds) ? 'shown': 'hidden')}
            onClick={() => {scroller.current[vertical ? 'scrollTop' : 'scrollLeft'] = 0}}
        >
            <FontAwesomeIcon icon={vertical ? faAngleDoubleUp : faAngleDoubleLeft}/>
            {/* <div>{'<'}</div> */}
        </div>
        <div 
            className={`arrow ${vertical ? 'bottom' : 'right'} ` + (![-2, 1].includes(scrollAtEnds) ? 'shown': 'hidden')}
            onClick={() => {scroller.current[vertical ? 'scrollTop' : 'scrollLeft'] = scroller.current[vertical ? 'scrollHeight' : 'scrollWidth']}}
        >
            <FontAwesomeIcon icon={vertical ? faAngleDoubleDown : faAngleDoubleRight}/>
        </div>
    </div>
}