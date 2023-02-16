const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()

const { OPENAI_API_KEY } = process.env
const { Configuration, OpenAIApi } = require('openai')
const logger = require('../../logger')

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
  logger.info('/sendmsg 用户询问问题：', keyword)
  const { code, msg} = await senMsg(keyword)
  if (code === 200) {
    logger.info('/sendmsg openai 返回结果', msg)
  } else {
    logger.error('/sendmsg 异常', msg)
  }
  res.send({
    code,
    msg,
  })
})

module.exports = router