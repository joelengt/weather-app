(function(){
	// -- Constantes -------------------------------------------------------------
	// APISs time city

	var API_WORLDTIME_KEY = 'd6a4075ceb419113c64885d9086d5'
	var API_WORLDTIME = 'https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key='+ API_WORLDTIME_KEY +'&q='
	// APIs weather, city
	var API_WEATHER_KEY = '80114c7878f599621184a687fc500a12'
	var API_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + API_WEATHER_KEY + '&'
	var API_FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast?APPID=' + API_WEATHER_KEY + '&'
	var IMG_WEATHER = 'http://openweathermap.org/img/w/'

	var today = new Date()
	var timeNow = today.toLocaleTimeString()

	// creando variables desde jquery
	var $body =$('body')
	var $AllCities = $('.AllCites')
	var $loader =$('.loader')
	var nombreNuevaCiudad=$('[data-input="cityAdd"]')
	var buttonAdd=$('[data-button="add"]')
	var buttonLoad= $('[data-save-cities]')

	$(buttonAdd).on('click',addNewCity)
	$(nombreNuevaCiudad).on('keypress', function (event){
		if(event.which=13){
		   addNewCity()
		}
	})
	$(buttonLoad).on('click',LoadSaveCities)

	// creo una varible para guardar los valores del API
	var cities=[]
	var cityWeather={}
	cityWeather.zone
	cityWeather.icon
	cityWeather.temp
	cityWeather.temp_max
	cityWeather.temp_min
	cityWeather.main

	var geo=navigator.geolocation
	var options={}

	geo.getCurrentPosition(geo_ok,geo_error,options)
	function geo_error(){
		console.log	('Error 500,Not find your position :(')
	}

	function geo_ok(position){
		var lat=position.coords.latitude
		var lon=position.coords.longitude
		console.log(position)
		$.getJSON(API_WEATHER_URL+'lat='+lat+'&lon='+lon, getCurrentWeather)
	}

	function getCurrentWeather(data){
			cityWeather.zone=data.name
			cityWeather.icon=IMG_WEATHER + data.weather[0].icon+'.png'
			cityWeather.temp=data.main.temp-273.15
			cityWeather.temp_max=data.main.temp_max-273.15
			cityWeather.temp_min=data.main.temp_min-273.15
			cityWeather.main=data.weather[0].main
	
		// render funcion del template
		renderTemplate(cityWeather)
	
	}

	function activateTemplate(id){
		var t=document.querySelector(id)
		return document.importNode(t.content,true)
	}

	function renderTemplate(cityWeather, localtime){
		var clone=activateTemplate('#template--city')
		var timeToShow

		if(localtime){
			timeToShow = localtime
		}else{
			timeToShow= timeNow
		}

		clone.querySelector('[data-time]').innerHTML=timeToShow
		clone.querySelector('[data-city]').innerHTML=cityWeather.zone
		clone.querySelector('[data-icon]').src=cityWeather.icon
		clone.querySelector('[data-temp="max"]').innerHTML=cityWeather.temp_max.toFixed(1)
		clone.querySelector('[data-temp="min"]').innerHTML=cityWeather.temp_min.toFixed(1)
		clone.querySelector('[data-temp="current"]').innerHTML=cityWeather.temp.toFixed(1)

		$loader.hide()
		$AllCities.prepend(clone)
	}

	function addNewCity(event){
		event.preventDefault()
		$.getJSON(API_WEATHER_URL+ 'q='+ $(nombreNuevaCiudad).val(),getWeatherNewCity)
	}

	function getWeatherNewCity(data){
		$.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function (response){
			
		   $(nombreNuevaCiudad).val('')
			cityWeather={}
			cityWeather.zone=data.name
			cityWeather.icon=IMG_WEATHER+data.weather[0].icon + '.png'
			cityWeather.temp=data.main.temp -273.15
			cityWeather.temp_max=data.main.temp_max -273.15
			cityWeather.temp_min=data.main.temp_min -273.15

			renderTemplate(cityWeather, response.data.time_zone[0].localtime)
			
			cities.push(cityWeather)
			localStorage.setItem('cities', JSON.stringify(cities))
		})		
	}

	// recargando ciudades guardadas en el localstorage
	function LoadSaveCities(event){
		event.preventDefault()
		
		function renderCities(cities){
				cities.forEach(function (city){
				renderTemplate(city)
			})
		}
		// trae en el JSON las ciudades
		cities = JSON.parse(localStorage.getItem('cities'))
		renderCities(cities)
	}

})()
