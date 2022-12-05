import express from 'express'
import dotenv from 'dotenv'
import Replicate from 'replicate-js'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

dotenv.config()
const app = express()
const port = process.env.PORT
const replicate = new Replicate({token: process.env.REPLICATE_API_KEY});
const openJourneyModel = await replicate.models.get("prompthero/openjourney");

const corsOptions = {
    origin: ['https://www.amir-benkoula.fr/', "http://localhost:3000/"],
    optionsSuccessStatus: 200
}

const limiter = rateLimit({
    windowMs: 1 * 10 * 1000, // 10 seconds
    max: 1, // limit each IP to 1 requests per windowMs
  });
  
app.use(limiter);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.post('/text-to-image', (req, res, next) => {
    openJourneyModel.predict({
        prompt : req.body.prompt
    }).then((output) => {
        res.send(output[0]);
    }).catch(next);
})

app.listen(port, () => {
  console.log(`Replicate/Openjourney Text-To-Image API available on ${port}`)
})
