import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';

export default function(
    req: NextApiRequest,
    res: NextApiResponse
) {
    
    fs.readdir('public/impulse_waves', (err, files) => {
        files = files ?? []
        // console.log('served ', files)
        res.status(200).json(files)
    })
}
