import React from "react";
import { capitalize } from "../Utils";
import Sprite from "../Shared/Sprite";
import { pkData, otherData, Evolution } from "../DexData";
import { Type } from "../Shared/Type";

const item_evo = (a) => <div className="evo-horizontal">
    <img 
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${otherData.items?.[a]?.identifier}.png`} 
        alt=""
    />
    <div>{capitalize(otherData.items?.[a]?.identifier.replaceAll('-', ' '))}</div>
</div>

// Make any evolution detail clickable to filter for it
const evo_map: Partial<Evolution> = {
    evolution_trigger_id: a => ![1, 3].includes(a) && capitalize(otherData.evolution_triggers?.[a]?.identifier),
    minimum_level: a => `Lv.${a}`,
    gender_id: a => `${{1: '♀ Female', 2: '♂ Male', 3: 'Genderless'}[a]}`,
    minimum_happiness: a => `❤️ ${a}`,
    minimum_beauty: a => `${a} Beauty`,
    minimum_affection: a => `${a} Affection`,
    needs_overworld_rain: a => `Raining`,
    turn_upside_down: a => `Upside Down`,
    time_of_day: a => capitalize(a),
    known_move_id: a => `${capitalize(otherData.moves?.[a]?.identifier)}`,
    known_move_type_id: a => <div className="evo-horizontal">
        <Type type={a}/>
        <div style={{marginLeft: '4px'}}>Move</div>
    </div>,
    relative_physical_stats: a => `Atk ${a === 1 ? '>' : a === -1 ? '<' : '=' } Def`,
    // Make species clickable filter
    party_species_id: a => `With ${capitalize(otherData.species?.[a]?.identifier)}`,
    trigger_item_id: a => item_evo(a),
    held_item_id: a => item_evo(a),
}


export default function EvolutionTree({id, setSelectedPoke, root = undefined, curId, formCounter = 0, prevId = 0}) {
    if (curId === undefined) {
        curId = getEvolutionRoot(pkData[id]?.pokemon?.species_id)
        root = curId
    }
    
    const counter = {}
    let locationAlreadyUsed = false

    const triggerList = Object.entries(evo_map)
        .filter(entry => !["", 0].includes(otherData.evolutions?.[curId]?.[formCounter]?.[entry[0]] ?? ""))

    const isMultiFormed = (otherData.species?.[curId]?.forms?.filter(row => row.is_battle_only === 0)?.length ?? 0) > 1
    const sameSpeciesCount = otherData.species?.[prevId]?.evolves_into?.reduce((acc, val) => acc + (val.evolved_species_id === curId ? 1 : 0), 0) ?? 1
    // console.log({curId, isMultiFormed, sameSpeciesCount})
    if ( !isMultiFormed && (formCounter + 1) !== sameSpeciesCount ) {
        return null
    }

    const singleFormPokeId = otherData.species?.[curId]?.forms?.[isMultiFormed ? formCounter : 0]?.pokemon_id

    return <>
        <div className="evolution-triggers">
            {triggerList.map(entry => <div className="evolution-entry" key={entry.toString()}>{
                entry[1]?.(otherData.evolutions?.[curId]?.[formCounter]?.[entry[0]])
            }</div>)}
        </div>

        <div className="branch">
            <div className="left">
                {isMultiFormed
                && (otherData.species?.[curId]?.evolves_into?.length ?? 0) > 1
                ? otherData.species?.[curId]?.forms
                    ?.filter(f => (f.is_battle_only === 0 && f.form_identifier !== 'starter'))
                    .map(form => <PokeEntry
                        pokeId={form.pokemon_id}
                        key={JSON.stringify(form)}
                        onClick={() => setSelectedPoke(form.pokemon_id)}
                    />)
                : <PokeEntry 
                    pokeId={singleFormPokeId}
                    onClick={() => setSelectedPoke(singleFormPokeId)}
                />}
            </div>

            <div className="right">
                {otherData.species?.[curId]?.evolves_into
                // ?.filter(row => isMultiFormed(row.evolved_species_id) ? )
                ?.map((row, j) => {
                    counter[row.evolved_species_id] = (counter[row.evolved_species_id] ?? -1) + 1
                    return <EvolutionTree
                        curId={row.evolved_species_id}
                        key={Object.entries(row).toString()}
                        id={id}
                        setSelectedPoke={setSelectedPoke}
                        formCounter={counter[row.evolved_species_id]}
                        prevId={curId}
                        root={root}
                    />
                })}
            </div>
        </div>

    </>

    function getEvolutionRoot(curId = id) {
        const prevId = otherData.species?.[curId]?.evolves_from_species_id
        if (prevId) {
            return getEvolutionRoot(prevId)
        }
        return curId
    }
}


function PokeEntry ({pokeId, onClick}: {pokeId, onClick?}) {
    return <div 
        className="PokeEntry" 
        onClick={() => onClick?.()}
    >
        <Sprite
            id={pokeId}
        />
        <div>
            {capitalize(pkData[pokeId]?.pokemon?.identifier)}
        </div>
    </div>
}