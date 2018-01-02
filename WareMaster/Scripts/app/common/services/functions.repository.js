angular.module('app').service('functionsRepository',
    function(Upload) {

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

        return {
            uploadEmployeeImage: uploadEmployeeImage,
            uploadProductImage: uploadProductImage
        }
    });