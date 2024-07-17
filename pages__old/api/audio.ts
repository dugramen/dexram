
import fetch from 'isomorphic-unfetch';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ message: 'Missing URL parameter' });
  }

  try {
    const audioResponse = await fetch(url);
    const audioBuffer = await audioResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audio', error });
  }
}