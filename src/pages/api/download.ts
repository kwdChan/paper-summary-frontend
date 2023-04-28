import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function download( 
     req: NextApiRequest,
    res: NextApiResponse<Buffer>
    ) {
    const filePath = path.join(process.cwd(), 'public/build.zip'); // replace with the actual path to your file
    const fileContents = await fs.promises.readFile(filePath);
  
    res.setHeader('Content-Disposition', 'attachment; filename="build.zip"');
    res.setHeader('Content-Type', 'text/plain');
    res.send(fileContents);
  }