(function(){
    var app = angular.module('click-anywhere-but-here', []);

    app.directive('clickAnywhereButHere', ['$document', '$parse', function($document, $parse){
        return {
            restrict: 'A',
            link: function($scope, $element, $attributes) {
                var scopeExpression = $attributes.clickAnywhereButHere,
                    onDocumentClick = function(event){
                        var isChild = $element.find(event.target).length > 0;

                        if(!isChild) {
                            $scope.$apply(scopeExpression);
                        }
                    };

                // capturing phase
                document.addEventListener('click', onDocumentClick, true);

                $element.on('$destroy', function() {
                    document.body.removeEventListener('click', onDocumentClick, true);
                });
            }
        }
    }]);
})();