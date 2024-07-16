/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { getTypeColorFromPoke, pkTypeColors } from "./constants";
import { PokesType } from "./page";
import { PokeList, capitalize, getPokeGradientColors } from "./poke_list";
import { flushSync } from "react-dom";

interface Props {
  pokes: PokesType[];
}

export default function Client(p: Props) {
  const [selectedPoke, setSelectedPoke] = useState<PokesType | undefined>();
  const typeColors = getPokeGradientColors(
    selectedPoke ? getTypeColorFromPoke(selectedPoke) : ["black"],
    "white 40%"
  );

  return (
    <div className="flex flex-row h-full w-full items-stretch justify-stretch">
      {/* <Row
        style={{
          position: "sticky",
          top: 0,
        }}
        className="bg-black hover:bg-black p-2"
      >
        <div className="justify-self-center">ID</div>
        <div className="justify-self-start">Name</div>
        <div className="justify-self-center">Egg Steps</div>
        <div className="justify-self-center">Capture Rate</div>
      </Row> */}
      <div className="flex-1 h-full min-w-full sm:min-w-[500px]">
        <PokeList
          result={p.pokes}
          currentPoke={selectedPoke}
          onPokeSelected={(poke) => {
            (document as any).startViewTransition?.(() => {
              flushSync(() => {
                setSelectedPoke(poke);
              });
            });
          }}
        />
      </div>
      <div className="min-w-[500px] p-4">
        <div
          style={{
            background: `
              linear-gradient(to bottom, transparent, black 50%, black),
              linear-gradient(to right, ${typeColors[0]}, ${typeColors[1]})
            `,
            boxShadow: `inset 0 0 0 8px rgba(0,0,0, 0.2)`,
            // opacity: 0.9,
            // backgroundOrigin: "border-box",
            // backgroundRepeat: 'no-repeat',
            // borderImage: `linear-gradient(to bottom, white, transparent)`
          }}
          className="
            flex-1 flex flex-col items-center duration-500 w-full h-full
            rounded-3xl p-0
            
            _border-4 _border-solid _border-white/10
          "
        >
          <div className="text-white/60 font-semibold text-3xl self-start m-8 z-10">
            {capitalize(selectedPoke?.name ?? "")}
          </div>
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPoke?.id}.png`}
            alt="icon"
            width={128}
            height={128}
            style={{
              ["view-transition-name" as any]: `${selectedPoke?.name} sprite`,
              imageRendering: "pixelated",
              scale: 2,
              transformOrigin: "100% 80%",
              alignSelf: 'flex-end'
            }}
          />
          <div
            className="w-full flex-1 bg-neutral-950/0 rounded-t-[40px] mt-auto "
            style={
              {
                // background: `
                //   linear-gradient(to bottom, transparent, rgba(0,0,0,.5) 40px, rgba(0,0,0,.5) calc(100% - 40px), transparent),
                //   linear-gradient(to right, transparent, rgba(0,0,0,.5) 40px, rgba(0,0,0,.5) calc(100% - 40px), transparent)
                // `
              }
            }
          ></div>
        </div>
      </div>
    </div>
  );
}
