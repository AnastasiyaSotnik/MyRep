var app = angular.module('myApp', ['ui.router']);

/*app.config(function ($routeProvider) {
 $routeProvider
 .when('/', {
 templateUrl: 'pages/home.html'
 })

 .when('/cards', {
 templateUrl: 'pages/cards.html',
 controller: 'CardsController'
 })

 .when('/orders', {
 templateUrl: 'pages/orders.html',
 controller: 'OrderController'
 })

 .when('/profile', {
 templateUrl: 'pages/profile.html',
 controller: 'CardsController'
 })

 .otherwise({redirectTo: '/'});
 });*/

app.config(function ($stateProvider, $urlRouterProvider) {

    /*$locationProvider.html5Mode({
     enabled: true,
     requireBase: false
     });*/

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('/', {
            url: '/',
            resolve: {

                data: function (dataService) {
                    return dataService.getData();
                }
            },
            templateUrl: 'pages/home.html',
            controller: 'HomeController'
        })
        .state('/cards', {
            url: '/cards',
            resolve: {

                data: function (dataService) {
                    return dataService.getData();
                }
            },
            templateUrl: 'pages/cards.html',
            controller: 'CardsController'
        })
        .state('/orders', {
            url: '/orders',
            resolve: {

                data: function (dataService) {
                    return dataService.getData();
                }
            },
            templateUrl: 'pages/orders.html',
            controller: 'OrderController'
        })
        .state('/profile', {
            url: '/profile',
            resolve: {

                data: function (dataService) {
                    return dataService.getData();
                }
            },
            templateUrl: 'pages/profile.html',
            controller: 'ProfileController'
        });
});

app.controller('HomeController', function ($scope, data) {
    $scope.cards = data.data;
});

app.controller('OrderController', function ($scope, data) {
    $scope.cards = data.data;
    $scope.currentID = -1;
    $scope.addNewOrder = function (firstName, lastName) {
        for (var i = 0; i < $scope.cards.length; i++) {
            if ((firstName === $scope.cards[i].firstName) && (lastName === $scope.cards[i].lastName)) {
                console.log("hi");
                $scope.cards.push({
                    firstName: $scope.firstName,
                    lastName: $scope.lastName,
                    dateOfOrder: $scope.dateOfOrder,
                    orderAmount: $scope.orderAmount,
                    orderStatus: $scope.orderStatus
                });
                $scope.firstName = '';
                $scope.lastName = '';
                $scope.dateOfOrder = '';
                $scope.orderAmount = '';
                $scope.orderStatus = '';
                return;
            }
        }
        alert("Register the client to make an order");
    };
    $scope.editOrder = function (id) {
        $scope.currentID = id;
        $scope.firstName = $scope.cards[id].firstName;
        $scope.lastName = $scope.cards[id].lastName;
        $scope.dateOfOrder = $scope.cards[id].dateOfOrder;
        $scope.orderAmount = $scope.cards[id].orderAmount;
        $scope.orderStatus = $scope.cards[id].orderStatus;
    };
    $scope.saveOrder = function () {
        if ($scope.currentID > -1) {
            var id = $scope.currentID;
            $scope.cards[id].firstName = $scope.firstName;
            $scope.cards[id].lastName = $scope.lastName;
            $scope.cards[id].dateOfOrder = $scope.dateOfOrder;
            $scope.cards[id].orderAmount = $scope.orderAmount;
            $scope.cards[id].orderStatus = $scope.orderStatus;
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.dateOfOrder = '';
            $scope.orderAmount = '';
            $scope.orderStatus = '';
            $scope.currentID = -1;
        }
    };
    $scope.checkPerson = function (firstName, lastName) {
        for (var i = 0; i < $scope.cards.length; i++) {
            if ((firstName === $scope.cards[i].firstName) && (lastName === $scope.cards[i].lastName)) {
                alert("Register the client to make an order");
                return;
            } else {
                $scope.orderFlag = false;
            }
        }
    };
})
;

app.controller('CardsController', function ($scope, dataService, data) {
    $scope.cards = data.data;
    $scope.cardsFlag = true;
    $scope.addNewPerson = function (firstName, lastName) {
        for (var i = 0; i < $scope.cards.length; i++) {
            if ((firstName === $scope.cards[i].firstName) && (lastName === $scope.cards[i].lastName)) {
                alert("Client has already exist");
                $scope.cardsFlag = true;
                return;
            }
        }
        if ($scope.form.$valid) {
            $scope.cards.push({
                firstName: $scope.firstName,
                lastName: $scope.lastName
            });
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.cardsFlag = true;
        }
    };

    $scope.deletePerson = function (id) {
        $scope.cards.splice(id, 1);
    };


    $scope.showProfile = function (item) {
        dataService.showProfile($scope.cards, item.id);
    }
});

app.controller('ProfileController', function ($scope, data) {
    $scope.currentID = -1;
    $scope.cards = data.data;

    $scope.flag = false;
    $scope.flag2 = false;

    $scope.showCars = function () {
        $scope.flag2 = true;
    };

    $scope.hideCars = function () {
        $scope.flag2 = false;
    };

    $scope.editProfile = function (id) {
        $scope.flag = true;
        $scope.firstName = $scope.cards[id].firstName;
        $scope.lastName = $scope.cards[id].lastName;
        $scope.dateOfBirth = $scope.cards[id].dateOfBirth;
        $scope.address = $scope.cards[id].address;
        $scope.phone = $scope.cards[id].phone;
        $scope.email = $scope.cards[id].email;
    };

    $scope.saveCar = function (id) {
        if ($scope.form.$valid) {
            $scope.flag = false;
            $scope.cards[id].firstName = $scope.firstName;
            $scope.cards[id].lastName = $scope.lastName;
            $scope.cards[id].dateOfBirth = $scope.dateOfBirth;
            $scope.cards[id].address = $scope.address;
            $scope.cards[id].phone = $scope.phone;
            $scope.cards[id].email = $scope.email;
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.dateOfBirth = '';
            $scope.address = '';
            $scope.phone = '';
            $scope.email = '';
        }
    }
});

app.factory('dataService', function ($rootScope, $http) {
    var cards = [];
    $rootScope.client = [];

    return {
        getData: function () {
            return $http.get('data.json').success(function (data) {
                cards = data;
            });
        },
        showProfile: function (source, id) {
            for (var i = 0; i < source.length; i++) {
                if (source[i].id === id) {
                    $rootScope.client = source[i];
                    return $rootScope.client;
                }
            }
        }
    }
});