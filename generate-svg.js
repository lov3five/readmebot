const WEATHER_API_KEY = process.env.WEATHER_API_KEY

let fs = require('fs')
let got = require('got')
let qty = require('js-quantities')
let formatDistance = require('date-fns/formatDistance')

let WEATHER_DOMAIN = 'http://dataservice.accuweather.com'

const emojis = {
    1: '☀️',
    2: '☀️',
    3: '🌤',
    4: '🌤',
    5: '🌤',
    6: '🌥',
    7: '☁️',
    8: '☁️',
    11: '🌫',
    12: '🌧',
    13: '🌦',
    14: '🌦',
    15: '⛈',
    16: '⛈',
    17: '🌦',
    18: '🌧',
    19: '🌨',
    20: '🌨',
    21: '🌨',
    22: '❄️',
    23: '❄️',
    24: '🌧',
    25: '🌧',
    26: '🌧',
    29: '🌧',
    30: '🥵',
    31: '🥶',
    32: '💨',
}

// Change width of bubbles depending on the day
let dayBubbleWidths = {
    Monday: 235,
    Tuesday: 235,
    Wednesday: 260,
    Thursday: 245,
    Friday: 220,
    Saturday: 245,
    Sunday: 230,
}

// Time working at the company X
const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', {
    weekday: 'long'
}).format(
    today
)

const startDateWorkingAtGU = formatDistance(new Date(2023, 2, 13), today, {
    addSuffix: false,
})

// The weather today
// AccuWeather Info 
/* [{
    "Version": 1,
    "Key": "353981",
    "Type": "City",
    "Rank": 11,
    "LocalizedName": "Ho Chi Minh City",
    "Country": {
        "ID": "VN",
        "LocalizedName": "Vietnam"
    },
    "AdministrativeArea": {
        "ID": "SG",
        "LocalizedName": "Ho Chi Minh"
    }
}] */
const locationKey = '353981'
let APIforecast = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${WEATHER_API_KEY}`

got(APIforecast, {
        prefixUrl: WEATHER_DOMAIN
    })
    .then(response => {
        let json = JSON.parse(response.body)
        const degF = Math.round(json.DailyForecasts[0].Temperature.Maximum.Value)
        const degC = Math.round(qty(`${degF} degF`).to('degC').scalar)
        const icon = json.DailyForecasts[0].Day.Icon

        fs.readFile('template.svg', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }

            data = data.replace('{degC}', degC)
            data = data.replace('{degF}', degF)
            data = data.replace('{weatherEmoji}', emojis[icon])
            //data = data.replace('{startDateWorkingAtGU}', startDateWorkingAtGU)
            data = data.replace('{todayDay}', todayDay)
            data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay])

            data = fs.writeFile('autochat.svg', data, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        })
    })
    .catch(err => {
        console.error(err)
    })