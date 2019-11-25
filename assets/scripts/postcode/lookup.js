/**
 * Get the URL parameters
 * source: https://css-tricks.com/snippets/javascript/get-url-variables/
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url || window.location.href;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    if (vars.length < 1) return params;
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
};

var geolocate = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $.get( "https://api.postcodes.io/postcodes?lon="+position.coords.longitude+"&lat="+position.coords.latitude, function( data ) {
          if((!data.result) || (data.result.length < 1)){
            alert("Sorry we can't find you, please type in your postcode.");
            $('#findConsituency').removeAttr('disabled');
            $('#findConsituency').focus();
          } else {
            getResults('p:'+data.result[0].postcode);
          }
        });
      }, function(){
        alert("Sorry we can't find you, please type in your postcode.");
        $('#findConsituency').removeAttr('disabled');
        $('#findConsituency').focus();
      });
    } else {
      alert("Sorry we can't find you, please type in your postcode.");
      $('#findConsituency').focus();
    }
};

var getResults = function(incoming) {

  $('#findConsituency').val(incoming.substring(2));
  $('#findConsituency').attr('disabled', 'disabled');

  //Get first two characters
  if(incoming.substring(0, 2) == "p:"){
    //Get the Consituency via the postcode (e.g. everything after :p)
    $.ajax({url: 'https://api.postcodes.io/postcodes/'+encodeURIComponent(incoming.substring(2))}).done(function(data) {
      $('#findConsituency').removeAttr('disabled');
      window.location.href = './' + data.result.parliamentary_constituency.replace(/[ ,.]/g, '').toLowerCase() + '.html' + '#' + encodeURIComponent(incoming.substring(2));
    });
  } else {
    //Get the Consituency
    window.location.href = './' + incoming.substring(2).replace(/[ ,.]/g, '').toLowerCase() + '.html';
  }
} 

//Get the postcode form the URL string
var getPostcode = function() {
  
  var url = window.location.href;
  var params = getParams(url);
  var postcode = params.postcode;

  if (postcode) {
    $('#findConsituency').attr('disabled', 'disabled');
    $.ajax({url: 'https://api.postcodes.io/postcodes/'+encodeURIComponent(postcode)}).done(function(data) {
      $('#findConsituency').removeAttr('disabled');
      window.location.href = './' + data.result.parliamentary_constituency.replace(/[ ,.]/g, '').toLowerCase() + '.html' + '#' + encodeURIComponent(postcode);
    });
  }

};

//Populate autocomplete
$('#findConsituency').autocomplete({

    lookup: function (query, done) {
      
      var suggestions = [];

      //Loop thorugh our constituency data and push into suggestions array
      $.getJSON('./data/constituencies.json', function (json) {
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var item = json[key];
                if(item.name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                  suggestions.push({'value': item.name, 'data': "a:"+item.name});
                }
            }
        }
      });


      $.ajax({url: 'https://api.postcodes.io/postcodes/'+encodeURIComponent(query)+'/autocomplete'}).done(function(data) {
        var maxitems = 5;
        if(data.result){
          if (data.result.length < 5){
            maxitems = data.result.length;
          }
          for(i = 0; i < maxitems; i++){
            suggestions.push({'value': data.result[i], 'data': 'p:'+data.result[i]});
          }
        }
        topPostcode = suggestions[0];
        suggestions = suggestions.slice(0, 5);
        var outcome = { 'suggestions' : suggestions };
        done(outcome);
      });
    },


    //On select postcode or place load the constituency
    onSelect: function (suggestion) {
        getResults(suggestion.data);
    }

  });


  //Clear the inputs from previous data
  $('#findConsituency').click(function(){
    //Clear the field onclick
    $('#findConsituency').autocomplete('clear');
    $('#findConsituency').val('');
    //Focus onto the input field
    setTimeout("$('#findConsituency').focus()", 200);
  });

  //Focus onto the input field
  setTimeout("$('#findConsituency').focus()", 500); 

  //Locate the user via geolocation
  $('#findMe').click(function(e){
      e.preventDefault();
      geolocate();
  });

  getPostcode();