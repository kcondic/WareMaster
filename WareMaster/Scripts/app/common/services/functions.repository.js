angular.module('app').service('functionsRepository', function(Upload) {

    function uploadImage(file, firstName, lastName, id) {
        if (file) {
            Upload.rename(file, firstName + lastName + id + '.jpg');
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