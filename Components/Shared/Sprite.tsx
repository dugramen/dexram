import React, { DetailedHTMLProps, HtmlHTMLAttributes } from "react";
import Image from "next/image";

interface Props  {
    id,
    [a: string]: any,
}

export default function Sprite({id, ...props}: Props) {
    // const {id} = props
    
    const [url, setUrl] = React.useState(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)

    React.useEffect(() => {
        setUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`)
    }, [id])

    // return <Image 
    //     src={url} 
    //     alt={""}
    //     onError={() => {setUrl('/000.png')}}
    //     {...props}
    // />

    return <img
        className="sprite"
        src={url}
        onError={() => {setUrl('/000.png')}}
        // width={192}
        // height={192}
        {...props}
    />
}