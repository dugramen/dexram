/* eslint-disable @next/next/no-img-element */
import prisma from "../prisma/module";
import { PokeList } from "./poke_list";

export type PokesType = Awaited<ReturnType<typeof get_pokes>>[number];
const get_pokes = async () =>
  await prisma.pokemon_species_v2.findMany({
    include: {
      pokemon_v2: {
        include: {
          pokemon_type_v2: {
            include: {
              type_v2: true,
            },
          },
        },
      },
    },
  });

export default async function Page() {
  const result = await get_pokes();

  const tables = Object.keys(prisma).filter((k) => prisma[k]?.fields);
  const groups = {};
  let last = "wouldn't";
  for (const t of tables) {
    if (t.startsWith(last)) {
      groups[last] = [...(groups[last] ?? []), t];
    }
    last = t;
  }

  return (
    <div className="flex flex-col h-full w-full items-stretch justify-stretch">
      <PokeList result={result} />
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          // overflow: 'auto'
        }}
      >
        <Row
          style={{
            position: "sticky",
            top: 0,
          }}
          className="bg-black hover:bg-black"
        >
          <div className="justify-self-center">ID</div>
          <div className="justify-self-start">Name</div>
          <div className="justify-self-center">Egg Steps</div>
          <div className="justify-self-center">Capture Rate</div>
        </Row>
        
      </div> */}
    </div>
  );
}
