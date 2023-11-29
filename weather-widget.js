// @ts-nocheck
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "dd5f3a82b623c4a7d261ad991ba50c73";
// const baseUrl = "http://api.weatherstack.com/current";
// изначально делал через эту апиху, но она не позволяет испольховать шифрование через HTTPS протокол
// поэтому использую апи из примера и украл чужой apikey, не хочу светить данные банковской карты

class WeatherWidget extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.fetchWeatherData();
		this.render();
	}

	fetchWeatherData() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;

				fetch(
					baseUrl +
						`?appid=${apiKey}&lat=${latitude}&lon=${longitude}&lang=ru&units=metric`
				)
					.then((response) => response.json())
					.then((data) => this.dataUpdate(data))
					.catch((err) => console.error(err));
			});
		} else {
			alert("Геолокация не поддерживается.");
		}
	}

	dataUpdate(data) {
		console.log(data);
		this.shadowRoot.querySelector(".weather-widget__location").textContent =
			data.name;

		this.shadowRoot.querySelector(
			".weather-widget__list-temp"
		).textContent = `${data.main.temp} °С`;

		this.shadowRoot.querySelector(
			".weather-widget__list-temp_feels-likes"
		).textContent = `Осушается как ${data.main.feels_like} °С`;

		this.shadowRoot.querySelector(
			".weather-widget__list-wind"
		).textContent = `Cкорость ветра: ${data.wind.speed} м/c;`;

		this.shadowRoot.querySelector(
			".weather-widget__list-description"
		).textContent = `Описание: ${data.weather[0].description}`;

		this.shadowRoot.querySelector(
			".weather-widget__img"
		).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
		this.shadowRoot.querySelector(".weather-widget__img").alt =
			data.weather[0].icon;
	}

	render() {
		this.shadowRoot.innerHTML = `
        <style>
			:host {
				font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
			}
		
            .weather-widget {
				position: relative;
				width: fit-content;
                height: 100%;
                background-color: #e2e2e2;
				border-radius: 1rem;
                padding: 1rem 2rem;
            }

            .widget__header {
				font-size: 1rem;
            }
			
			.weather-widget__info {
				display: flex;
			}

			.weather-widget__img {
				border-radius: 50%;
				width: 45px;
			}
			
			.weather-widget__list {
				padding: 0;
				list-style-type: none; 
			}
			.weather-widget__location, .weather-widget__list-temp {
				font-weight: 700;
			}
        </style>

        <div class="weather-widget">
            <h1 class="weather-widget__header">Погода на сегодня</h1>
			<div class="weather-widget__info">
				<p class="weather-widget__location">
					<strong>Загрузка...</strong>
				</p>
				<img class="weather-widget__img" src="" atl=""/>
			</div>
			<ul class="weather-widget__list">
				<li class="weather-widget__list-temp">--°С</li>
				<li class="weather-widget__list-temp_feels-likes">Осушается как --°С</li>
				<li class="weather-widget__list-wind">Cкорость ветра: --м/с</li>
				<li class="weather-widget__list-description">Описание: --</li>
			</ul>
        </div>
        `;
	}
}

customElements.define("weather-widget", WeatherWidget);
