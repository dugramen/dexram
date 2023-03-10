import React from "react";
import { PkMove, pkData, otherData } from "../DataEnums";
import { capitalize, parseProse, blankEntryDasher } from "../Utils";
import { Type } from "../Type";
import { WindowWidth } from "../../pages/_app";
import { getFilteredMoves, beginNewFilter, filterChangeConfirmed } from "../Filter/FilterClasses";

export default function MovesPanel({id}) {
    const windowWidth = React.useContext(WindowWidth)
    // const isMobile = windowWidth < 550
    const isMobile = true
    const [availableMoveTabs, setAvailableMoveTabs] = React.useState({
        'All': true,
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
    const [onlyFiltered, setOnlyFiltered] = React.useState(false)
    const [availableMoves, setAvailableMoves] = React.useState(getFilteredMoves(id) ?? {})
    const [manualUpdate, setManualUpdate] = React.useState(0)
    const update = () => setManualUpdate(old => {console.log('manual update -- ', old); return old + 1})

    React.useEffect(() => {
        filterChangeConfirmed.connect(update)
        return () => {
            filterChangeConfirmed.disconnect(update)
        }
    }, [])

    React.useEffect(() => {
        // setSpriteUrl(generateSpriteUrl(id))
        setAvailableMoveTabs(old => {
            Object.getOwnPropertyNames(old).forEach(n => {
                old[n] = false
            })
            old.All = true
            return old
        })
    }, [id])

    React.useEffect(() => { 
        pkData[id]?.moves
        ?.forEach((row: PkMove) => {
            setAvailableMoveTabs(old => ({
                ...old,
                
                [Object.getOwnPropertyNames(old)[row.pokemon_move_method_id]]: true,
            }))
        })
    }, [pkData[id]?.moves])
    
    React.useEffect(() => {
        console.log('recieved manual update')
        beginNewFilter()
        setAvailableMoves(getFilteredMoves(id) ?? {})
    }, [id, manualUpdate, onlyFiltered])

    return (
        <div className="MovesPanel">
            <div className="moves-top-bar">
                <input
                    type='checkbox'
                    checked={onlyFiltered}
                    onChange={() => setOnlyFiltered(old => !old)}
                />

                <button className="filter-button">Filters</button>

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
            </div>

            <div className={"moves-grid " + (isMobile ? 'mobile': 'desktop')}>
                {
                    pkData[id]?.moves
                    ?.sort((a, b) => (a.pokemon_move_method_id === 1 ? a.level: 100 + a.pokemon_move_method_id) 
                                   - (b.pokemon_move_method_id === 1 ? b.level: 100 + b.pokemon_move_method_id))
                    .map((row, index) => {
                        let result = ([row.pokemon_move_method_id, 0].includes(moveMethodTab)) &&
                        (!onlyFiltered || Object.hasOwn(availableMoves, row.move_id)) &&  
                        <React.Fragment key={`${id} ${Object.entries(row).toString()}`}>
                            <div className="level">{
                                [
                                    '',
                                    // <div style={{
                                    //     display: 'flex',
                                    //     minWidth: '0',
                                    // }}>
                                    //     <div style={{marginRight: 'auto'}}>Lv</div>
                                    //     <div>{row.level}</div>
                                    // </div>,
                                    `Lv ${row.level}`,
                                    'Egg',
                                    'Tutr',
                                    'TM',
                                    'Stdm',
                                    'Clsm',
                                    'LtBl',
                                    'XD-S',
                                    'XD-P',
                                    'Form',
                                    'Z'
                                ][row.pokemon_move_method_id]
                            }</div>

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
                                ? '' 
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