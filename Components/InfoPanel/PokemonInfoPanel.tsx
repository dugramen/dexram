import React, { ReactElement } from "react";
import { capitalize } from "../Utils";
import { PkMove, OtherData, PkData, ObjectList, pkData, otherData } from "../DataEnums";
import { Type } from "../Type";
import Sprite from "../Sprite";
import EvolutionTree from "./EvolutionTree";
import Stats from "./Stats";
import MovesPanel from "./MovesPanel";
import AboutPanel from "./AboutPanel";

interface Props {
    id: number,
    setSelectedPoke,
}

function Scroller(props) {
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

    return <div className="indicated-scroller-container">
        <div 
            ref={scroller}
            onScroll={handleScrollCheck}
            // onResize={handleScrollCheck}
            className={"indicated-scroller " + (props.className ?? '')}
            >
            {props.children}
        </div>
        {scrollAtEnds !== -2 && scrollAtEnds !== -1 && <div className="arrow left">{'🢔'}</div>}
        {scrollAtEnds !== -2 && scrollAtEnds !== 1 && <div className="arrow right">{'🢖'}</div>}
    </div>
}

export default function PokemonInfoPanel({id, setSelectedPoke}: Props) {
    const [currentTab, setCurrentTab] = React.useState(0)
    const tabs = ['About', 'Stats', 'Evolutions', 'Moves']

    return (
        <div className="InfoPanel">
            <h1>{`#${id} ${capitalize(pkData[id]?.pokemon?.identifier)}`}</h1>
            <Sprite
                id={id}
                width={144}
                height={144}
            />

            <Scroller className="Tab-container">

                {tabs.map((tab, index) => (
                    <div 
                        key={tab} 
                        className={`Tab ${index === currentTab ? 'current' : ''}`}
                        onClick={() => setCurrentTab(index)}
                    >
                        {tab}
                    </div>
                ))}
            </Scroller>

            {/* <div className="Tab-container">
            </div> */}

            <div className="Content-container">
                {[
                    // Info
                    <AboutPanel id={id}/>,

                    // Stats
                    <Stats id={id}/>,

                    // Evolution
                    <div className="EvolutionPanel">
                        <EvolutionTree 
                            id={id} 
                            setSelectedPoke={setSelectedPoke} 
                            curId={undefined}                            
                        />
                    </div>,

                    // Moves
                    <MovesPanel 
                        id={id} 
                    />,
                ][currentTab]}
            </div>
        </div>
    )
}
