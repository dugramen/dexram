import { otherData, pkData, PkPokemon, Species, Evolution, Move } from "../DataEnums"
import { Type } from "../Type";
import DualRangeSlider from "../DualRangeSlider";
import { capitalize } from "../Utils";
import ReactSelect from 'react-select';
import { WindowWidth } from "../../pages/_app";
import React from "react";


export interface FilterData { value, default, predicate?, component?, hasChanged?, calculator? : (a: any) => any}
export const filterData: {[a: string]: FilterData} = {}

class InnerEvent {
    connectedFunctions: Set<() => any>;
    emit: () => any;
    constructor() {
        this.connectedFunctions = new Set()
        this.emit = (() => this.connectedFunctions.forEach(f => f())).bind(this)
    }
    connect(func: () => any) {
        this.connectedFunctions.add(func)
    } 
    disconnect(func: () => any) {
        this.connectedFunctions.delete(func)
    }
}

export const filterChanged = new InnerEvent()
export const filterChangeConfirmed = new InnerEvent()
const stateUpdater = filterChanged.emit




let qulaifiedMoves: any = undefined
const moveMethodMap = {}
export const getFilteredMoves = (p) => {
    qulaifiedMoves = qulaifiedMoves ?? (() => {
        const hasChangedMethods = Object.entries(filterData).filter(entry => entry[0].startsWith('Moves') && entry[1].hasChanged())
        const filteredMoveResult = Object.values(otherData.moves ?? {})
        .filter(
            row => hasChangedMethods.every(
                (entry: any) => moveMethodMap[entry[0].replace('Moves', '')](row.id, entry[1].calculator)
                // entry[1].calculator(otherData.moves?.[row.id])
            )
        )
        .reduce((acc, val) => ({
            ...acc,
            [val.id]: val
        }), {})
        console.log('oofers', filteredMoveResult, hasChangedMethods)
        return filteredMoveResult
    })()

    return qulaifiedMoves
}
const moveMethodFunc = (p, s, v) => {
    getFilteredMoves(p)
    return (pkData[p]?.moves?.filter(m => qulaifiedMoves[m.move_id] !== undefined)?.length ?? 0) > 0
}

export function beginNewFilter() {
    qulaifiedMoves = undefined
}

const move = (T, key: keyof Move, def: any = undefined) => {
    // console.log({moveMethodMap})
    moveMethodMap[key] = (id, v) => v(otherData.moves?.[id]?.[key])
    return T(key, def, moveMethodFunc)
}

const evol = (T, key: keyof Evolution | string, def: any = undefined, customPred: any = undefined) => T(key, def, 
    customPred === undefined ? (a, id, v) => {
        const usingPre = filterData.Evolutionuse_pre_evolution?.value === 1
        // const resolver = i => v(otherData.evolutions?.[i]?.[key])
        const resolver = i => otherData.evolutions?.[i]?.some(val => v(val[key]))
        console.log(id, {resolved: otherData.species?.[id]?.evolves_into})
        return usingPre 
            ? otherData.species?.[id]?.evolves_into?.some(row => resolver(row.evolved_species_id))
            : resolver(id)
    }: customPred
)
const spec = (T, key: keyof Species, def: any = undefined) => T(key, def,
    (a, id, v) => v(otherData.species?.[id]?.[key])
)
const poke = (T, key: keyof PkPokemon, def: any = undefined) => T(key, def, 
    (id, s, v) => v(pkData[id]?.pokemon?.[key])
)

const section = (prefix, ...args) => {
    // console.log(args.map(a => Object.entries(a)))
    return args.filter(a => a && a).reduce((acc, val) => ({
        ...acc,
        [prefix + Object.entries(val)[0][0]]: Object.entries(val)[0][1]
    }), {})
}

