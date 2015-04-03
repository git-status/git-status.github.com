'use strict';

/* Services */

var hotSpringServices = angular.module('hotSpringServices', ['ngResource']);

hotSpringServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

hotSpringServices.factory('Deal', ['$resource','$location',
  function($resource,$location){
    return $resource('deals/:dealId.json', {}, {
      query: {method:'GET', params:{dealId:'deals'}, isArray:true},
      detail:{
      	url:'deals/deals.json',
      	method:'GET',
      	params:{dealId:'@dealId'},
      	isArray:false,
	  	 /*transformRequest: function (data, headersGetter) {
	  	 		var dealId=headersGetter('data');
	            var result = JSON.stringify("what's up");
	            return result;
	        },*/
	     transformResponse:function(data,headersGetter){
	     	/*console.log('dealId:'+dealId);*/
        var deals=JSON.parse(data);
        var deal=_.find(deals,function(deal){
          return parseInt(deal.ProductId)===dealId;
        });
	     	return deal;
	     }
      }
    });
  }]);

hotSpringServices.factory('Springs', function($resource){
    return $resource('http://0.0.0.0:4000/springs.json');
 
});