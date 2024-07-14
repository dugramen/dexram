/* eslint-disable @next/next/no-img-element */
"use client";
import { ComponentProps, CSSProperties } from "react";
import { getTypeColorFromPoke, pkTypeColors } from "./constants";
// import { FixedSizeList as List } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";
import { PokesType } from "./page";
import { VList } from "virtua";

interface Props {
  result: PokesType[];
}

export function PokeList(p: Props) {
  return (
    <>
      <VList style={{ gap: 4, padding: 8 }}>
        {p.result.map((poke) => {
          const baseTypeColors = getTypeColorFromPoke(poke).map(
            (col) => `color-mix(in srgb, ${col} 75%, black 25%)`
          );
          const typeColors = [...baseTypeColors];
          if (typeColors.length < 2) {
            typeColors.push(
              `color-mix(in srgb, ${typeColors[0]} 75%, white 25%)`
            );
          }

          return (
            <Row
              key={poke.id}
              style={{
                ["--bg-gradient" as any]: `linear-gradient(to ${
                  baseTypeColors.length > 1 ? `right` : "right"
                }, ${typeColors[0]} 0%, ${typeColors[1]} 50%, hsl(0, 0%, 10%) 75%)`,
                backgroundOrigin: 'border-box',
              }}
              className="
                transition-all
                duration-500
                my-1 px-3 py-1 bg-white/10 [background-image:var(--bg-gradient)] group
                border-2 border-solid border-transparent hover:border-white/20
                [background-repeat:no-repeat]
                [background-size:200%_100%]
                [background-position:150%_0]
                hover:[background-position:0%_0]

                [&:hover_.PokeType:not(:hover)]:text-white/75
                [&:hover_.PokeType:not(:hover)]:[background:var(--type-color)]
                
                __[&:hover_.PokeType:not(:hover)]:border-white/10
                __[&:hover_.PokeType:not(:hover)]:bg-white/75
                __[&:hover_.PokeType:not(:hover)]:[color:var(--type-color)]
              "
            >
              <div className="justify-self-center">{poke.id}</div>
              <div className="flex flex-row gap-1 items-center justify-self-start flex-1">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                  alt={`${poke.id} icon`}
                  width={96}
                  height={96}
                />
                <div className="flex flex-col gap-1">
                  {poke.name[0].toUpperCase() + poke.name.slice(1)}
                  <div className="flex flex-row gap-1">
                    {baseTypeColors.map((col, i) => (
                      <div
                        key={i}
                        style={{
                          // background: col,
                          ["--type-color" as any]: col,
                        }}
                        className="
                          PokeType
                          transition-all duration-200 
                          rounded-lg px-1 py-[1px]
                          text-xs
                          border-2 border-solid border-white/15
                          [background:var(--type-color)] 
                          text-white/75 
                          hover:bg-white/75 hover:[color:var(--type-color)]
                          __hover:border-white/75 __hover:text-white/74 __hover:[background:var(--type-color)]
                        "
                      >
                        {poke.pokemon_v2[0].pokemon_type_v2[i]?.type_v2?.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="justify-self-center">{poke.hatch_counter}</div>
              <div className="justify-self-center">{poke.capture_rate}</div>
            </Row>
          );
        })}
      </VList>
    </>
  );
}

export function Row({
  children,
  style = {},
  className = "",
}: ComponentProps<"div">) {
  return (
    <div
      className={`
        hover:bg-red-800/50 
        hover:cursor-pointer
        rounded-2xl 
        place-items-center w-full 
        text-white/50 hover:text-white/90
        ${className}
      `}
      style={{
        display: "grid",
        gridTemplateColumns: "50px auto 50px 50px",
        gridColumn: "1 / 5",
        // columnGap: "8px",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
