'use strict';

/* Filters */

angular.module('hotSpringFilters', []).filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
}).filter('affLink', function() {
	return function(text){
		return text ? text.replace('YOURUSERID','274785') :'';
	}
});
