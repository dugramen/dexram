import React from "react";
import { otherData, Encounter } from "../DexData";
import { simpleHash, capitalize, deepCapitalize } from "../Utils";
import SlidingPillTabs from "../Shared/SlidingPillTabs";
import Scroller from "../Shared/Scroller";

type EncounterPlus = Encounter & {rarity};

const generateGrouping = (id, grouper: (row: EncounterPlus) => any, extraSlice?: (row: Encounter) => {[a: string]: any}): {[a: string]: EncounterPlus[]} => {
    const grouped: {[a: string]: EncounterPlus} = otherData.encounters?.[id]?.reduce((acc, row) => {
        const slice = {
            location_area_id: row.location_area_id,
            method: otherData.encounter_slots?.[row.encounter_slot_id]?.encounter_method_id,
            ...(extraSlice?.(row) ?? {}),
        }
        const hash = simpleHash(JSON.stringify(slice))
        const oldRow = acc[hash] ?? row
        return {
            ...acc,
            [hash]: {
                ...oldRow, 
                min_level: Math.min(oldRow.min_level, row.min_level),
                max_level: Math.max(oldRow.max_level, row.max_level),
                rarity: Math.max(oldRow.rarity ?? 0, otherData.encounter_slots?.[oldRow.encounter_slot_id]?.rarity)
            }
        }
    }, {}) ?? {}

    return Object.values(grouped).reduce((acc, row) => {
        const key = grouper(row)
        return {
            ...acc,
            [key]: [...(acc[key] ?? []), row]
        }
    }, {})
}

export default function LocationPanel(props: {id}) {
    const {locations, location_areas, regions} = otherData
    const [tab, setTab] = React.useState(0)
    const [mapping, setMapping] = React.useState<{[a: string]: EncounterPlus[]}>({})
    const [useVersion, setUseVersion] = React.useState(0)

    React.useEffect(() => {
        setMapping(
            useVersion 
            ? generateGrouping(
                    props.id,
                    row => row.version_id,
                    row => ({ version_id: row.version_id })
            ) 
            : generateGrouping(
                props.id, 
                row => locations?.[location_areas?.[row.location_area_id]?.location_id]?.region_id,
            )  
        )

        // setRegionMap(
        //     generateGrouping(
        //         props.id, 
        //         row => locations?.[location_areas?.[row.location_area_id]?.location_id]?.region_id,
        //     )
        // )
        // setVersionMap(
        //     generateGrouping(
        //         props.id,
        //         row => row.version_id,
        //         row => ({ version_id: row.version_id })
        //     )
        // )

        // const groupedEncounters: {[a: string]: EncounterPlus} = otherData.encounters?.[props.id]?.reduce((acc, row) => {
        //     const slice = {
        //         location_area_id: row.location_area_id,
        //         method: otherData.encounter_slots?.[row.encounter_slot_id]?.encounter_method_id,
        //     }
        //     const hash = simpleHash(JSON.stringify(slice))
        //     const oldRow = acc[hash] ?? row
        //     return {
        //         ...acc,
        //         [hash]: {
        //             ...oldRow, 
        //             min_level: Math.min(oldRow.min_level, row.min_level),
        //             max_level: Math.max(oldRow.max_level, row.max_level),
        //             rarity: Math.max(oldRow.rarity ?? 0, otherData.encounter_slots?.[oldRow.encounter_slot_id]?.rarity)
        //         }
        //     }
        // }, {}) ?? {}

        // setVersionMap(Object.values(groupedEncounters).reduce((acc, row) => {
        //     return {
        //         ...acc,
        //         [row.version_id]: [...(acc[row.version_id] ?? []), row]
        //     }
        // }, {}))
        // setRegionMap(Object.values(groupedEncounters).reduce((acc, row) => {
        //     const region_id = locations?.[location_areas?.[row.location_area_id]?.location_id]?.region_id
        //     return {
        //         ...acc,
        //         [region_id]: [...(acc[region_id] ?? []), row]
        //     }
        // }, {}))
    }, [props.id, useVersion])

    return (
        <div className="LocationPanel">
            <Scroller>
                <select onChange={event => setUseVersion(parseInt(event.target.value))}>
                    <option value={0}>Region</option>
                    <option value={1}>Version</option>
                </select>
                <SlidingPillTabs 
                    tabList={Object.getOwnPropertyNames(mapping).map(i => parseInt(i))} 
                    setCurrentTab={setTab} 
                    currentTab={tab}
                    customLabel={i => capitalize((
                        useVersion
                        ? otherData.versions?.[i]?.identifier
                        : otherData.regions?.[i]?.identifier
                        ) ?? '') ?? i}
                        />
            </Scroller>
            <div className="grid">
                { 
                    'Location,Level,Rarity'
                    .split(',')
                    .map(tab => <div 
                        className={'Header ' + tab.split(' ')[0] + ' ' + tab.split(' ')[0].toLowerCase()} 
                        key={tab}
                    >{tab}</div>)
                }

                { 
                    Object.entries(mapping)
                    ?.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    ?.map(([region, rows]) => {
                        if (![tab, 0].includes(parseInt(region))) { return [] }
                        const usedLocationAreaIds = new Set()
                        return <React.Fragment key={region}>
                            {/* <div className="version-header" >
                                {deepCapitalize(useVersion 
                                    ? otherData.versions?.[region]?.identifier 
                                    : otherData.regions?.[region]?.identifier)}
                            </div> */}
                            { 
                                rows
                                .sort((a, b) => a.location_area_id - b.location_area_id)
                                .map(row => {
                                    const area = location_areas?.[row.location_area_id]?.identifier
                                    const encounterMethod = otherData.encounter_slots?.[
                                        row.encounter_slot_id
                                    ]?.encounter_method_id
                    
                                    const location = otherData.locations?.[otherData.location_areas?.[row.location_area_id]?.location_id]?.identifier
                                    const isRepeated = usedLocationAreaIds.has(location)
                                    usedLocationAreaIds.add(location)
                                    return <React.Fragment key={row.id}>
                                        {!isRepeated && <div className="location">
                                            {deepCapitalize(location)}
                                        </div>}
                                        {(area || encounterMethod !== 1) && <div className={"sub " + (isRepeated ? '' : 'own-row')}>
                                            {area && <div className="method">{deepCapitalize(area)}</div>}
                                            {encounterMethod !== 1 && <div className="method">
                                                {deepCapitalize(otherData.encounter_methods?.[
                                                    encounterMethod
                                                ]?.identifier)}
                                            </div>}
                                        </div>}
                                        <div className="level">{`${row.min_level} - ${row.max_level}`}</div>
                                        <div className="rarity">{row.rarity ?? 0}%</div>
                                    </React.Fragment>
                                }) 
                            }
                        </React.Fragment>
                    })
                }
            </div>
        </div>
    )
}