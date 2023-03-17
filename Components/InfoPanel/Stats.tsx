import React from "react";
import { pkData } from "../DexData";

function StatBar({percent}) {
    return <div className="stat-bar-container">
        <div className="stat-bar-bg">
            <div 
                className="stat-bar-fg"
                style={{
                    backgroundColor: `hsl(${Math.max(percent * 255 - 20, 0)}, 80%, 45%)`,
                    width: `${100 * percent}%`,
                }}
            />
        </div>
    </div>
}

export default function Stats({id}) {
    return (
    <div className="StatsPanel">
        <div className="base-stats">
            {pkData?.[id]?.stats
            ?.map(stat => {
                return <React.Fragment key={stat.stat_id}>
                    <div>{['Stat', 'HP', 'Attack', 'Defense', 'Sp.Attack', 'Sp.Defense', 'Speed'][stat.stat_id]}</div>

                    <div>{stat.base_stat}</div>

                    <StatBar percent={stat.base_stat / 255.0}/>
                </React.Fragment>
            })
            .concat(
            <>
                <div>Total</div>
                <div>{pkData?.[id]?.stats?.reduce((accum, stat) => accum + stat.base_stat, 0)}</div>
                <StatBar percent={(pkData[id]?.stats?.reduce((accum, stat) => accum + stat.base_stat, 0) ?? 0) / (255*6)}/>
            </>)
            }
        </div>
    </div>
    )
}