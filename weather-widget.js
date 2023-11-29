// @ts-nocheck
const baseUrl = "http://api.weatherstack.com/current";
const apiKey = "5d0f859dfa03963db5749d3277398c5d";

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
						`?access_key=${apiKey}&query=${latitude}, ${longitude}`
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
			data.location.region + " " + data.location.name;
		this.shadowRoot.querySelector(".weather-widget__temp").textContent =
			data.current.temperature + "°С";
		this.shadowRoot.querySelector(".weather-widget__wind").textContent =
			data.current.wind_speed + "м/c";
		this.shadowRoot.querySelector(".weather-widget__wind_dir").textContent =
			"Направление ветра: " + data.current.wind_dir;
		this.shadowRoot.querySelector(".weather-widget__img").src =
			data.current.weather_icons[0];
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

			.weather-widget__img {
				border-radius: 50%;
				position: absolute;
				width: 45px;
				height: 45px;
				right: 1rem;
				bottom: 1rem;
			}
        </style>

        <div class="weather-widget">
            <h1 class="weather-widget__header">Погода на сегодня</h1>
            <p class="weather-widget__location">Загрузка...</p>
            <span class="weather-widget__temp">--°С</span>
            <span class="weather-widget__wind">--м/с</span>
			<div>
            	<span class="weather-widget__wind_dir">Направление ветра: --</span>
				<img class="weather-widget__img" src="" alt="" />
			</div>
        </div>
        `;
	}
}

customElements.define("weather-widget", WeatherWidget);
