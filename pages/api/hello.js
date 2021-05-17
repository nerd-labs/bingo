// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//
const publicIp = require('public-ip');


export default async (req, res) => {
    console.log(await publicIp.v4());

    res.status(200).json({ name: 'John Doe' })
}
