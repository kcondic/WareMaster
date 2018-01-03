angular.module('app').controller('displayLayoutController', function ($scope, $rootScope) {

    $rootScope.global = {
        search: ''
    };

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
                first: 'Nazivu'
            }
        },
        {
            name: 'orders',
            breadcrumbText: 'Narudžbe',
            buttonContentItems: {

            }
        }
    ];

    $scope.getBreadcrumbsText = function (templateName) {
        for (let template of $scope.templates) {
            if (templateName === template.name) {
                return template.breadcrumbText;
            }
        }
        return null;
    }
    
    $scope.getButtonFirstItem = function (templateName) {
        for (let template of $scope.templates) {
            if (templateName === template.name) {
                return template.buttonContentItems.first;
            }
        }
        return null;
    }

    $scope.getButtonSecondItem = function (templateName) {
        for (let template of $scope.templates) {
            if (templateName === template.name) {
                return template.buttonContentItems.second;
            }
        }
        return null;
    }

    $scope.isNotSuppliers = function (templateName) {
        if (templateName === $scope.templates[2].name) {
            return false;
        } else {
            return true;
        }
    }

    $scope.showHeader = function (templateName) {
        if (templateName === 'login' || templateName === 'register') {
            return false;
        } else {
            return true;
        }
    }

    $scope.showSubHeader = function (templateName) {
        if (templateName === 'login' || templateName === 'register' || templateName === 'dashboard') {
            return false;
        } else {
            return true;
        }
    }
});