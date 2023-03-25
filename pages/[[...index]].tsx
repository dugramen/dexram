import React, { useEffect } from "react";
// import {cacheFetch, capitalize, snakeCaser} from '../Components/Utils';
// import { typeMap, Type } from "../Components/Shared/Type";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import PokemonInfoPanel from "../Components/InfoPanel/InfoPanelContainer";
// import FilterPanel from "../Components/FilterPanel";
import PokedexListItem from "../Components/PokedexListItem";
import { pkData, otherData, loadInData } from "../Components/DexData";
import FilterPanelNew from "../Components/Filter/FilterPanelnEW";
import { filterData, updateFilterData, beginNewFilter } from "../Components/Filter/FilterClasses";
import { WindowWidth } from "./_app";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowDownShortWide, faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";



const statSort = (a, b, statId = 0) => (
  pkData[a]?.stats?.[statId]?.base_stat - pkData[b]?.stats?.[statId]?.base_stat
)
const sortOptions = {
  default: () => 1,
  // order: (a, b) => (pkData[a]?.pokemon?.order ?? 10_000) - (pkData[b]?.pokemon?.order ?? 10_000),
  name: (a, b) => pkData[a]?.pokemon?.identifier.localeCompare(pkData[b]?.pokemon?.identifier),
  hp: (a, b) => statSort(a, b, 0),
  attack: (a, b) => statSort(a, b, 1),
  defense: (a, b) => statSort(a, b, 2),
  spatk: (a, b) => statSort(a, b, 3),
  spdef: (a, b) => statSort(a, b, 4),
  speed: (a, b) => statSort(a, b, 5),
  height: (a, b) => pkData[a]?.pokemon?.height - pkData[b]?.pokemon?.height,
  weight: (a, b) => pkData[a]?.pokemon?.weight - pkData[b]?.pokemon?.weight,
  stat_total: (a, b) => {
    const comp = i => pkData[i]?.stats?.reduce((acc, val) => acc + val.base_stat, 0) ?? 0
    return comp(a) - comp(b)
  },
  stat_lowest: (a, b) => {
    const comp = i => pkData[i]?.stats?.reduce((acc, val) => Math.min(acc, val.base_stat), 255) ?? 0
    return comp(a) - comp(b)
  },
  stat_highest: (a, b) => {
    const comp = i => pkData[i]?.stats?.reduce((acc, val) => Math.max(acc, val.base_stat), 0) ?? 0
    return comp(a) - comp(b)
  },
  base_experience: (a, b) => pkData[a]?.pokemon?.base_experience - pkData[b]?.pokemon?.base_experience,
  type_id: (a, b) => (
    (pkData[a]?.types?.[0]?.type_id * 1_000 + (pkData[a]?.types?.[1]?.type_id ?? 0))
     - (pkData[b]?.types?.[0]?.type_id * 1_000 + (pkData[b]?.types?.[1]?.type_id ?? 0))
  )
}

