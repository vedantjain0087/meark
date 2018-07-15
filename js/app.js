var myApp = angular.module('myApp',['ngRoute']);

angular
.module('myApp').service('fileUpload', function ($http,$log) {
  this.uploadFileToUrl = function(file, uploadUrl,type){

    var fd = new FormData();
    fd.append('file',file);
    fd.append('param',type);

    if(file != undefined){  
    var validExts = ['application/pdf','image/png','image/jpeg','image/jpg']; // Allowed Extensions
    if(validExts.indexOf(file.type)==-1){
      alert('Check File Type','Allowed files are pdf,jpg,jpeg and png.','warning');
      return;
    }
    if(file.size >= 2*1024*1024 ){  // Max Upload Size is 2MB
      alert('Check File Size','Max Upload size is 2 Mb','warning');
      return;
    }
   }
 
    var ret = $http.post(uploadUrl, fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined, withCredentials: true}
               }).then(function(response){
                if(response.data.error == true)
                alert('Problem in Upoading file',response.data.msg,'warning');
         return response;   
               }).catch(function(response){  
        alert('Error','File Could Not Be Uploaded..','error');
               });
    return ret;

       }
  
});



myApp.config(function ($routeProvider) {
    
    $routeProvider
    
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    })
    .when('/dashboard', {
        templateUrl: 'pages/dashboard.html',
        controller: 'dashController'
    })
});

myApp.controller('homeController', ['$scope', '$location', function($scope,$location){

 $scope.baseURL = "ec2-18-222-199-100.us-east-2.compute.amazonaws.com:4000/";

}]);    
myApp.controller('dashController', ['$scope', '$location','fileUpload','$http', function($scope,$location,fileUpload,$http){

 $scope.baseURL = "ec2-18-222-199-100.us-east-2.compute.amazonaws.com:4000/";
    $scope.URL = "ec2-18-222-199-100.us-east-2.compute.amazonaws.com:4000/";
    $scope.images = []
    myFile1 = [];
    var file_upload = [];
    file_name = [];
    $scope.upload = function(files) {

        for(i=0 ; i<files.length; i++){
            console.log(files[i].name);
            myFile1.push(files[i]);
        file_name.push(files[i].name);  
        


        }
       
              }

    $scope.add = function(){
        console.log(document.getElementById('file').files);
        arr = document.getElementById('file').files
for(i=0;i<myFile1.length; i++){
    var promise = fileUpload.uploadFileToUrl(myFile1[i], $scope.baseURL+'upload','about_image');
    promise.then(
        function(response){
            var reader = new FileReader();

            reader.onload = function(event) {
              $scope.image_source = event.target.result
              $scope.$apply()
          
            }
            for(i=0;i<arr.length; i++){
            reader.readAsDataURL(document.getElementById('file').files[i]);
            }

         console.log("done");
         $http.get($scope.baseURL+"get_image")
         .success(function(result){
          
           console.log(result);
         })
         .error(function(data,status){
           console.log(data);
         });


        });

}


    }
  
  }]);    
