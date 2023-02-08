const http=require('http');
require('dotenv').config()
const {Telegraf} = require('telegraf')
const bot = new Telegraf(process.env.token)
const birthdays = require('./birthdays.json')
const holidays = require('./holidays.json')
const hostname='0.0.0.0'
const port=3000;
const server = http.createServer((req,res)=>{
  res.statusCode=200;
  res.setHeader('Content-type','text/plain');
  res.end('Hello world')
})
bot.start((ctx) => {
  const chatId = ctx.chat.id
  const userName = ctx.chat.last_name
  ctx.reply(`Welcome ${userName}✨`)
  ctx.reply(`Type /list to see your friends birthday!!`)
})

bot.command('/time', (ctx) => {
  const chatId = ctx.chat.id
  const today = new Date().toISOString()
  ctx.reply(today)
})

bot.hears([/Hi|Hello|hi|hello|hey|Hii/], (ctx) => {
  ctx.reply('Hi ✋ ')
})

bot.command('/list', (ctx) => {
  const chatId = ctx.chat.id
  birthdays.forEach((item) => {
    ctx.reply(`${item.name} | ${item.date}`)
  })
})

const getUpcomingBirthdays = () => {
  const today = new Date().toISOString()
  let currentDate = today.substring(5, 10)
  const upcomingBirthdays = birthdays.filter((birthday) => {
    const bd = birthday.date.substring(5, 10)
    return bd === currentDate
  })
  return upcomingBirthdays
}

const getComingFeast = () => {
  const today = new Date().toISOString()
  let currentDate = today.substring(5, 10)
  const comingFeast = holidays.filter((holiday) => {
    const bd = holiday.date.substring(5, 10)
    return bd === currentDate
  })
  return comingFeast
}

setInterval(() => {
  const upcomingBirthdays = getUpcomingBirthdays()
  const comingFeast = getComingFeast()
  comingFeast.forEach((holiday) => {
    bot.telegram.sendMessage(-1001434326296, `Happy ${holiday.name}`)
  })
  upcomingBirthdays.forEach((birthday) => {
    bot.telegram.sendMessage(-1001434326296, `Hey, today is ${birthday.name}'s Birthday! 🎂`)
  })
}, 24 * 60 * 60 * 1000)
server.listen(port,hostname,()=>{
  console.log(`server running at http://${hostname}:${port}/`)
});
bot.launch()