export function updateFilterData() {
    Object.entries({
        ...section(
            'Tags',
            poke(Tag, 'is_default'),
            spec(Tag, 'forms_switchable'),
            spec(Tag, 'is_baby'),
            spec(Tag, 'is_legendary'),
            spec(Tag, 'is_mythical'),
            Tag('is_normal', 0, (a, id) => (
                !otherData.species?.[id]?.is_baby 
                && !otherData.species?.[id]?.is_legendary 
                && !otherData.species?.[id]?.is_mythical
            )),
        ),
        ...section(
            'Ranges',
            poke(Range, 'height', [0, 300]),
            poke(Range, 'weight', [0, 10_000]),
            spec(Range, 'gender_rate', [0, 8]),
            spec(Range, 'capture_rate', [0, 1_000]), 
            spec(Range, 'base_happiness', [0, 1_000]),
        ),
        ...section(
            'Types',
            ...types(),
            Tag('type_dual', 0, id => pkData[id]?.types?.length === 2, () => 'Dual-Type'),
            // Tag('type_mono', 0, id => pkData[id]?.types?.length === 1, () => 'Mono-Type'),
        ),
        
        ...section(
            'Stats',
            ...stats(),
            Range('stat_total', [0, 1_500], (id, p, v) => v(pkData[id]?.stats?.reduce((acc, row) => acc + row.base_stat, 0))),
            Range('highest_stat', [0, 255], (p, s, v) => v(pkData[p]?.stats?.slice(0, 6).reduce((acc, row) => Math.max(row.base_stat, acc), 0))),
            Range('lowest_stat', [0, 255], (p, s, v) => v(pkData[p]?.stats?.slice(0, 6).reduce((acc, row) => Math.min(row.base_stat, acc), 255))),
        ),

        ...section(
            'Evolution',
            Tag('use_pre_evolution', 0, id => true),
            Tag('branching_evolutions', 0, (p, s, v) => v((otherData.species?.[s]?.evolves_into?.length ?? 0) > 1)),
            evol(Range, 'minimum_level', [0, 100]),
            evol(Tag, 'needs_overworld_rain'),
            evol(Tag, 'turn_upside_down'),
            // evol(Tag, 'trigger_item_id'),
            otherData.items && evol(Options, 'held_item_id', Object.values(otherData.items ?? []).filter(item => [10, 12].includes(item.category_id)).map(item => ({label: item.identifier, value: item.id}))),
            evol(Tag, 'using_an_item', 0, (p, s, v) => otherData.evolutions?.[s]?.some(evo => evo.trigger_item_id && evo.trigger_item_id)),
            otherData.items && evol(Options, 'trigger_item_id', Object.values(otherData.items ?? []).filter(item => [10, 12].includes(item.category_id)).map(item => ({label: item.identifier, value: item.id}))),
            evol(Tag, 'holding_an_item', 0, (p, s, v) => otherData.evolutions?.[s]?.some(evo => evo.held_item_id && evo.held_item_id)),
            
            // Branching evolutions needs to disclude single evolutions but with different forms
            // Try to fix evolution tree to also show different forms for root evolution, 
            //     by checking if current node is root and displaying flex list instead (hacky)
            // Add evolution chain
            // - DONE - Toggle between showing evolved species and evolving species
            // Option list
        ),

        ...section(
            'Moves',
            move(Search, 'identifier', ""),
            // Search('identifier', "", (p, s, v) => pkData[p]?.moves?.some(row => v(otherData.moves?.[row.move_id]?.identifier) ) ),
            move(Range, 'accuracy', [0, 100]),
            move(Range, 'power', [0, 300]),
            move(Range, 'pp', [0, 100]),
            move(Range, 'effect_chance', [0, 100]),
            move(Range, 'priority', [0, 6]),
            // move(Options, 'type_id', ),
            otherData.types && move(Options, 'type_id',
                Object.entries(otherData.types ?? {}).map(e => ({label: e[1].identifier, value: e[1].id})),
            ),
            // otherData.types && Options(
            //     'Type', 
            //     Object.entries(otherData.types ?? {}).map(e => ({label: e[1].identifier, value: e[1].id}) ), 
            //     (pk, sp, v) => pkData[pk]?.moves?.some(row => v(otherData.moves?.[row.move_id]?.type_id))
            // ),
        )
    })
    .filter((entry: any) => !filterData.hasOwnProperty(entry[0]))
    .forEach((entry: any) => filterData[entry[0]] = entry[1])
    console.log('filter-data: ', {...filterData})
}

function between(x, min, max) {
    return typeof x === 'number' && x >= min && x <= max;
}
    
function types() {
    return Object.entries(otherData.types ?? {})
    .filter(([key, row]) => key !== 'headers')
    .map(entry => Tag(
        `type_${entry[0]}`, 
        0, 
        (id, s, v) => v(pkData[id]?.types?.some(type => type.type_id === entry[1].id)), 
        key => <Type type={key.replace('type_', '')}/>)
    )
}
function stats() {
    return Object.entries(otherData.stats ?? {})
    .filter(([key, row]) => !['headers', '7', '8'].includes(key))
    .map((entry, index) => Range(
        `${entry[0]}`, 
        [0, 255], 
        (id, s, v) => v(pkData[id]?.stats?.[index]?.base_stat), 
        key => (otherData.stats?.[key]?.identifier))
    )
}

