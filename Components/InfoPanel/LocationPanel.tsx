import React from "react";
import { otherData } from "../DexData";
import { simpleHash, capitalize, deepCapitalize } from "../Utils";

export default function LocationPanel(props: {id}) {
    const {locations, location_areas} = otherData
    const usedEncounters = new Set()
    const usedLocationAreaIds = new Set()
    // const grouped = otherData.encounters?.[props.id].reduce((acc, row) => ({
    //     ...acc,
    //     [row.]
    // }), {})
    return (
        <div className="LocationPanel">
            {'Location,Level,Rarity'.split(',').map(tab => <div className={'Header ' + tab.split(' ')[0]} key={tab}>{tab}</div>)}
            {otherData.encounters?.[props.id]
            ?.map(row => {
                const {id, version_id, encounter_slot_id, ...resOfRow} = row
                const hashable = JSON.stringify(resOfRow)
                const hash = simpleHash(hashable)
                if (usedEncounters.has(hash)) {return []}
                usedEncounters.add(hash)
                const area = location_areas?.[row.location_area_id]?.identifier
                const encounterMethod = otherData.encounter_slots?.[
                    row.encounter_slot_id
                ]?.encounter_method_id

                const location = locations?.[location_areas?.[row.location_area_id]?.location_id]?.identifier
                const locationIsRepeated = usedLocationAreaIds.has(location)
                usedLocationAreaIds.add(location)
                return <React.Fragment key={JSON.stringify(row)}>
                    {/* <div className="version">{locationIsRepeated ? '' : row.version_id}</div> */}
                    {/* <div className="location">
                    </div> */}
                    {!locationIsRepeated && <div className="location">
                        {deepCapitalize(location)}
                    </div>}
                    {(area || encounterMethod !== 1) && <div className={"sub " + (locationIsRepeated ? '' : 'own-row')}>
                        {area && <div className="method">{deepCapitalize(area)}</div>}
                        {encounterMethod !== 1 && <div className="method">
                            {deepCapitalize(otherData.encounter_methods?.[
                                encounterMethod
                            ]?.identifier)}
                        </div>}
                    </div>}
                    <div className="level">{`${row.min_level} - ${row.max_level}`}</div>
                    <div className="rarity">{otherData.encounter_slots?.[encounter_slot_id]?.rarity}%</div>
                </React.Fragment>
            })}
        </div>
    )
}