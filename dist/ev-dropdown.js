(function () {

    var module = angular.module('ev-dropdown', ['click-anywhere-but-here']);

    module.directive('evDropdown', [function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {},
            template: '<div class="ev-dropdown" click-anywhere-but-here="evDropdownCtrl.turnOffDropdown()"></div>',
            link: function(scope, element, attrs, ctrl, transclude) {
                scope.dropdownIsOpened = false;

                transclude(scope, function(transcludeClone) {
                    element.append(transcludeClone);
                });
            },
            controller: function($scope) {
                this.toggleDropdown = function() {
                    $scope.dropdownIsOpened = !$scope.dropdownIsOpened;
                };

                this.turnOffDropdown = function() {
                    $scope.dropdownIsOpened = false;
                }

            },
            controllerAs: 'evDropdownCtrl'
        };
    }]);

    module.directive('evDropdownHeader', [function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template: '<div class="ev-dropdown-header" ng-click="evDropdownCtrl.toggleDropdown()"></div>',
            link: function(scope, element, attrs, ctrl, transclude) {
                transclude(scope.$parent, function(transcludeClone) {
                    element.append(transcludeClone);
                });
            }
        };
    }]);

    module.directive('evDropdownBody', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template:
            '<div class="ev-dropdown-body" render-if="dropdownIsOpened">' +
                '<div class="ev-dropdown-body-content"></div>' +
            '</div>',
            link: function(scope, element, attrs, ctrl, transclude) {

                //create elementForDom (this element will be added or removed from DOM) - copy of element
                //debugger;
                var elementForDom = element.clone();
                var evDropdown = element.parent();

                // watch scope[renderIf] and add or remove element from DOM
                scope.$watch(attrs.renderIf, function renderIfWatchAction(value) {
                    // if element should be in dom ->
                    if(value) {
                        // 1. compile elementForDom in dropdown scope
                        elementForDom = $compile(elementForDom)(scope);
                        // 2. compile transclude element in external scope and paste transclude into elementForDom
                        transclude(scope.$parent, function (transcludeClone) {
                            elementForDom.find('.ev-dropdown-body-content').html(transcludeClone);
                            // 3. paste elementForDom into Dom
                            evDropdown.append(elementForDom);
                        });
                        // if element should be removed from dom
                    } else {
                        // 1. clear element
                        evDropdown.find('.ev-dropdown-body').remove();
                    }
                });
            }
        };
    }]);

})();
