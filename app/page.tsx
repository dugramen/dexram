import prisma from "../prisma/module";
import Client from "./client";
import { PokeList, Row } from "./poke_list";

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
    <Client pokes={result}></Client>
  );
}
