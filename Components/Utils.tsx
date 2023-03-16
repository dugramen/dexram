
export async function cacheFetch(request: RequestInfo | URL, options?: any) {
    const cache = await caches.open('pokeapi');
    const response = await cache.match(request)
    if (response !== undefined) {
        // console.log('old request ', request)
        return response
    }
    else {
        // console.log('new request ', request)
        await cache.add(request)
        return cache.match(request)
    }
}

export const capitalize = (string: string) => {
    return (string?.charAt(0).toUpperCase() + string?.slice(1)) ?? '';
} 

export function snakeCaser(...strings: (any)[]) {
    let result = ''
    let isFirst = true
    for (let i = 0; i < strings.length; i++) {
      if (strings[i] === '' || strings[i] === undefined || strings[i] === null) { 
        continue 
      }
      if (!isFirst) {
        result += '_'
      }
      isFirst = false
      result += strings[i]
    }
    return result
  }

export function parseProse(text: string, data) {
    const ntext = text?.split(/(?=\$)/g).reduce((accum, val) => {
        // console.log({val})
        if (val[0] === '$') {
            let snip = val.slice(1)
            const search = Object.getOwnPropertyNames(data).find((key) => snip.startsWith(key))
            if (search) {
                snip = snip.replace(search, '')
                return accum + ' ' + data?.[search]?.toString() + snip
            }
            return accum + ' ' + val
        } 
        return accum + ' ' + val
    }, '')

    const [s, ...rest] = ntext?.split('[') ?? []
    return s + rest.reduce((acc, sec) => {
        const [split, end] = sec.split('}')

        const inSquareBracket = split.slice(0, split.indexOf(']'))
        if (inSquareBracket !== '') {
            return acc + inSquareBracket + end
        } else {
            return acc + split.slice(split.indexOf(':') + 1, split.length) + end
        }
    }, '')
} 

export const blankEntryDasher = (text) => text === "" ? "--" : text
