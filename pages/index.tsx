import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {cacheFetch, capitalize} from '../Components/Utils';
import Type from "../Components/Type";

export default function Home() {
  
  const [pokeList, setPokeList] = React.useState<Map<string, string>>(new Map())
  const [pokeData, setPokeData] = React.useState<Object>({})
  const filteredPokes = React.useRef<Array<{name: string, url: string}>>([])
  const [search, setSearch] = React.useState<string>("")
  const [typeFilter, setTypeFilter] = React.useState<number>(0)
  const amountToLoad = 10

  React.useEffect(() => {
    
    console.log('ran once')
    cacheFetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
      .then(res => res?.json())
      // .then(data => setPokeList(data?.results))
      .then(data => {
        const map = new Map<string, string>()
        data.results.forEach(poke => map.set(poke.name, poke.url))
        setPokeList(map)
      })
  }, [])
    
  React.useEffect(() => {
    const filterCallback = (filters: Array<object> = []) => {
      filteredPokes.current = []
      pokeList?.forEach((url, poke) => {
        if ( poke !== undefined
          && poke.includes(search)
          && (
            filters.length === 0
            || filters.every(filter => poke in filter)
          )
        ) {
          filteredPokes.current.push({name: poke, url})
        }
      })
      loadFirst()
    }
    if (typeFilter > 0 && typeFilter <= 18) {
      cacheFetch(`https://pokeapi.co/api/v2/type/${typeFilter}`)
      .then(res => res?.json())
      .then(data => {
        const typeMap = data.pokemon.reduce((accum, val) => ({...accum, [val.pokemon.name]: true}), {})
        filterCallback([typeMap])
      })
    } else {
      filterCallback()
    }

  }, [pokeList, search, typeFilter])

  const loadFirst = () => {
    console.log(filteredPokes)
    setPokeData({})
    loadNext()
  }

  const loadNext = () => {
    setPokeData(old => {
      const currentLength = Object.keys(old).length
      let next = {...old}
      for (let i = 0; i < 10; i++) {
        if (currentLength + i >= filteredPokes.current.length) {
          break;
        }
        const poke = filteredPokes.current[currentLength + i]
        next = {...next, [poke.name]: undefined}
        cacheFetch(poke.url)
          .then(res => res?.json())
          .then(data => (
            setPokeData(old2 => {
              if (poke.name in old2) {
                return {
                  ...old2,
                  [poke.name]: data
                }
              }
              return {...old2}
            })
          ))
      }
      return next
    })
  }

  const pokeDataLength = Object.keys(pokeData).length
  return (
    <div className="Pokedex">
      <div className="topbar">
        <input 
          className="search"
          placeholder="Search"
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />

        <input
          type={'number'}
          min={0}
          max={18}
          value={typeFilter}
          onChange={event => setTypeFilter(Number(event.target.value))}
        />
      </div>

      <div className="scrollable" id="pokedex-scrollable">
        <InfiniteScroll 
          next={loadNext} 
          hasMore={pokeDataLength < pokeList.size - 20}  
          loader={undefined} 
          dataLength={pokeDataLength}
          scrollableTarget="pokedex-scrollable"
        >
          {Object.keys(pokeData).map(p => ({name: p, data: pokeData[p]})).map(poke => (
            <div className="list-item" key={poke.name}>
              {/* <div>{`#${poke.id}`}</div> */}
              <img 
                src={poke.data?.sprites.front_default} 
                alt={"front default"}
                height={96}
                width={96}
              />
              <div className="pokemon-name">{capitalize(poke.name)}</div>

              <div className="type-container">
                {poke.data?.types.map(type => <Type type={type.type.name} key={type.type.name}/>)}
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}