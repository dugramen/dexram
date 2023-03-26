import React from "react";
import { otherData } from "../DexData";
import { deepCapitalize, simpleHash } from "../Utils";

export default function DescriptionPanel(props) {
    const usedDescriptions = new Map<any, string[]>()
    return (
        <div className="DescriptionPanel">
            {otherData.pokedex_entries?.[props.id]
            ?.filter(row => {
                const hash = (row.flavor_text.replaceAll('\r\n', ' '))
                const isFirstInst = usedDescriptions.has(hash)
                usedDescriptions.set(hash, [...(usedDescriptions.get(hash) ?? []), row.version_id])
                // console.log(usedDescriptions)
                // if (usedDescriptions.has(hash)) { return false }
                return !isFirstInst
            })
            ?.map(row => {
                const hash = (row.flavor_text.replaceAll('\r\n', ' '))
                return <React.Fragment key={row.version_id}>
                    <div className="versions">
                        {usedDescriptions.get(hash)?.map(ver => (
                            <div style={{marginLeft: '1px', color: otherData.versions?.[ver]?.color}} key={ver}>{
                                deepCapitalize(otherData.versions?.[ver]?.identifier)
                            }</div>
                        ))}
                    </div>
                    <div className="description">
                        {row.flavor_text}
                    </div>
                </React.Fragment>
            })}
        </div>
    )
}