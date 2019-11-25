/*
Cookie policy plugin
------
Dependencies: https://github.com/js-cookie/js-cookie
------
HTML
https://gist.github.com/dogwonder/71c8d317fa81d7aa0d5172c4456c85b9

CSS
https://gist.github.com/dogwonder/a3504de087ea051917925a55e8d7d3d5
*/

/*!
* Revealing Module Pattern Boilerplate
* (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
*/
var JWCookies = (function () {

'use strict';

//
// Variables
//
//Cookies settings
var defaults = {
    cookiename: 'jw_cookie_policy', 
    cookietypes: {
        "essential":true,
        "analytics":true,
        "marketing":true
    }, 
    selector: '[data-cookie]', 
    onSubmit: true,
    onClick: false
};

var Constructor = function () {

    var publicAPIs = {};
    var settings;

    //
    // Methods
    //
    /**
    * Merge two or more objects together.
    * @param   {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
    * @param   {Object}   objects  The objects to merge together
    * @returns {Object}            Merged values of defaults and options
    */
    var extend = function () {

        // Variables
        var extended = {};

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    extended[prop] = obj[prop];
                }
            }
        };

        // Loop through each object and conduct a merge
        for (var i = 0; i < arguments.length; i++) {
            merge(arguments[i]);
        }

        return extended;

    };

    var setCookie = function (cookie, options) {

        //Get the cookie
        var cookie_get = Cookies.get(cookie);

        //Set the cookie if not defined - although should set this in the header ideally
        if (cookie_get === undefined) {
            Cookies.set(cookie, options, { expires: 365, path: '' });
        };

        };

        var getRadioValue = function (name) {
            var field = document.querySelector('[data-cookie="' + name + '"]');
            if (!field) return;
            return field.value;
        };

        var setRadio = function (field, value) {
            if (field.value !== value) return;
            field.checked = true;
        };

    var getCookie = function (cookie, selector) {

        //Get the options from the cookie
        var cookie_options = Cookies.getJSON(cookie);

        //Loop through our object and set the value against the matching input
        Object.keys(cookie_options).forEach(function(key) {

            var on = document.querySelector('[data-cookie="' + key + '"]:not([value="false"])');
            var off = document.querySelector('[data-cookie="' + key + '"]:not([value="true"])');

            // If the cookie key is essential bail
            if(key === 'essential') return;

            var fieldID = getRadioValue(key);
            if (!fieldID) return;
            
            if(cookie_options[key] === false) {
                on.checked = false;
                off.checked = true;
            } else if (cookie_options[key] === true) {
                on.checked = true;
                off.checked = false;
            }

        });

    };

    
    var updateCookie = function (cookie, selector) {

        var settings = document.querySelectorAll(selector);

        var valuesArr = {};
            valuesArr = Array.prototype.map.call(settings, function (item) {

            var cookievalue = item.getAttribute('data-cookie');
            var settings = document.querySelectorAll('[data-cookie="' + cookievalue + '"]');
            
            if(item.checked !== true) return;

            //Return an object with cookeie type and value
            var obj = {
                name: cookievalue,
                value: JSON.parse(item.value)
            };
            return obj;

        });

        //Filter out the undefined vavlues
        var values = {};
            values = valuesArr.filter(function (el) {
                return el != null;
        });
        
        // console.log(values);

        let analyticsValue = values.find(o => o.name === 'analytics');
        let marketingValue = values.find(o => o.name === 'marketing');

        //Spit put the values
        var cookies_vars = {
            "essential": true,
            "analytics":analyticsValue.value,
            "marketing":marketingValue.value
        };

        // console.log(cookies_vars);

        //Set the cookie
        Cookies.set(cookie, cookies_vars, { expires: 365, path: '' });

    };

    /**
    * Public methods
    */

    publicAPIs.init = function (options) {

        // Object.assign merges two objects together, {} = empty object then merge in defaults and options
        settings = Object.assign({}, defaults, options);
        // console.log(settings);

        //Set the cookie then get the values and pass them to the radios
        setCookie(settings.cookiename, settings.cookietypes);
        getCookie(settings.cookiename);
        
        // On submit update the cookie
        if (settings.onSubmit) {
            // console.log('submit');
            document.addEventListener('submit', function (event) {
                // event.preventDefault();
                updateCookie(settings.cookiename, settings.selector);

            }, false);
        }
        
        // Or listen for clicks in the document
        if (settings.onClick) {
            document.addEventListener('click', function (event) {
                if (!event.target.matches(settings.selector)) return;
                // console.log('click');
                updateCookie(settings.cookiename, settings.selector);
            }, false);
        }

    };

    //
    // Return the Public APIs
    //

    return publicAPIs;

}

return Constructor;

})();