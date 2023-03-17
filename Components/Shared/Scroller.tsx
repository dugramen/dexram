import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";

export default function Scroller(props: {className?, innerClassName?, children?}) {
    const [scrollAtEnds, setScrollAtEnds] = React.useState(-2)
    const scroller = React.useRef<any>(null)

    function handleScrollCheck() {
        // console.log('scroll checking')
        const [width, scrollWidth, scrollLeft] = [
            scroller.current?.clientWidth,
            scroller.current?.scrollWidth,
            scroller.current?.scrollLeft,
        ]
        scroller.current && setScrollAtEnds(
            width >= scrollWidth ? -2
            : scrollLeft <= 0 ? -1
            : scrollLeft + width >= scrollWidth - 1 ? 1
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
        <div className={"arrow left " + (![-2, -1].includes(scrollAtEnds) ? 'shown': 'hidden')}>
            <FontAwesomeIcon icon={faAngleDoubleLeft}/>
            {/* <div>{'<'}</div> */}
        </div>
        <div className={"arrow right " + (![-2, 1].includes(scrollAtEnds) ? 'shown': 'hidden')}>
            <FontAwesomeIcon icon={faAngleDoubleRight}/>
        </div>
    </div>
}