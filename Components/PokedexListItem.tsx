import React from "react";
import { pkData, otherData } from "./DexData";
import { Type } from "./Shared/Type";
import { capitalize } from "./Utils";
import Sprite from "./Shared/Sprite";
import { WindowWidth } from "../pages/_app";

export const RenderedPokeList = {}

export default function PokedexListItem({id, style, setSelectedPoke}) {
    // const id = filteredPokes.current[index]
    const [poke, setPoke] = React.useState({name: 'ploof', data: pkData[id]})
    const [imageUrl, setImageUrl] = React.useState(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
    const windowWidth = React.useContext(WindowWidth)

    const data = pkData[id]

    const divRef = React.useRef<any>(null)
    const [shouldCollapse, setShouldCollapse] = React.useState(false)

    // React.useEffect(() => {
    //   setShouldCollapse((divRef.current?.clientWidth ?? 0) < 1100)
    // }, [divRef])

    return <div 
      style={style} 
      key={poke.name} 
      className="list-item-container" 
      onClick={() => setSelectedPoke(id)}
      onResize={(event) => {}}
      ref={divRef}
    >
      
      <div className="list-item">

        <Sprite 
            id={id}
            alt={" "}
            height={96}
            width={96}        
        />

        <div className="pokemon-name">{capitalize(pkData[id]?.pokemon?.identifier ?? "")}</div>
        
        {windowWidth >= 1000 &&
          <div className="abilities-container">
          {data?.abilities?.map?.(row => ( 
            <div key={Object.entries(row).toString()}>{ capitalize(otherData.abilities?.[row.ability_id]?.identifier) || '' }</div>
          ))}
        </div>}

        {windowWidth >= 1200 && 
          <div className="stats-container">
            {data.stats?.map(stat => <div key={stat.stat_id}>{stat.base_stat}</div>)}
            {/* {data?.stats?.reduce((acc, val) => acc + `${['', 'hp', 'atk', 'def', 'spa', 'spd', 'spe'][val.stat_id]} ${val.base_stat}  `, '')} */}
            {/* {data?.stats?.map?.(stat => stat?.base_stat).toString().replaceAll(',', ' ') || ''} */}
          </div>
        }

        <div className="types-container">
          {data?.types?.map?.(type => <Type type={type?.type_id ?? 0} key={type?.type_id}/>) || ''}
        </div>
      </div>
    </div> 
}