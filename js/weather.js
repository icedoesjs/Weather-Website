let api_key = 'YOUR_OPEN_WEATHER_API_KEY';


let weather_icons = {
    "rain": '<i class="fa-solid fa-cloud-showers-heavy"></i>',
    "thunderstorm": '<i class="fa-solid fa-cloud-bolt"></i>',
    "drizzle": '<i class="fa-solid fa-cloud-rain"></i>',
    "snow": '<i class="fa-regular fa-snowflake"></i>',
    "clear": '<i class="fa-solid fa-sun"></i>',
    "clouds": '<i class="fa-solid fa-cloud-sun"></i>',
    "mist": '<i class="fa-solid fa-smog"></i>',
    "smoke": '<i class="fa-solid fa-x"></i>',
    "haze": '<i class="fa-solid fa-industry"></i>',
    "dust": '<i class="fa-solid fa-wind"></i>',
    "ash": '<i class="fa-solid fa-volcano"></i>',
    'squall': '<i class="fa-solid fa-cloud-sun-rain"></i>',
    "tornado": '<i class="fa-solid fa-tornado"></i>'
}

var el = document.addEventListener('DOMContentLoaded', function() {
    changeWeather('singapore')
    document.querySelector('input').addEventListener('change', function(e) {
        e.preventDefault();
        changeWeather(e.target.value.toLowerCase())
    })
})

function changeWeather(city) {
    console.log(city)
    let geo_code_base = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api_key}`;
    
    fetch(geo_code_base).then((res) => res.json()).then((data) => {
        let lat = data[0].lat 
        let long = data[0].lon
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}`).then((res) => res.json()).then((data) => {
            let w_message = data["weather"][0]["description"].replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            let city_name = data["name"];
            let weather_type = data["weather"][0]["main"].toLowerCase();
            let temp = convert_kelvin(data["main"]["temp"]);
            let feels_like = convert_kelvin(data["main"]["feels_like"]);
            let icon = weather_icons[weather_type];
            let humidity = data["main"]["humidity"] + "%";
            let wind_speed =  mps_to_mph(data["wind"]["speed"]);
            let visibility = m_to_ml(data["visibility"])
            let cloudiness = data["clouds"]["all"] + "%";
            let wind_dir = deg_to_direction(data["wind"]["deg"]);

            document.getElementById('city-name').innerText = city_name;
            document.getElementById('temp').innerText = temp + "°";
            document.getElementById('message').innerText = w_message;
            document.getElementById('feels-like').innerText = "Feels like " + feels_like + "°";
            document.getElementById('weather-icon').innerHTML = icon;
            document.getElementById('humidity').innerText = humidity;
            document.getElementById('visible').innerText = visibility;
            document.getElementById('cloudiness').innerText = cloudiness;
            document.getElementById('windspeed').innerText = wind_speed;
            document.getElementById('winddir').innerText = wind_dir
        });
    }).catch((e) => {
        return show_error('The city provided was not found.')
    })
};

function show_error(error_text) {
    $(function () {
        $('#exampleModal').modal('hide')
    });
    let alert_box = document.getElementById('alert-box')
    alert_box.innerText = error_text;
    alert_box.classList.remove('hide')
    alert_box.classList.add('show');
    setTimeout(() => {
        alert_box.classList.remove('show');
        alert_box.classList.add('hide');
    }, 5000)
}

function validate_alert() {
    let alert_box = document.getElementById('alert-box');
    if (alert_box.classList.contains('show')) {
        alert_box.classList.remove('show');
        alert_box.classList.add('hide')
    }
}

function convert_kelvin(temp) {
    // Convert to F
    let calc = (temp - 273.15) * 9/5 + 32
    return calc.toString().split(".")[0]
}


function deg_to_direction(deg) {
    const val =  Math.floor((deg / 45) + 0.5);
    const dirs = ["↑ N","↗ NE","→ E", "↘ SE","↓ S","↙ SW","← W","↖ NW"];
    return dirs[(val % 8)]
}

function m_to_ml(m) {
    let conv = m/1609;
    return conv.toString().split(".")[0] + " mi"
}

function mps_to_mph(mps) {
    let conv = mps * 2.237;
    return conv.toString().split(".")[0] + " mph"
}

