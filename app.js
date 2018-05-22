(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItemsList.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };
  return ddo;
}

function FoundItemsDirectiveController() {
  var list = this;

  list.isEmpty = function () {
    return list.found != undefined && list.found.length === 0;
  }
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var shortList = this;

  shortList.searchItem = "";

  shortList.narrowIt = function(){
      if(shortList.searchItem === ""){
      shortList.items = [];
      return;
      }

      var promise = MenuSearchService.getMatchedMenuItems(shortList.searchItem);

      promise.then(function(response) {
      shortList.items = response;
      })
      .catch(function(error) {
      console.log("Something went wrong", error);
      });
      console.log(this);

  };

  shortList.removeItem = function (index) {
    shortList.items.splice(index,1);
  };

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
   var service = this;

   service.getMatchedMenuItems = function (searchItem) {
      return $http({
          method: 'GET',
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json',
         })
         .then(function (result){//if result is success
          //process result and only keep items that match
            var items = result.data.menu_items;

            var foundItems = [];

            //loop menu_items returned from server
            for(var i = 0; i < items.length; i++){
              //pick out the ones whose description matches the searchTerm
              if(items[i].description.toLowerCase().indexOf(searchItem.toLowerCase()) >= 0){
                foundItems.push(items[i]);
              }
            }

            //return processed items
            return foundItems;
      });
    };
}


})();
