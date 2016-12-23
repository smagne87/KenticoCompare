angular.module("myApp.KenticoService", [])
    .service("KenticoService", ["$http", "$q", function ($http, $q) {
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];
        return {
            updatePropertyValue: function (url, id, propName, propValue){
                return $http({
                    method: 'POST',
                    url: url + "/UpdateKenticoPageValue",
                    dataType: 'json',
                    data: {documentId: id, property: propName, value: propValue},
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            },
            getKenticoItemInfo: function (url, id) {
                return $http({
                    method: 'POST',
                    url: url + "/GetFullInfoItem",
                    dataType: 'json',
                    data: {documentId: id},
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            },

            getAllPages: function (url) {
                return $http({
                    method: 'POST',
                    url: url + "/GetAllPages",
                    dataType: 'json',
                    data: {documentId: 0},
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            },

            getPagesForItem: function (url, id) {
                return $http({
                    method: 'POST',
                    url: url + "/GetAllPages",
                    dataType: 'json',
                    data: {documentId: id},
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                });
            }
        }
    }]);