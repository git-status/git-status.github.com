'use strict';

/* Controllers */

var hotSpringControllers = angular.module('hotSpringControllers', []);

hotSpringControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
    function($scope, Phone) {
        $scope.phones = Phone.query();
        $scope.orderProp = 'age';
    }
]);

hotSpringControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone',
    function($scope, $routeParams, Phone) {
        $scope.phone = Phone.get({
            phoneId: $routeParams.phoneId
        }, function(phone) {
            $scope.mainImageUrl = phone.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

hotSpringControllers.controller('DealListCtrl', ['$scope', 'Deal',
    function($scope, Deal) {
        $scope.deals = Deal.query();
        $scope.orderProp = 'Price';
    }
]);

hotSpringControllers.controller('DealDetailCtrl', ['$scope', '$routeParams', 'Deal',
    function($scope, $routeParams, Deal) {
        $scope.deal = Deal.detail({
            dealId: $routeParams.dealId
        }, function(deal) {
            $scope.deal.images = [];
            $scope.deal.images.push(deal.Thumbnail);
            $scope.mainImageUrl = deal.BigImage;
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }
]);

hotSpringControllers.controller('HotSpringMapController', ['$scope', 'Springs', '$log','uiGmapGoogleMapApi', function($scope, Springs, $log,GoogleMapApi) {
    window.LMC = $scope;
    $log.info('$scope.map.rectangle.bounds set');


    $scope.staticMarker = {
        id: 999998,
        coords: {
        latitude: 40.1451,
        longitude: -99.6680
        },
        options: { draggable: false },
        events: {
            dragend: function (marker, eventName, args) {
            $log.log('marker dragend');
            $log.log(marker.getPosition().lat());
            $log.log(marker.getPosition().lng());
            }
        }
    };

      $scope.staticMarker2 = {
        id: 999997,
        coords: {
        latitude: 37.59248651497825,
        longitude: -114.09378125
        },
        options: { draggable: false },
        events: {
            dragend: function (marker, eventName, args) {
            $log.log('marker dragend');
            $log.log(marker.getPosition().lat());
            $log.log(marker.getPosition().lng());
            }
        }
    };

    $scope.displayYourLocation=false;
    
      // Try HTML5 geolocation
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        $scope.staticMarker.coords = {latitude:position.coords.latitude,
                                           longitude:position.coords.longitude};
       $scope.staticMarker.options.title="your location";
     $scope.staticMarker.icon= './img/lodging-key.png';
        $scope.displayYourLocation=true;
        console.log('found geolocation: '+$scope.staticMarker.coords);
/*
          var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'Location found using HTML5.'
          });

          map.setCenter(pos);*/
        }, function() {
          handleNoGeolocation(true);
        });
      } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
      }

      function handleNoGeolocation(errorFlag) {
          if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
          } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
          }

          $scope.yourGeoCoords=new google.maps.LatLng(60, 105);
        /*  var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
          };


          var infowindow = new google.maps.InfoWindow(options);
          map.setCenter(options.position);*/
    }
    /* used to hold your location , search springs and miscellaneous*/
    $scope.infoMarkers=[];
    /*start provider*/
   GoogleMapApi.then(function(maps) {
        $scope.googleVersion = maps.version;
        maps.visualRefresh = true;
        $scope.springIdKey = 'id';


        $scope.states = [];
        $scope.springs = [];
        $scope.stateName = '';
        $scope.state = 'Colorado';
        $scope.denver = {
            center: {
                latitude: 39.732630,
                longitude: -104.990264
            },
            zoom: 8
        };
        $scope.selectedStateSprings = [];
        $scope.springName = '';
        $scope.filteredSprings = [];
        $scope.showMap = true;

        $scope.$watch('springName', function(newValue) {
            if (newValue === '') {
                /*filter springs and list?*/
                $scope.showMap = true;
                $scope.filteredSprings = [];
            } else {
                $scope.showMap = false;
                $scope.filteredSprings = [];
                _.each($scope.springs, function(spring) {
                        if (spring.SpringName.search($scope.springName) > -1) {
                            if ($scope.filteredSprings.indexOf(spring) === -1) {
                                $scope.filteredSprings.push(spring);
                            }
                        }

                });
            }

        });

        $scope.$watch('stateName', function(newValue) {
            var state = _.find($scope.springs, function(spring) {
                return spring.State == $scope.stateName;
            });
            $scope.selectedStateSprings=_.filter($scope.springs,function(spring){
                return spring.State==$scope.stateName;
            });
                 $scope.map.springMarkers=[];
          
                $scope.goToRegion($scope.stateName, function(){
                    _.each($scope.selectedStateSprings, function(spring, idx) {
                    $scope.map.springMarkers.push({
                        id: spring.Id,
                        /* icon: 'bower_components/angular-google-maps/examples/assets/images/blue_marker.png',*/
                        icon: './img/lodging-key.png',
                        latitude: parseFloat(spring.Latitude),
                        longitude: -(spring.Longitude),
                        showWindow: false,
                        options: {
                            labelContent: spring.SpringName,
                            labelVisible: false,
                            labelClass: "marker-labels",
                            title:spring.SpringName +'-- '+spring.TempF
                        },
                        custom: spring

                    });

                });}
                );   
           
        });

        $scope.goToRegion=function(stateName,cb){
            var geocoder = new google.maps.Geocoder();
            if(stateName !==''){
                stateName= stateName.indexOf('-')>-1 ? stateName.replace('-',' ') : stateName;
                    geocoder.geocode( { 'address':stateName,'region': 'US'}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {

                            $scope.map.center={latitude: results[0].geometry.location.lat(),
                                                longitude:results[0].geometry.location.lng()};
                                                console.log('mapCenter');
                                                console.log($scope.map.center);

                            $scope.map.control.refresh({latitude:results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng()});
                         
                        } else {
                            console.log('Geocode was not successful for the following reason: ' + status);
                        }

                });
                    console.log('stateName: '+stateName);
                    /*$scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493});*/
                    cb();

            }
          
        };
        $scope.mapINstance;
        $scope.map = {
            center: {
                latitude: $scope.denver.center.latitude,
                longitude: $scope.denver.center.longitude
            },
            zoom: 5,
            control:{},
            events:{
                tilesloaded:function(map){
                    $scope.$apply(function(){
                        $scope.mapINstance=map;
                        $log.info('this is the map instance',map);
                        console.log('this is the map instance',map);
                    });
                }
            }
        };

        $scope.map.springMarkers = [];

        Springs.get(function(result) {
            $scope.springs = result.Results;
        
            $scope.states=_.pluck(_.unique($scope.springs,'State'),'State');

            _.each($scope.selectedStateSprings, function(spring, idx) {
                $scope.map.springMarkers.push({
                    id: spring.Id,
                  /* id:idx,*/
                    /* icon: 'bower_components/angular-google-maps/examples/assets/images/blue_marker.png',*/
                    icon: '//s3.amazonaws.com/media.ski.com/Challenger/images/lodging-key.png',
                    latitude: spring.Latitude,
                    longitude: -(spring.Longitude),
                    showWindow: false,
                    options: {
                        labelContent: spring.SpringName,
                        labelVisible: false,
                        labelClass: "marker-labels",
                         title:spring.SpringName +'-- '+spring.TempF
                    },
                    custom: spring

                });

            });

        });

        $scope.springDetail=false;
        $scope.foundSpring={};
        $scope.mapSpring = function(spring) {
            /*to display a map & detail of clicked spring from table*/

            $scope.foundSpring=_.extend(spring,
                {
                    idkey:spring.Id,
                    icon: '//s3.amazonaws.com/media.ski.com/Challenger/images/lodging-key.png',
                    coords:{
                        latitude:parseFloat(spring.Latitude),
                        longitude:-(spring.Longitude)
                    },
                    options: {
                        labelContent: spring.SpringName,
                        labelVisible: false,
                        labelClass: "marker-labels",
                         title:'found: '+spring.SpringName +'-- '+spring.TempF
                    }
            });
            /* display marker */
            $scope.showSpringMap = true;
            $scope.showMap=true;
            $scope.springDetail=true;
           //$scope.map.control.refresh({latitude: parseFloat(spring.Latitude), longitude: -(spring.Longitude)});

        };


        $scope.map.springMarkers.forEach(function(marker) {
            marker.onClicked = function() {
                onMarkerClicked(marker);
            };
        });

        $scope.lodgeMarker = {
            id: 99999,
            coords: {
                latitude: $scope.denver.center.latitude,
                longitude: $scope.denver.center.longitude
            },
            options: {
                icon: '//s3.amazonaws.com/media.ski.com/Challenger/images/lodging-key.png',
                title: '$scope.lodge.Name'
            }
        };


        /*marker windows*/
        var onMarkerClicked = function(marker) {
            marker.showWindow = true;
            $scope.$apply();
            window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
        };

        $scope.windowOptions = {
            visible: false
        };

        $scope.onClick = function() {
            $scope.windowOptions.visible = !$scope.windowOptions.visible;
        };

        $scope.closeClick = function() {
            $scope.windowOptions.visible = false;
        };

        $scope.removeMarkers=function(){
            $scope.map.springMarkers=[];
        };

          /*directions setup*/

        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
         directionsDisplay = new google.maps.DirectionsRenderer();

            directionsDisplay.setPanel(document.getElementById('mapDirectionsPanelContent'));
            //$scope.map.control.getGMap()//$scope.mapINstance
            //window.document.getElementsByClassName('angular-google-map')
            //angular-google-map-container
            //gm-style
            directionsDisplay.setMap(window.document.getElementsByClassName('gm-style')[0]);
           
            var mapConfig={
                    useMetres:false
                    };

       $scope.calcRoute= function () {            
            var start =  new google.maps.LatLng($scope.staticMarker.coords.latitude,$scope.staticMarker.coords.longitude);
            var end = new google.maps.LatLng($scope.staticMarker2.coords.latitude,$scope.staticMarker2.coords.longitude);

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem:(mapConfig.useMetres ? google.maps.UnitSystem.METRIC:google.maps.UnitSystem.IMPERIAL)
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                     $scope.$apply(function(){
                        
                        console.log('applied directiosn');
                    });
                }
            });
            
            $("#mapDirectionsModal h3").text("Directions from "+$("select#start option:selected").text()+" to " + end);
        }; 

        /*end directions setup*/

      });
    /* end provider shit*/
}]);
