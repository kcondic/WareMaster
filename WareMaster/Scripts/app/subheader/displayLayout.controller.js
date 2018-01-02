angular.module('app').controller('displayLayoutController', function ($scope, $rootScope) {

    $scope.templates = [
        {
            name: 'products',
            breadcrumbText: 'Proizvodi',
            buttonContentItems: {
                first: 'Nazivu',
                second: 'Količini',
                third: 'Dobavljaču'
            }
        },
        {
            name: 'employees',
            breadcrumbText: 'Radnici',
            buttonContentItems: {
                first: 'Imenu',
                second: 'Prezimenu'
            }
        },
        {
            name: 'suppliers',
            breadcrumbText: 'Dobavljači',
            buttonContentItems: {
                first: 'Nazivu',
                second: ''
            }
        }
    ];


    $scope.getTemplateStatus = function (templateName, templateIndex) {
            if (templateName === $scope.templates[templateIndex].name)
            {
                return true;
            } else {
                return false;
            }
    };

    $scope.isNotSuppliers = function (templateName) {
        if (templateName === $scope.templates[2].name) {
            return false;
        } else {
            return true;
        }
    }
});