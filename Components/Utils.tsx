export async function cacheFetch(request: RequestInfo | URL, options?: any) {
    const cache = await caches.open('pokeapi');
    const response = await cache.match(request)
    if (response !== undefined) {
        console.log('existing request ', request)
        return response
    }
    else {
        console.log('new request ', request)
        await cache.add(request)
        return cache.match(request)
    }
}

export const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
} 