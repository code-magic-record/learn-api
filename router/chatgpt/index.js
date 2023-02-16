const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()

const { OPENAI_API_KEY } = process.env
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

async function senMsg(msg) {
  let result = {
    code: 0,
    msg: ''
  }
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: msg,
      temperature: 0,
      max_tokens: 4000,
    })
    result = {
      code: 200,
      msg: completion.data.choices[0].text
    }
  } catch(e) {
    result = {
      code: 500,
      msg: 'openai api error, 请重试！'
    }
  }
  return result
}

router.post('/sendmsg', async (req, res) => {
  const { keyword } = req.body;
  const { code, msg} = await senMsg(keyword)
  res.send({
    code,
    msg,
  })
})

module.exports = router