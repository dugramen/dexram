import React, { ReactElement } from "react";
import { capitalize } from "../Utils";
import Scroller from "../Shared/Scroller";
import { PkMove, OtherData, PkData, ObjectList, pkData, otherData } from "../DexData";
// import { Type } from "../Type";
import Sprite from "../Shared/Sprite";
import EvolutionTree from "./EvolutionTree";
import Stats from "./Stats";
import MovesPanel from "./MovesPanel";
import AboutPanel from "./AboutPanel";
import SoundPanel from "./SoundPanel";
import DescriptionPanel from "./DescriptionPanel";
import LocationPanel from "./LocationPanel";

interface Props {
    id: number,
    setSelectedPoke,
}


export default function PokemonInfoPanel({id, setSelectedPoke}: Props) {
    const [currentTab, setCurrentTab] = React.useState<keyof typeof tabMap>('About')
    // const tabs = ['About', 'Stats', 'Evolutions', 'Moves']
    
    const tabMap = {
        About: () => <AboutPanel id={id}/>,
        Stats: () => <Stats id={id}/>,
        Evolutions: () => (
            <div className="EvolutionPanel">
                <EvolutionTree 
                    id={id} 
                    setSelectedPoke={setSelectedPoke} 
                    curId={undefined}                            
                />
            </div>
        ),
        Moves: () => <MovesPanel id={id}/>,
        Locations: () => <LocationPanel id={id}/>,
        Descriptions: () => <DescriptionPanel id={id}/>,
        // Sprites: () => {},
        Sounds: () => <SoundPanel id={id}/>,
    }

    return (
        // <div className="InfoPanel">
        <Scroller className=' panel-scroller' innerClassName='InfoPanel' vertical={true}>
            <h1>{`#${id} ${capitalize(pkData[id]?.pokemon?.identifier)}`}</h1>
            <Sprite
                id={id}
                width={144}
                height={144}
            />

            <Scroller>
                <div className="Tab-container">
                    {Object.keys(tabMap).map((tab: any) => (
                        <div 
                            key={tab} 
                            className={`Tab ${tab === currentTab ? 'current' : ''}`}
                            onClick={() => setCurrentTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </Scroller>

            <div className="Content-container">
                {tabMap[currentTab]?.() ?? []}
            </div>
        </Scroller>
        // </div>
    )
}
