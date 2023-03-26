// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const cache = require('memory-cache')
import * as fs from 'fs'
import { parseStream } from 'fast-csv'
import path from 'path'

// type Data = {
//   name: string
// }

interface Handler {
  handler: (row, output) => any,
  selector: (output, queryParams?) => {}
}

const dataGrouper = (selectors: number[], row: any, output, entriesAreArrays = false, fullRow: any = undefined) => {
  if (fullRow === undefined) {
    fullRow = [...row]
    row = row.map(item => {
      const int = parseInt(item)
      return Number.isNaN(int) ? item : int
    })
    // row = row.filter( (item, index) => !selectors.includes(index) )
  }
  const group_id = selectors.pop()
  if (group_id !== undefined) {
    // const group = row[group_id]
    const pokeId = isNaN(parseInt(fullRow[group_id])) ? 'headers' : fullRow[group_id]
    if (pokeId === 'headers') { output.headers = row; return }
    if (selectors.length > 0) {
      if (!output.hasOwnProperty(pokeId)) {
        output[pokeId] = {}
      }
      dataGrouper(selectors, row, output[pokeId], entriesAreArrays, fullRow)
    } 
    else {
      if (entriesAreArrays) {
        if (!output.hasOwnProperty(pokeId)) {
          output[pokeId] = [row]
        } 
        else {
          output[pokeId].push(row)
        }
      } 
      else {
        output[pokeId] = row
      }
    }
  }
}
const grouperHof = (areArrays, groups = [0]) => (r, o) => dataGrouper([...groups], r, o, areArrays)

const hands = {
  pokemon_moves: grouperHof(true, [0, 1]),
}

const handlers: {[a: string]: Handler} = {
  pokemon_moves: {
    handler: grouperHof(true, [0, 1]),
    selector: (output, queryParams) => {
      if (queryParams?.[1]) {
        return {...output[queryParams[1]], headers: output.headers}
      }
      const result = {}
      const versions = Object.getOwnPropertyNames(output)
      for (let version of versions.slice(0, -1)) {
        for (let id of Object.getOwnPropertyNames(output[version])) {
          result[id] = output[version][id]
        }
      }
      // return {...result, headers: output.headers}
      return result
    }
  },
  pokemon_stats: {
    handler: grouperHof(true),
    selector: output => output
  },
  pokemon_types: {
    handler: grouperHof(true),
    selector: output => output
  },
  pokemon_abilities: {
    handler: grouperHof(true),
    selector: output => output
  },
  abilities: {
    handler: grouperHof(false),
    selector: o => o
  },
  species_egg_groups: {
    handler: grouperHof(true),
    selector: o => o
  },
  type_efficacy: {
    handler: grouperHof(true, [1]),
    selector: o => o
  },
  evolutions: {
    handler: grouperHof(true, [1]),
    selector: o => o
  },
  forms: {
    handler: grouperHof(true, [3]),
    selector: a => a
  },
  pokedex_entries: {
    handler: grouperHof(true, [0, 2]),
    selector: a => a[9],
  },
  encounters: {
    handler: grouperHof(true, [4]),
    selector: a => a
  },
}

const default_handler: Handler = {
  handler: grouperHof(false),
  selector: output => output
}

export default async function dataHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  cache.clear()
  
  const start = Date.now();
  const query = req.query.params?.[0] ?? null
  let selected_handler = default_handler
  if (query && handlers.hasOwnProperty(query)) {
    selected_handler = handlers[query]
  }

  const cacheKey = `data/${query ?? ''}`
  if (cacheKey === `data/`) {
    res.status(200).json({greeting: 'Hello there from pokedex api'})
    return
  }

  let output = cache.get(cacheKey)
  if (output === null || output === undefined) {
    console.log('new cache')
    output = {}
    const directory = path.join(process.cwd(), 'data') + `/${query}.csv`
    
    const exists = new Promise(res => {
      fs.access(directory, (err) => {
        if (err) {
          console.error(err)
          res(false)
          return
        }
        res(true)
      })
    })

    if (await exists) {
      const stream = fs.createReadStream(directory)
      await new Promise((res) => {
        parseStream(stream)
          .on('error', error => console.error(error))
          .on('data', row => {
            selected_handler.handler(row, output)
            // handlers.pokemon_moves(row, output)
          })
          .on('end', (rowCount: number) => {
            cache.put(cacheKey, output)
            res('finished')
          }); 
        })
    }
  }
  
  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
  res.status(200).json({...selected_handler.selector(output, req.query.params), headers: output.headers})
}
