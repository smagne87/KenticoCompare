/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.site = (function () {
        function init(){
            $(document).foundation();
        }

        return {
            init: init
        }
    })();

    multi.utils = {

        parseAjaxResponse: function (response, convertToJson) {
            var objResponse = null;
            if (response.substr(0, 9) == "while(1);") {
                response = response.substring(9);
                if(convertToJson)
                    objResponse = JSON.parse(response);
            }

            if (convertToJson)
                return objResponse;
            else
                return response;
        },

        addError: function ($parent) {
            if ($parent) {
                $parent.addClass("error");
            }
        },

        removeError: function ($parent) {
            if ($parent) {
                $parent.removeClass("error");
            }
        },
        clearErrorMessage: function ($elem) {
            multi.utils.removeError($elem.parent());
            if ($elem.next('.error-msg').length) {
                $elem.next('.error-msg').remove();
            }
        },
        addErrorMessage: function (message) {
            var $errorBlock = $('.error-block p'),
                currentMessage = $errorBlock.html();
            if (currentMessage === "") {
                currentMessage = message
            }
            else {
                currentMessage += '</br>' + message;
            }
            $errorBlock.html(currentMessage);
        },
        stringToDate: function (_date, _format, _delimiter) {
            var formatLowerCase = _format.toLowerCase();
            var formatItems = formatLowerCase.split(_delimiter);
            var dateItems = _date.split(_delimiter);
            var monthIndex = formatItems.indexOf("mm");
            var dayIndex = formatItems.indexOf("dd");
            var yearIndex = formatItems.indexOf("yyyy");
            var month = parseInt(dateItems[monthIndex]);
            if (month > 12) {
                return null;
            }
            var formatedDate = new Date(dateItems[yearIndex], month - 1, dateItems[dayIndex]);
            return formatedDate;
        },
        getParameterByName: function (name) {
            if (name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.search);
                if (results == null)
                    return "";
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            return "";
        },
        updateQueryStringParameter: function (uri, key, value) {
            if (uri.indexOf('?') === -1) {
                uri = '?' + uri;
            }
            var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
            } else if (uri.indexOf('http') !== -1) {
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                return uri + separator + key + "=" + value;
            } else {
                return uri + "&" + key + "=" + value;
            }
        },
        arrayObjectIndexOf: function (myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }
    };

    multi.site.init();

}(jQuery, this));