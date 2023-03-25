import React from "react";
import { otherData } from "../DexData";
import { simpleHash } from "../Utils";

export default function DescriptionPanel(props) {
    const usedDescriptions = new Set()
    return (
        <div className="DescriptionPanel">
            {otherData.pokedex_entries?.[props.id]?.map(row => {
                const hash = simpleHash(row.flavor_text)
                if (usedDescriptions.has(hash)) { return [] }
                usedDescriptions.add(hash)
                return <React.Fragment key={row.version_id}>
                    <div className="versions">
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