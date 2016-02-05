'use strict';
/* global $ attractionsModule */

var daysModule = (function() {

    // state (info that should be maintained)

    var days = [],
        currentDay;

    // jQuery selections

    var $dayButtons, $dayTitle, $addButton, $removeDay;
    $(function() {
        $dayButtons = $('.day-buttons');
        $removeDay = $('#day-title > button.remove');
        $dayTitle = $('#day-title > span');
        $addButton = $('#day-add');
    })

    // Day class

    function Day(hotel,restaurants,activities) {
        this.hotel = (hotel) ? hotel[0] : null;
        this.restaurants = restaurants || [];
        this.activities = activities || [];
        this.number = days.push(this);
        this.buildButton().drawButton();
    }

    Day.prototype.buildButton = function() {
        this.$button = $('<button class="btn btn-circle day-btn"></button>')
            .text(this.number);
        var self = this;
        this.$button.on('click', function() {
            this.blur();
            self.switchTo();
        })
        return this;
    };

    Day.prototype.drawButton = function() {
        this.$button.appendTo($dayButtons);
        return this;
    };

    Day.prototype.switchTo = function() {
        // day button panel changes
        currentDay.$button.removeClass('current-day');

        // itinerary clear
        function erase(attraction) {
            attraction.eraseItineraryItem();
        }
        if (currentDay.hotel) erase(currentDay.hotel);
        currentDay.restaurants.forEach(erase);
        currentDay.activities.forEach(erase);

        // front-end model change
        currentDay = this;

        // day button panel changes
        currentDay.$button.addClass('current-day');
        $dayTitle.text('Day ' + currentDay.number);

        // itinerary repopulation
        function draw(attraction) {
            attraction.drawItineraryItem();
        }
        if (currentDay.hotel) draw(currentDay.hotel);
        currentDay.restaurants.forEach(draw);
        currentDay.activities.forEach(draw);

        return currentDay;
    };

    // private functions in the daysModule

    function addDay() {
        if (this && this.blur) this.blur();
        var newDay = new Day();

        $.ajax({
            method: 'POST',
            url: '/api/days',
            data: {
                number: days.length
            },
            success: function(responseData) {
                console.log('day created');
            },
            error: function(errorObj) {
                console.log(errorObj);
            }
        });

        if (days.length === 1) currentDay = newDay;
        newDay.switchTo();


    }
    function makeAttractionChecker(attractionArray){
      var result = [];
        attractionArray.forEach(function(index){
          if(index) result.push(attractionsModule.create(index).eraseMarker().eraseItineraryItem());
        })
      return result;
    }

    Day.prototype.updateNumber = function(){
        var oldDay = this.number;
        this.number =days.indexOf(this)+1;
        $.ajax({
            method: 'PUT',
            url: '/api/days/'+oldDay,
            success: function(responseData) {
                console.log('day deleted');
            },
            error: function(errorObj) {
                console.log(errorObj);
            }
        });
    }

    function deleteCurrentDay() {
        var dayIn = currentDay.number -1;
        var day1 = dayIn+1;
        days.splice(dayIn,1);
        for (var i = dayIn; i < days.length; i++) {
            days[i].updateNumber();
        };
        days[0].switchTo();
        $('.day-btn:last').remove();
        $.ajax({
            method: 'DELETE',
            url: '/api/days/'+day1,
            success: function(responseData) {
                console.log('day deleted');
            },
            error: function(errorObj) {
                console.log(errorObj);
            }
        });
        console.log(this);
    }

    // jQuery event binding

    $(function() {
        $addButton.on('click', addDay);
        $removeDay.on('click', deleteCurrentDay);
    })

    // globally accessible methods of the daysModule

    var methods = {

        load: function() {
            $(function(){
                $.get('/api/days', function(data) {
                    console.log('GET response data', data)
                })
                .done(function(days) {
                    if (days.length === 0) {
                        addDay();
                    }else{
                      console.log(days)
                      var x;
                      for (var i = 0; i < days.length; i++) {
                           x = new Day(makeAttractionChecker([days[i].hotel]), makeAttractionChecker(days[i].restaurant), makeAttractionChecker(days[i].activity));
                      };
                      currentDay = x;
                      x.switchTo();
                    }
                })
                .fail(function(err) {
                    console.error('err', err)
                });
              
            }

            )
        },

        addAttraction: function(attractionData) {
          console.log('add attractions ran')
            var attraction = attractionsModule.create(attractionData);
            switch (attraction.type) {
                case 'hotel':
                    currentDay.hotel = attraction;
                    break;
                case 'restaurant':
                    currentDay.restaurants.push(attraction);
                    break;
                case 'activity':
                    currentDay.activities.push(attraction);
                    break;
                default:
                    console.error('bad type:', attraction);
            }
            $.ajax({
            method: 'POST',
            url: '/api/days/'+currentDay.number+'/'+attraction.type,
            data:{
              id :attraction._id
            },
            success: function(responseData) {
                console.log('day '+currentDay.number+' '+attraction.type);
            },
            error: function(errorObj) {
                console.log(errorObj);
            }
        });
        },

        getCurrentDay: function() {
            return currentDay;
        }

    };

    // we return this object from the IIFE and store it on the global scope
    // that way we can use `daysModule.load` and `.addAttraction` elsewhere

    return methods;

}());
