const cityInput= document.getElementById("cityInput");
const searchBtn= document.getElementById("searchBtn");
const message= document.getElementById("message");
const weatherCard= document.getElementById("weatherCard");
const weatherIcon= document.getElementById("weatherIcon");
const cityName= document.getElementById("cityName");
const temperature= document.getElementById("temperature");
const description= document.getElementById("description");
const humidity= document.getElementById ("humidity");
const wind= document.getElementById("wind");

function getWeatherInfo(code){

    if (code === 0) return { icon: "☀️", text: "Clear sky" };
    if (code === 1) return { icon:"🌤️", text: "Mainly clear" };
    if (code === 2) return { icon:  "⛅", text: "Partly cloudy" };
    if (code === 3) return { icon:  "☁️", text: "Overcast" };
    if (code >= 45 && code <= 48) return { icon:"🌫️", text: "Foggy"}; 
    if (code >= 51 && code <= 57) return {icon :"🌦️", text: "Drizzle"};
    if (code >= 61 && code <= 67) return { icon : "🌧️", text: "Rain"};
    if (code >= 71 && code <= 77) return {icon: "❄️",text: "Snow" };
    if (code >= 80 && code <= 82) return {icon:"🌧️", text: "Rain showers" };
    if (code >= 95 && code <= 99) return {icon:"⛈️", text: "Thunderstorm"};
    return{ icon:"🌡️", text : "Unknown" };
}

function showMessage(text, type=""){
    message.textContent = text;
    message.className = "message " + type;
}

function clearMessage(){
    message.textContent ="";
    message.className = "message";
}

function setLoading(isLoading) {
    searchBtn.disabled = isLoading;
    searchBtn.textContent = isLoading ?"..." : "Search";
}

async function getWeather(city) {
    if (city.trim() === "") {
        showMessage("Please enter a city name", "error");
        return;
    }

    setLoading(true);
    showMessage("Loading...", "loading");
    weatherCard.classList.add("hidden");

    try {
        // ---- Step A: Get coordinates from city name ----
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if(!geoData.results || geoData.results.length === 0) {
            showMessage("City not found. Try again!","error");
            setLoading(false);
            return;
        }
        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location. longitude;
        const displayName =  `${location.name}, ${location.country}`;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current_weather;
        const weatherInfo = getWeatherInfo(current.weathercode);

        weatherIcon.textContent = weatherInfo.icon;
        cityName.textContent = displayName;
        temperature.textContent = `${Math.round(current.temperature)}°C`;
        description.textContent = weatherInfo.text;
        humidity.textContent = `${weatherData.hourly.relativehumidity_2m[0]}%`;
        wind.textContent = `${current.windspeed} km/h`;

        clearMessage();
        weatherCard.classList.remove("hidden");

    }catch (error){
        console.error ("Error:",error);
        showMessage("something went wrong.Try again!", "error");
    } finally{
        setLoading(false);
    }
 }  

 searchBtn.addEventListener("click",()=>{
    getWeather(cityInput.value);
 });

 cityInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter"){
        getWeather(cityInput.value);
    }
 });