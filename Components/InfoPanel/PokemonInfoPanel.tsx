import React, { ReactElement } from "react";
import { capitalize } from "../Utils";
import Scroller from "../Shared/Scroller";
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

            <Scroller innerClassName="Tab-container">

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
