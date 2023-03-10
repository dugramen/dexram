import React from 'react';
import { pkData, otherData } from '../DataEnums';
import { Type } from '../Type';
import { capitalize, parseProse } from '../Utils';

function Section(props: {label, children?}) {
    return <div className='section'>
        <h4 className='header'>{props.label}</h4>
        <div className='grid'>
            {props.children ?? ''}
        </div>
    </div>
}

function Entry(props: {label, value?}) {
    return <React.Fragment>
        <div className='left'>{props.label || ''}</div>
        <div className='right'>{props.value || ''}</div>
    </React.Fragment>
}

interface Props {
    id
}

export default function AboutPanel({id}: Props) {
    const speciesId = pkData?.[id]?.pokemon?.species_id

    const typeMatchup = {}
    pkData[id]?.types?.forEach(row => {
        otherData.type_efficacy?.[row.type_id].forEach(matchup => {
            if (!typeMatchup.hasOwnProperty(matchup.damage_type_id)) {
                typeMatchup[matchup.damage_type_id] = 1
            }
            typeMatchup[matchup.damage_type_id] *= matchup.damage_factor/100
        })
    })


    return (
        <div className='AboutPanel'>
            <div className='generalData'>
                <div className='hflex'>
                    <Section label='Pokedex'>
                        <Entry label='Species' value={capitalize(otherData.species?.[speciesId]?.identifier)}/>
                        <Entry label='Type' value={
                            <>{pkData[id]?.types
                                ?.map((type, i) => <Type key={type.type_id ?? `${i}`} type={type.type_id}/>)
                            }</>
                        }/>
                        <Entry label='Height' value={pkData[id]?.pokemon?.height ?? 0}/>
                        <Entry label='Weight' value={pkData[id]?.pokemon?.weight ?? 0}/>
                    </Section>

                    <Section label='Breeding'>
                        <Entry label='Egg Groups' value={
                            <div className='egg-group-container'>
                                {otherData.species_egg_groups?.[speciesId]
                                ?.map(row => <div key={Object.entries(row).toString()}>
                                    {otherData.egg_groups?.[row.egg_group_id].identifier}
                                </div>)}
                            </div>
                        }/>
                        <Entry label='Egg Cycles' value={
                            otherData.species?.[speciesId]?.hatch_counter
                        }/>
                        <Entry label='Gender' value={
                            `Male ${(8 - (otherData.species?.[speciesId]?.gender_rate ?? 1))/8 * 100}%,\n 
                            Female ${(otherData.species?.[speciesId]?.gender_rate ?? 1)/8 * 100}%
                            `
                        }/>
                    </Section>
                </div>

                <div className='hflex TypeDefenses'>
                    <Section label='Type Defenses'>
                        {Object.entries(
                            Object.entries(typeMatchup).reduce((accum, [id, damage]: any) => ({
                                ...accum,
                                [damage*100]: [...accum[damage*100] ?? [], id]
                            }), {} as any)
                        )
                        .filter(([damage, types]) => damage !== '100')
                        .map(([damage, types]: any) => <Entry key={[damage, types].toString()} label={
                            <div style={{
                                color: damage > 100
                                ? '#e75825'
                                : damage < 100
                                    ? '#0080af'
                                    : '',
                                fontWeight: 'normal',
                            }}>
                                {`${damage}%`}
                            </div>
                        } value={
                            <div className='hlisted-items'>{
                                types?.map?.(t => <Type key={t} type={Number(t)}/>)
                            }</div>
                        }/>) ?? ''
                        }
                    </Section>

                    <Section label='Training'>
                        <Entry label='Catch Rate' value={
                            `${otherData.species?.[speciesId]?.capture_rate}`
                        }/>
                        <Entry label='Friendship' value={
                            otherData.species?.[speciesId]?.base_happiness
                        }/>
                        <Entry label={'Growth Rate'} value={
                            otherData.species?.[speciesId]?.growth_rate_id
                        }/>
                        <Entry label='EV Yield' value={
                            <div className='listed-entry'>{
                                pkData[id]?.stats
                                ?.filter(row => row.effort !== 0)
                                ?.map(row => <div key={row.stat_id}>{`${row.effort} ${otherData.stats?.[row.stat_id]?.identifier}`}</div>)
                            }</div>
                        }/>
                    </Section>
                </div>

                <Section label='Abilities'>  
                    {pkData[id]?.abilities
                    ?.map((row, index) => (
                        <Entry 
                            key={[row.ability_id, index].toString()}
                            label={capitalize(otherData.abilities?.[row.ability_id]?.identifier)}
                            value={parseProse(otherData.ability_prose?.[row.ability_id]?.short_effect, otherData.abilities?.[row.ability_id])}
                        />
                    )) ?? ''}
                </Section>
            </div>
        </div>
    )
}