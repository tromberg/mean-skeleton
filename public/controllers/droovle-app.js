(function() {
    var module = angular.module('droovle', ['droovleServ']);

    var CreateDroovleCtrl = function(DroovleServ) {
        this.droovle = {
            address : '',
            email : ''
        }
        this.step = 1;
    };

    CreateDroovleCtrl.prototype.isStep = function(id) {
        return this.step === id;
    }

    CreateDroovleCtrl.prototype.nextStep = function() {
        this.step += 1;
    }

    module.controller('CreateDroovleCtrl', ['DroovleServ', CreateDroovleCtrl]);
})();