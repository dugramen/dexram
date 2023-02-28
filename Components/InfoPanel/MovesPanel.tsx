import React from "react";
import { PkMove, pkData, otherData } from "../DataEnums";
import { capitalize, parseProse, blankEntryDasher } from "../Utils";
import { Type } from "../Type";

export default function MovesPanel({id}) {
    const [availableMoveTabs, setAvailableMoveTabs] = React.useState({
        'Identifier': false,
        'Level-Up': false,
        'Egg': false,
        'Tutor': false,
        'Machine': false,
        'Stadium-Surfing-Pikachu': false,
        'Light-Ball-Egg': false,
        'Colosseum-Purification': false,
        'Xd-Shadow': false,
        'Xd-Purification': false,
        'Form-Change': false,
        'Zygarde-Cube': false,
    })
    const [moveMethodTab, setMoveMethodTab] = React.useState(1)
    React.useEffect(() => {
        // setSpriteUrl(generateSpriteUrl(id))
        setAvailableMoveTabs(old => {
            Object.getOwnPropertyNames(old).forEach(n => {
                old[n] = false
            })
            return old
        })
    }, [id])

    React.useEffect(() => { 
        pkData[id]?.moves?.forEach((row: PkMove) => {
            setAvailableMoveTabs(old => ({
                ...old,

                [Object.getOwnPropertyNames(old)[row.pokemon_move_method_id]]: true,
            }))
        })
    }, [pkData[id]?.moves])

    return (
        <div className="MovesPanel">
            <div className="tab-container">
                {Object.getOwnPropertyNames(availableMoveTabs).map((tab, index) => (
                    availableMoveTabs[tab] && 
                    <button 
                        onClick={() => setMoveMethodTab(index)} 
                        key={tab}
                        className={`tab ${index === moveMethodTab ? 'current' : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="moves-grid">
                {
                    pkData[id]?.moves
                    ?.sort((a, b) => a.level - b.level)
                    .map((row, index) => {
                        let result = row.pokemon_move_method_id === moveMethodTab && 
                        <React.Fragment key={`${id} ${Object.entries(row).toString()}`}>
                            <div className="level">{moveMethodTab === 4 ? row.move_id : row.level}</div>

                            <div className="identifier">
                                {capitalize(otherData.moves?.[row.move_id]?.identifier)}
                            </div>

                            <div className="type">
                                <Type type={otherData.moves?.[row.move_id].type_id}/>
                            </div>

                            <div>{blankEntryDasher(otherData.moves?.[row.move_id].power)}</div>
                            <div>{blankEntryDasher(otherData.moves?.[row.move_id].accuracy)}</div>
                            <div>{otherData.moves?.[row.move_id].pp}</div>

                            <div className={`description ${otherData.moves?.[row.move_id].effect_id === 1 ? 'none': ''}`}>
                                {otherData.moves?.[row.move_id].effect_id === 1
                                ? '-----' 
                                : parseProse(otherData.move_effect_prose?.[otherData.moves?.[row.move_id].effect_id]?.short_effect, otherData.moves?.[row.move_id])}
                            </div>
                        </React.Fragment>
                        return result ? result : []
                    })
                }
            </div>
        </div>
    )
}