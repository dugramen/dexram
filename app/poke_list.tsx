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
  onPokeSelected?: (poke: PokesType) => any
  currentPoke?: PokesType
}

export const capitalize = (str: string) => str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''

export const getPokeGradientColors = (base: string[], sameColorMix = "black 25%") => {
  const baseTypeColors = base.map(
    (col) => `color-mix(in srgb, ${col} 75%, black 25%)`
  );
  const typeColors = [...baseTypeColors];
  if (typeColors.length < 2) {
    typeColors.push(
      `color-mix(in srgb, ${typeColors[0]} 100%, ${sameColorMix})`
    );
  }
  return typeColors
}

export function PokeList(p: Props) {
  return (
    <>
      <VList style={{ gap: 4, padding: 8 }}>
        {p.result.map((poke) => {
          const baseTypeColors = getTypeColorFromPoke(poke)
          const typeColors = getPokeGradientColors(baseTypeColors)
          return (
            <Row
              key={poke.id}
              style={{
                ["--bg-gradient" as any]: `linear-gradient(to ${
                  baseTypeColors.length > 1 ? `right` : "right"
                }, transparent, ${typeColors[1]} 10%, ${typeColors[0]} 50%, transparent 65%, transparent 100%)`,
                backgroundOrigin: 'border-box',
                // ["view-transition-name" as any]: p.currentPoke?.id !== poke.id ? poke.name : 'none'
                backgroundPosition: p.currentPoke?.id === poke.id ? `-50% 0` : undefined
              }}
              onClick={() => p.onPokeSelected?.(poke)}
              className="
                transition-all
                duration-500 ease-out
                my-1 px-3 py-1 bg-white/0 [background-image:var(--bg-gradient)] group
                border-2 border-solid border-transparent hover:border-white/20
                [background-repeat:no-repeat]
                [background-size:250%_100%]
                [background-position:90%_0]
                hover:[background-position:20%_0]
                active:scale-95
                select-none

                [&:hover_.PokeType:not(:hover)]:text-white/75
                [&:hover_.PokeType:not(:hover)]:[background:var(--type-color)]
                
                __[&:hover_.PokeType:not(:hover)]:border-white/10
                __[&:hover_.PokeType:not(:hover)]:bg-white/75
                __[&:hover_.PokeType:not(:hover)]:[color:var(--type-color)]
              "
            >
              <div className="justify-self-center text-xs">{poke.id}</div>
              <div className="flex flex-row gap-1 items-center justify-self-start flex-1">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                  alt={`${poke.id} icon`}
                  width={96}
                  height={96}
                  style={{
                    ["view-transition-name" as any]: p.currentPoke?.id !== poke.id && `${poke.name} sprite`,
                  }}
                />
                <div className="flex flex-col gap-1">
                  {capitalize(poke.name)}
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
  ...rest
}: ComponentProps<"div">) {
  return (
    <div
      className={`
        hover:cursor-pointer
        rounded-2xl 
        place-items-center w-full 
        text-white/50 hover:text-white/90
        ${className}
      `}
      style={{
        display: "grid",
        gridTemplateColumns: "30px auto 50px 50px",
        gridColumn: "1 / 5",
        // columnGap: "8px",
        width: "100%",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
