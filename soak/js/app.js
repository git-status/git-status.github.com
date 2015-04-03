'use strict';

/* App Module */

var hotSpringsApp = angular.module('hotSpringsApp', [
  'ngRoute',
  'hotSpringAnimations',

  'hotSpringControllers',
  'hotSpringFilters',
  'hotSpringServices',
  'uiGmapgoogle-maps'
]);

hotSpringsApp.config(['$routeProvider','uiGmapGoogleMapApiProvider',
  function($routeProvider,GoogleMapApi) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl'
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
       when('/deals', {
        templateUrl: 'partials/deal-list.html',
        controller: 'DealListCtrl'
      }).
       when('/deals/:dealId', {
        templateUrl: 'partials/deal-detail.html',
        controller: 'DealDetailCtrl'
      }).
       when('/home',{
        templateUrl: 'partials/home.html'
       }).
       when('/map',{
        templateUrl: 'partials/map.html',
        controller: 'HotSpringMapController'
       }).
       when('/spring/:springId',{
        templateUrl: 'partials/map.html',
        controller: 'HotSpringMapController'
       }).
       when('/about',{
        templateUrl: 'partials/about.html'
       }).
       when('/contact',{
        templateUrl:'partials/contact.html'
       }).
      otherwise({
        redirectTo: '/home'
      });

      GoogleMapApi.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: '',
        sensor:true
    });

  }]);
