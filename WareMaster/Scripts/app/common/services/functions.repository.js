angular.module('app').service('functionsRepository',
    function(Upload, $http) {

        function uploadEmployeeImage(file, firstName, lastName, id, companyId) {
            if (file) {
                Upload.rename(file, firstName + lastName + id + '.jpg');
                Upload.upload({
                    url: 'api/employees/upload',
                    file: file,
                    params: {
                        companyId: companyId
                    }
                });
            }
        }

        function uploadProductImage(file, name, id, companyId) {
            if (file) {
                Upload.rename(file, name + id + '.jpg');
                Upload.upload({
                    url: 'api/products/upload',
                    file: file,
                    params: {
                        companyId: companyId
                    }
                });
            }
        }

        function getTen(entityType, currentPosition, companyId) {
            return $http.get(`/api/${entityType}`,
                {
                    params: {
                        companyId: companyId,
                        currentPosition: currentPosition
                    }
                });
        }

        function searchRequest(entityType, companyId, searchText) {
            return $http.get(`/api/${entityType}/search`,
                {
                    params: {
                        companyId: companyId,
                        searchText: searchText
                    }
                });
        }

        function getGeneralInfo(companyId) {
            return $http.get('api/dashboard/generalinfo', {
                params: {
                    companyId: companyId
                }
            });
        }

        return {
            uploadEmployeeImage: uploadEmployeeImage,
            uploadProductImage: uploadProductImage,
            getTen: getTen,
            searchRequest: searchRequest,
            getGeneralInfo: getGeneralInfo
        }
    });