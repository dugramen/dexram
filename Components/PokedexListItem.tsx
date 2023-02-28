import React from "react";
import { pkData, otherData } from "./DataEnums";
import { Type } from "./Type";
import { capitalize } from "./Utils";
import Sprite from "./Sprite";
import { WindowWidth } from "../pages/_app";

export const RenderedPokeList = {}

export default function PokedexListItem({id, style, setSelectedPoke}) {
    // const id = filteredPokes.current[index]
    const [poke, setPoke] = React.useState({name: 'ploof', data: pkData[id]})
    const [imageUrl, setImageUrl] = React.useState(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
    const isMobile = React.useContext(WindowWidth) < 1000

    const data = pkData[id]

    const divRef = React.useRef<any>(null)
    const [shouldCollapse, setShouldCollapse] = React.useState(false)

    React.useEffect(() => {
      setShouldCollapse((divRef.current?.clientWidth ?? 0) < 1000)
    }, [divRef])

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
        
        {
          !isMobile && <>
            <div className="abilities-container">
              {data?.abilities?.map?.(row => ( 
                <div key={Object.entries(row).toString()}>{ capitalize(otherData.abilities?.[row.ability_id]?.identifier) }</div>
              ))}
            </div>

            <div className="stats-container">
              {data?.stats?.map?.(stat => stat?.base_stat).toString().replaceAll(',', ' ')}
            </div>
          </>
        }

        <div className="types-container">
          {data?.types?.map?.(type => <Type type={type?.type_id ?? 0} key={type?.type_id}/>)}
        </div>
      </div>
    </div> 
}