export default function Home(props) {
  const router = useRouter()
  const [pokeDataLoaded, setPokeDataLoaded] = React.useState(-1)
  const [pokeFiltered, setPokeFiltered] = React.useState(-1)
  const [search, setSearch] = React.useState<string>("")
  const [sortOption, setSortOption] = React.useState('default')
  const [sortAscending, setSortAscending] = React.useState(1)
  const [isShown, setIsShown] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const filteredPokes = React.useRef<any[]>([])
  const windowWidth = React.useContext(WindowWidth)
  const isMobile = windowWidth < 780

  function updateRoute(a) {
    if (a === undefined) {
      a = isMobile ? -1 : router.query.selectedPoke
    }
    router.push({
      pathname: '/',
      query: {
        selectedPoke: a,
        filters: JSON.stringify(Object.entries(filterData).reduce((acc, entry) => ({
          ...acc,
          ...(entry[1].hasChanged() ? {[entry[0]]: entry[1].value} : {}),
        }), {})),
      }
    }, undefined, {shallow: true})
  }
  const [selectedPoke, setRawSelectedPoke] = React.useState(1)
  // const selectedPoke = parseInt(router.query.selectedPoke as string) || 1
  const setSelectedPoke = updateRoute

  const update = () => setPokeDataLoaded(old => old + 1)
  const updateFilter = () => setPokeFiltered(old => old + 1)

  // loadInData(update)

  React.useEffect(() => loadInData(update), []) 

  React.useEffect(() => {
    const poke = parseInt(router?.query?.selectedPoke as string) ?? -1
    setIsShown(poke > 0)
    setRawSelectedPoke(old => poke > 0 ? poke : old)
  }, [router?.query?.selectedPoke])

  React.useEffect(() => {
    updateFilterData(
      router.query.filters !== undefined 
      && JSON.parse(decodeURIComponent(router.query.filters as string))
    )
  }, [router.query.filters])

  React.useEffect(() => {
    // console.log('roooo ', {...router}, '\n dependency ', [search, pokeDataLoaded, sortOption, sortAscending, router.query.filters])
    filteredPokes.current = []
    const minimumFilters = Object.entries(filterData)
      .filter(entry => entry[1].hasChanged?.())
      .map(entry => entry[1].predicate)
    beginNewFilter()
    const lowered = search.toLowerCase()
    Object.keys(pkData ?? {}).forEach(pokeID => {
      const data = pkData[pokeID]
      const pokeName = data?.pokemon?.identifier ?? ''
      if (
        pokeName !== 'identifier'
        && pokeName.includes(lowered)
        && minimumFilters.every(predicate => predicate?.(pokeID, pkData[pokeID]?.pokemon?.species_id) ?? false)
      ) {
        filteredPokes.current.push(pokeID)
      }
    })
    filteredPokes.current.sort((a, b) => sortOptions[sortOption](a, b) * sortAscending)
    updateFilter()
    updateFilterData()
  }, [search, pokeDataLoaded, sortOption, sortAscending, router.query.filters])


  


  const Row = React.useCallback(({index, style}: any) => (
    <PokedexListItem
      id={filteredPokes.current[index]}
      style={style}
      setSelectedPoke={setSelectedPoke}
    />
  ), [pokeDataLoaded, pokeFiltered])

  return (
    <div className="Pokedex">
      <div className="topbar">

        <input
          type='search'
          className="search"
          placeholder="Search"
          onChange={(event) => startTransition(() => setSearch(event.target.value))}
          // value={search}
        />

        <div className="type-container">

          <div className="basic-text">{`${filteredPokes.current.length} results`}</div>

          <FilterPanelNew update={update} updateRoute={updateRoute}/>

          <div>Sort: </div>
          <button onClick={() => setSortAscending(old => -old)}>
            {sortAscending === 1 
              ? <FontAwesomeIcon icon={faArrowDownShortWide}/> 
              : <FontAwesomeIcon icon={faArrowDownWideShort}/>}
          </button>
          <select onChange={event => setSortOption(event.target.value)}>
            {Object.keys(sortOptions)?.map(key => (
              <option value={key} key={key}>
                {key}
              </option>
            ))}
          </select>

        </div>
      </div>

      <div className={`scrollable-container ${isMobile ? 'mobile': 'desktop'}`}>
        <div className="scrollable" id="pokedex-scrollable">
          <AutoSizer>
            {({height, width}) => (
              <List
                itemCount={filteredPokes.current.length}
                itemSize={96 + 8}
                height={height}
                width={width}

              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </div>

        <div className={"InfoPanel-container " + (isShown ? 'shown' : '') + (windowWidth < 1000 ? ' mobile' : ' desktop')}>
          <PokemonInfoPanel
            id={selectedPoke}
            setSelectedPoke={setSelectedPoke}
          />
          {
            // isShown && 
            isMobile &&
            <div 
              className="exit-button" 
              // style={{
              //   position: 'absolute',
              //   top: 0,
              //   left: 0,
              //   background: 'none',
              //   outline: 'none',
              //   border: 'none',
              //   color: 'gray',
              //   padding: '30px',
              //   fontSize: '1.25rem'
              // }} 
              onClick={() => setSelectedPoke(-1)}
            > <FontAwesomeIcon icon={faArrowLeft}/> </div>
          }
        </div>
      </div>
    </div>
  )
}



