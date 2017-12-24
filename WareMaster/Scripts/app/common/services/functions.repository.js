angular.module('app').service('functionsRepository', function(Upload) {

    function uploadImage(file, firstName, lastName) {
        if (file) {
            Upload.rename(file, firstName + lastName + '.jpg');
            Upload.upload({
                url: 'api/employees/upload',
                file: file
            });
        }
    }

    return {
        uploadImage: uploadImage
    }
})