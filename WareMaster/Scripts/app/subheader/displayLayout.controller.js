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
                first: 'Dobavljaču/Izvršitelju'
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

    $scope.clickCounter = 0;

    $scope.iconClicked = function(iconIndex){
        if($scope.clickCounter===0){
            if(iconIndex===1)
                $scope.clickCounter = 1;
            else if(iconIndex===2)
                $scope.clickCounter = 2;
            else 
                $scope.clickCounter = 3;
        } else if($scope.clickCounter===1){
            if (iconIndex === 2)
                $scope.clickCounter = 2;
            else if (iconIndex === 3)
                $scope.clickCounter = 3;
            else
                $scope.clickCounter = 0;
        } else if ($scope.clickCounter === 2) {
            if (iconIndex === 1)
                $scope.clickCounter = 1;
            else if (iconIndex === 3)
                $scope.clickCounter = 3;
            else
                $scope.clickCounter = 0;
        } else {
            if (iconIndex === 1)
                $scope.clickCounter = 1;
            else if (iconIndex === 2)
                $scope.clickCounter = 2;
            else
                $scope.clickCounter = 0;
        }
    }

    $scope.amIDisplayed = function (iconIndex) {
        if (iconIndex === $scope.clickCounter) {
            return 'button-content-displayed';
        } else {
            return '';
        }
    }

    $scope.getMyClass = function () {
        if ($scope.clickCounter === 3) {
            $scope.myClass1 = 'bar1changed';
            $scope.myClass2 = 'bar2changed';
            $scope.myClass3 = 'bar3changed';
            return true;
        } else {
            $scope.myClass1 = '';
            $scope.myClass2 = '';
            $scope.myClass3 = '';
            return true;
        }
    }
});