import React from "react";

export default function Scroller(props: {className?, innerClassName?, children?}) {
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