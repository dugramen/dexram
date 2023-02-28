import React from "react";
import { capitalize } from "./Utils";
import { otherData } from "./DataEnums";

export const typeMap = {
    'Normal': 'A8A77A',
    'Fighting' : 'C22E28',
    'Flying' : 'A98FF3',
    'Poison' : 'A33EA1',
    'Ground' : 'E2BF65',
    'Rock' : 'B6A136',
    'Bug' : 'A6B91A',
    'Ghost' : '735797',
    'Steel' : 'B7B7CE',
    'Fire': 'EE8130',
    'Water': '6390F0',
    'Grass' : '7AC74C',
    'Electric' : 'F7D02C',
    'Psychic' : 'F95587',
    'Ice' : '96D9D6',
    'Dragon' : '6F35FC',
    'Dark' : '705746',
    'Fairy' : 'D685AD',
}

export function Type ({type}) {
    let typeName = otherData.types?.[type]?.identifier ?? `${type}`
    return <span style={{
        color: '#' + typeMap[capitalize(typeName)],
        opacity: '.8',
        fontWeight: 'bold'
    }}>{capitalize(typeName)}</span>
}