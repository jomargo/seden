$(document).ready(function(){


//Get custom URL parameters
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }


//Countdown timer function
function countdownTimer(nextWebinar){
    window.setInterval(function(){ 

            var today = moment().tz('America/New_York');
            var difference = (nextWebinar - today) / 1000;
            var numberOfDays = Math.floor(difference / 60 / 60 / 24);
            var numberOfHours = Math.floor((difference / 60 / 60) - (numberOfDays * 24));
            var numberOfMinutes = Math.floor((difference / 60) - (numberOfHours * 60) - (numberOfDays * 24 * 60));
            var numberOfSeconds = Math.floor(difference - (numberOfMinutes * 60) - (numberOfHours * 60 * 60) - (numberOfDays * 24 * 60 * 60));
            
            $('.days-flap').text(numberOfDays);
            $('.hours-flap').text(numberOfHours);
            $('.minutes-flap').text(numberOfMinutes);
            $('.seconds-flap').html(numberOfSeconds);
            
        
        }, 100);
}    


//Get next {Day of Week}
    //Must pass through moment.js to put in ET and set hour, minutes, seconds
function nextSession(date) {
    var ret = new Date(date||new Date());
    ret.setDate(ret.getDate() + (dayOfWeek - 1 - ret.getDay() + 7) % 7 + 1);
    return ret;
}


//Get individual page varialbes that says what type of webinar this is (recurring-weekly || recurring-daily || one-time)
  //Grab date, time, etc. 

  var webinarType = $('.webinar-type').text();
  var webinarDay = $('.webinar-day').text();
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var dayOfWeek = dayNames.indexOf(webinarDay);
  var timeOfDay = $('.webinar-hour').text();
  var webinarMonthString = $('.webinar-month').text();
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var webinarMonth = monthNames.indexOf(webinarMonthString);

  var webinarDate = $('.webinar-date').text();
  var webinarYear = $('.webinar-year').text();


  //Grab today's date in ET
  var today = moment().tz('America/New_York');
  


  //For different webinar types
  if(webinarType === "weekly"){
    
    //IF webinarType = recurring-weekly
    console.log("The webinar occurs every week.");
  

    //Get the next webinar date
    if(today.weekday() === dayOfWeek && today.hour() < timeOfDay){
  
        var nextWebinar = today.hours(timeOfDay).minutes(0).seconds(0);

    } else {
  
        var nextWebinar = moment(nextSession(today)).tz('America/New_York').hours(timeOfDay).minutes(0).seconds(0);

    }



  } else if(webinarType === "daily"){
    
    console.log(webinarType);

    //IF webinarType = recurring-daily
    console.log("The webinar occurs daily.");

    //Grab the next webinar date
    if(today.hour() < timeOfDay){
  
        var nextWebinar = today.hours(timeOfDay).minutes(0).seconds(0);

    } else {
  
        var nextWebinar = moment().day(today.day() + 1).tz('America/New_York').hours(timeOfDay).minutes(0).seconds(0);
        

        
    }


      var webinarDay = nextWebinar.day();      
      var dayOfWeek = dayNames[webinarDay];

      //Set day of week text - special for daily webinars
      $('.calendar-day-text').text(dayOfWeek);
    
  
  }else if(webinarType = "one-time"){
    
    //If webinarType = recurring-weekly
    console.log("The webinar occurs only once.");

      var nextWebinar = moment().year(webinarYear).month(webinarMonth).date(webinarDate).hours(timeOfDay).minutes(0).seconds(0);
      var webinarOver = moment().year(webinarYear).month(webinarMonth).date(webinarDate).hours(timeOfDay + 5).minutes(0).seconds(0);

      //if webinar has started
      if(today > nextWebinar){
        console.log("Webinar has started");
        $('body').addClass('webinar-started');
        //Add CSS for this later

      }

      //If webinar is over.
      if(today > webinarOver){
        console.log("Webinar has passed.");
        $('body').addClass('webinar-passed');
          //ADD CSS for this later.
      } 

  }

//SET DATE FOR COUNTDOWN TIMER & FORM SUBMISSION
  //if dayOfWeek && timeOfDay

//Create webinarDateString, to pass into Hubspot form
var webinarDateYear = nextWebinar.get('year');
var webinarDateMonth = nextWebinar.month() + 1;
var webinarDate = nextWebinar.date();

var webinarDateString = webinarDateYear + "-" + webinarDateMonth + "-" + webinarDate;


//Set the Calendar's month and date
var monthString = monthNames[webinarDateMonth - 1];

$('.change-month').text(monthString);
$('.change-date').text(webinarDate);


//Set the th, nd, or rd for the webinar date
   var dateND = webinarDate.toString();

   if(dateND.length > 1){
        dateND = dateND.substr(dateND.length-1);
    }
    
    if(dateND === "1"){
        dateND = "st";
    } else if(dateND === "2"){
        dateND = "nd";
    } else if(dateND === "3"){
        dateND = "rd";
    } else {
        dateND = "th";
    }
   
   $('.change-nd').text(dateND);


//Create the countdown Timer
countdownTimer(nextWebinar);
   
   

   //Make the POPUP Appear
   $('.open-modal').click(function(){
         $('.modal-window').addClass('modal-select');
         $('.modal-covering').addClass('modal-covering-select');
   });
   
   $('.modal-window-close').click(function(){
       $('.modal-window').removeClass('modal-select');
        $('.modal-covering').removeClass('modal-covering-select');
   });
    









   //Add values to fields if the fields exist
      //Later = triggered on Hubspot load form event

      var email = getUrlVars()["email"];
      var source = getUrlVars()["source"];

      if(source){
          //Do Nothing;
      } else{
        var source = "Sign up page";
      }

      var presence = "TRUE";
    
    
    $('.cta').click(function(){
        
        $('input[name="webinar_date"]').val(webinarDateString).change();
        $('input[name="quickstart_webinar_source"]').val(source).change();
        $('input[name="email"]').val(email).change();

    });
    



//SUBMIT FORM IF PRESENCE FIELD EXISTS
    //Eventually change to trigger after Hubspot form is loaded - for now, using setTimeout.
setTimeout(function(){   

  if ($('input[name*="presence"]').length > 0){
    
    var email = getUrlVars()["email"];

    if(email){
    
        $('input[name="email"]').val(email).change();
        $('input[name*="presence"]').val("TRUE").change(); 
        
        $('.hs-button').trigger("click");
        
    //END IF EMAIL  
    }

  //END IF input name contains "presence"
  }

}, 5000);


//Firebase chat for webinar play pages
$('.chat-name-submit').click(function(){

  $('.chat-name-box').addClass('chat-name-box-select');
  $('.messages').addClass('messages-select');
  $('.submit-messages-box').addClass('submit-messages-box-select')
  
  var heightChange = $('.messages').offset().top + 7;

  var chatName = $('.chat-name-input').val();

});



});