function Options(key, value: {label, value}[] = [], predicate, component = a => a, prefix = '') {
    const optionsCopy = [{label: '---', value: null}, ...value]
    const self: FilterData = {
        value: optionsCopy[0],
        default: optionsCopy,
    }
    self.hasChanged = () => self.value.value !== null
    self.calculator = a => a === self.value?.value
    self.predicate = (pk, sp) => predicate(pk, sp, self.calculator)
    self.component = () => {
        return (<div className="hflex">
            <div>{key}</div>
            <ReactSelect
                value={self.value}
                options={self.default}
                onChange={(newVal) => {self.value = newVal; console.log({newVal}); stateUpdater()}}
                // menuPosition='fixed'
                className='react-select-container'
                classNamePrefix='react-select'
                menuPlacement='top'
            />
        </div>
        )
    }
    return { [prefix + key]: self }
}

function Range (key, value = [0, 100], predicate: (pokeId, speciesId, validator) => any, component: (key: string) => any = a => a, prefix = '') {
    const self: FilterData = {
        value: value,
        default: [...value],
    }
    self.hasChanged = () => self.value[0] !== self.default[0] || self.value[1] !== self.default[1]
    self.calculator = a => between(a, self.value[0], self.value[1])
    self.predicate = (pokeId, speciesId) => predicate(pokeId, speciesId, self.calculator)
    self.component = (props) => {
        const isSmall = (props.windowWidth ?? 0) < 600

        return (
            <div key={key} className={'filter-range-component ' + (isSmall ? 'mobile': 'desktop')}>
                <div className={"filter-range-header " + (self.hasChanged() ? 'enabled': '')}>
                    {self.hasChanged() && <div className="reset" onClick={() => {
                        self.value[0] = self.default[0];
                        self.value[1] = self.default[1];
                        stateUpdater()
                    }}>↺</div>}
                    <div>
                        {component(key)}
                    </div>
                </div>
                <div className="filter-range-container">

                    <input
                        type={'number'}
                        value={`${self.value[0]}`}
                        min={self.default[0]}
                        max={self.value[1]}
                        onChange={e => {
                            const val = parseInt(e.target.value)
                            self.value[0] = val ? val : self.default[0]
                            stateUpdater()
                        }}
                    />
                    <DualRangeSlider 
                        minVal={self.value[0]} 
                        maxVal={self.value[1]} 
                        minRange={self.default[0]} 
                        maxRange={self.default[1]}
                        onChange={val => {
                            self.value[0] = val[0]
                            self.value[1] = val[1]
                            console.log(self.value, self.default)
                            stateUpdater()
                        }}
                    />
                    <input
                        type={'number'}
                        value={`${self.value[1]}`}
                        min={self.value[0]}
                        max={self.default[1]}
                        onChange={e => {
                            const val = parseInt(e.target.value)
                            self.value[1] = val ? val : self.default[1]
                            stateUpdater()
                        }}
                    />
                </div>

            </div>
        )
    }

    return { [prefix + key]: self }
}

function Search (key, value = "", predicate: (pokeId, speciesId, validator) => any = () => true, component: (key: string) => any = a => a, prefix?) {
    const self: FilterData = {
        value: value,
        default: value
    }
    self.calculator = (a: string) => {
        return typeof a === 'string' && a.toLowerCase().replaceAll('-', ' ').includes(self.value.toLowerCase())
    }
    self.hasChanged = () => self.value !== self.default
    self.predicate = (p, s) => predicate(p, s, self.calculator)
    self.component = () => {
        return (
            <div>
                <div>{key}</div>
                <input
                    type='search'
                    onChange={event => {
                        self.value = event.target.value
                        stateUpdater()
                    }}
                    value={self.value}
                />
            </div>
        )
    }
    return { [key]: self }
}

function Tag (key, value = 0, predicate: (pokeId, speciesId, validator) => any, component: (key: string) => any = a => a, prefix = '', onChange?) {
    const self: FilterData = {
        value: value,
        default: value,
    }
    self.hasChanged = () => self.value !== self.default
    self.calculator = val => {
        return self.value === 1 
            ? val
            : self.value === -1
                ? !val
                : true
    }
    self.predicate = (p, s) => (predicate(p, s, self.calculator))
    self.component = () => {
        return (
            <div key={key} className="tag-container" onClick={() => {
                self.value = self.value === 1 
                    ? -1 
                    : self.value === 0
                        ? 1
                        : 0
                onChange?.(self.value)
                stateUpdater()
            }}>
                <TriMark value={ self.value }/>
                <div className="label">{ component(key) }</div>
            </div>
        )
    }
    return { [prefix + key]: self }
}



export function TriMark(props: {value: number, onChange?}) {
    return <span className="custom-checkbox" onClick={() => props.onChange?.(
        {'1': -1, '0': 1, '-1': 0}[`${props.value}`]
    )}>
        <div className="mark">{
            props.value === 1
                ? '✓'
                : props.value === -1
                    ? '✖'
                    : ' '
        }</div>
    </span>
}
