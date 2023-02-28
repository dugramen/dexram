import '../styles/globals.scss';
import React from 'react';

import type { AppProps } from 'next/app'
export const WindowWidth = React.createContext(0)

export default function App({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = React.useState(0)

  React.useEffect(() => {
    const handleWindowResize = () => {
      setIsMobile(window.innerWidth)
    }
    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return <WindowWidth.Provider value={isMobile}>
    <Component {...pageProps} />
  </WindowWidth.Provider>
  
}
