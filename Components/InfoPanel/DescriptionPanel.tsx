import React from "react";
import { otherData } from "../DexData";

const simpleHash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
};

export default function DescriptionPanel(props) {
    const usedDescriptions = new Set()
    return (
        <div className="DescriptionPanel">
            {otherData.pokedex_entries?.[props.id]?.map(row => {
                const hash = simpleHash(row.flavor_text)
                if (usedDescriptions.has(hash)) { return [] }
                usedDescriptions.add(hash)
                return <React.Fragment key={row.version_id}>
                    <div>
                        {row.version_id}
                    </div>
                    <div>
                        {row.flavor_text}
                    </div>
                </React.Fragment>
            })}
        </div>
    )
}