angular.module('app').service('functionsRepository', function(Upload) {

    function uploadEmployeeImage(file, firstName, lastName, id) {
        if (file) {
            Upload.rename(file, firstName + lastName + id + '.jpg');
            Upload.upload({
                url: 'api/employees/upload',
                file: file
            });
        }
    }

    function uploadProductImage(file, name, id) {
        if (file) {
            Upload.rename(file, name + id + '.jpg');
            Upload.upload({
                url: 'api/products/upload',
                file: file
            });
        }
    }

    return {
        uploadEmployeeImage: uploadEmployeeImage,
        uploadProductImage: uploadProductImage
    }
})