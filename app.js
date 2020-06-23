$(document).ready(function () {
    
    var apiKey = "43a7184bcdb551e43318deeabc4ada08";
    
    $("#weatherForm").on("submit", function(event) {
        event.preventDefault();
        var input = $("#cityInput").val();
        addToHistory(input);
        currentWeather(input);
        
        $("#cityInput").val("");
    });
    
    
    //Current weather for city, and grab lat and lon
    function currentWeather(city) {
        
        $.ajax({
            type: "GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial",
    
        }).then(function(res) {
            renderCurrentWeather(res);
            sevenDayForecast(res.coord.lon, res.coord.lat);
            
        });   
    }
    
    
    //Function to get the seven day forecast by day, from the lon and lat
    function sevenDayForecast(lon, lat) {
        
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&appid=" + apiKey + "&units=imperial",
    
        }).then(function(res) {
            
            renderFutureWeather(res);
        });  
    }
    
    //Function to add the submission input to the history
    function addToHistory(input) {
        var item = $("<div>");
        var content = $("<div>");
        var header = $("<div>");
        
        item.addClass("item pointer");
        content.addClass("content");
        header.addClass("header");
        header.text(input);
        header.on("click", function(ev) {
            ev.preventDefault();
            currentWeather($(this).text());
        })
        
        content.append(header);
        item.append(content);
        
        $("#historyList").prepend(item);
    }
    
    
    
    //Function to render the current weather to the DOM
    function renderCurrentWeather(obj) {
        var wpDiv = $("#weatherPlacement");
        wpDiv.html("");
        var cwDiv = $("<div>").addClass("currentWeather").attr("id", "currentWeather");
        var uiComments = $("<div>").addClass("ui comments");
        var comment = $("<div>").addClass("comment");
        var avatar = $("<div>").addClass("avatar");
        var content = $("<div>").addClass("content").attr("id", "weatherContent");
        var metadata = $("<div>").addClass("metadata");
        var text = $("<div>").addClass("text");
        var head = $("<h4>").text(obj.name).addClass("author");
        var date = $("<span>").text(moment.unix(obj.dt).format("dddd, MMM Do YYYY")).addClass("date");
        var icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + obj.weather[0].icon + "@2x.png");
        var temp = $("<div>").addClass("text").html("<span><strong>Temp:</strong> " + obj.main.temp + " &#8457;</span>");
        var humidity = $("<div>").addClass("text").html("<span><strong>Humidity:</strong> " + obj.main.humidity + "%</span>");
        var windSpeed = $("<div>").addClass("text").html("<span><strong>Wind Speed:</strong> " + obj.wind.speed + " miles/hr</span>");

        
        text.text(obj.weather[0].description);
        avatar.append(icon);
        
        metadata.append(date);
        content.append(head, metadata, text, temp, humidity, windSpeed);
        comment.append(avatar, content);
        uiComments.append(comment);
        

        cwDiv.append(uiComments);
        wpDiv.append(cwDiv);
        console.log(obj);
    }
    
    // <div class="content">
    //       <div class="author">Matt</a>
    //       <div class="metadata">
    //         <span class="date">Today at 5:42PM</span>
    //       </div>
    //       <div class="text">
    //         How artistic!
    //       </div>
    //       <div class="actions">
    //         <a class="reply">Reply</a>
    //       </div>
    //     </div>
    
    
    
    //Function to render the forecastedweather to the DOM
    function renderFutureWeather(obj) {
       var uvi = obj.daily[0].uvi;
       var wcDiv = $("#weatherContent");
       var uvDiv = $("<div>").addClass("text");
       uvDiv.text("UV Index: ").css("font-weight", "bold");
       var uvSpan = $("<span>").attr("id", "uvIndex").text(uvi);
       uvSpan.removeClass();
        if (uvi >= 8) {
            uvSpan.addClass("uvIndex uvRed");
        } else if (uvi >= 3) {
            uvSpan.addClass("uvIndex uvYellow");
        } else {
            uvSpan.addClass("uvIndex uvGreen");
        }
       uvDiv.append(uvSpan);
       wcDiv.append(uvDiv);
    }
    
    
    
    
    
});