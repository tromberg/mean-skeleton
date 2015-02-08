/**
 * Created by timr on 08/02/15.
 */

(function(){
    var module = angular.module('droovleServ', []);

    module.factory('DroovleServ', function($http) {
        return {
            get : function(id) {
                return $http.get('/droovle/' + id);
            }
        };
    });

})();