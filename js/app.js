(function () {
    var app = angular.module('geo',[]);
    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for(name in obj) {
          value = obj[name];
          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
        };
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    });
    app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        }
    });
    app.filter('orderObjectBy', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item) {
              filtered.push(item);
            });
            filtered.sort(function (a, b) {
              return (a[field] > b[field] ? 1 : -1);
            });
            if(reverse) filtered.reverse();
                return filtered;
        };
    });
})();