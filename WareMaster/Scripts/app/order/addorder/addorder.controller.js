angular.module('app').controller('AddOrderController',
    function ($scope, $state, employeesRepository, productsRepository, ordersRepository, suppliersRepository, loginRepository, activitylogRepository, functionsRepository) {

        $scope.incomingSelected = false;
        $scope.outgoingSelected = false;
        $scope.selectedEmployee = null;
        $scope.selectedProducts = [];
        $scope.showDeselectX = false;
        $scope.phase = 1;

        $scope.employees = [];
        $scope.allProducts = [];
        const companyId = loginRepository.getCompanyId();
        let currentPositionEmployees = 0;
        let currentPositionProducts = 0;

        suppliersRepository.getAllSuppliers(companyId).then(function(allSuppliers) {
            $scope.suppliers = allSuppliers.data;
            $scope.selectedSupplier = $scope.suppliers[0];
        });

        function loadEmployees() {
            functionsRepository.getTen('employees', currentPositionEmployees, companyId).then(function (employees) {
                $scope.employees.push(...employees.data);
            });
        };

        function loadProducts() {
            functionsRepository.getTen('products', currentPositionProducts, companyId).then(function (allProducts) {
                $scope.allProducts.push(...allProducts.data);
            });
        };

        $scope.loadMoreEmployees = function () {
            loadEmployees();
            currentPositionEmployees += 10;
        }

        $scope.loadMoreProducts = function () {
            loadProducts();
            currentPositionProducts += 10;
        }

        $scope.getProductsForSupplier = function () {
            if ($scope.selectedSupplier)
                $scope.products = $scope.selectedSupplier.Products;
            else
                $scope.products = null;
            $scope.selectedProducts = [];
        }

        $scope.incomingSelect = function() {
            $scope.incomingSelected = true;

            if ($scope.suppliers.length === 0) {
                alert('Nemate nijednog dobavljača!\nPrije stvaranja ulazne narudžbe morate dodati barem jednog dobavljača');
                $state.go('orders', {}, { reload: true });
            }
            else
                $scope.getProductsForSupplier();
        }

        $scope.outgoingSelect = function () {
            $scope.outgoingSelected = true;
        }

        $scope.selectEmployee = function (employee) {
            if ($scope.selectedEmployee !== null) {
                alert('Već je odabran radnik');
                return;
            }
            $scope.showDeselectX = true;
            $scope.selectedEmployee = employee;
            $scope.employees.splice($scope.employees.indexOf(employee), 1);
        }

        $scope.deselectEmployee = function (employee) {
            $scope.showDeselectX = false;
            $scope.employees.push(employee);
            $scope.selectedEmployee = null;
        }

        $scope.isEmployeeSelected = function () {
            return $scope.showDeselectX;
        }

        $scope.selectIncomingProduct = function (product) {
            $scope.selectedProducts.push(product);
            $scope.products.splice($scope.products.indexOf(product), 1);
        }

        $scope.deselectIncomingProduct = function (product) {
            $scope.products.push(product);
            $scope.selectedProducts.splice($scope.selectedProducts.indexOf(product), 1);
        }

        $scope.selectOutgoingProduct = function (product) {
            $scope.selectedProducts.push(product);
            $scope.allProducts.splice($scope.allProducts.indexOf(product), 1);
        }

        $scope.deselectOutgoingProduct = function (product) {
            $scope.allProducts.push(product);
            $scope.selectedProducts.splice($scope.selectedProducts.indexOf(product), 1);
        }

        $scope.addNewOrder = function () {
            if ($scope.selectedProducts.length === 0) {
                alert('Morate naručiti barem jedan proizvod');
                return;
            }
            
            const productOrder = [];
            for (let product of $scope.selectedProducts)
                productOrder.push({
                    ProductId: product.Id,
                    ProductQuantity: product.Counter
                });

            let supplierId;
            if ($scope.incomingSelected)
                supplierId = $scope.selectedSupplier.Id;
            else
                supplierId = null;

            const assignedEmployeeId = !$scope.selectedEmployee ? null : $scope.selectedEmployee.Id;

            const newOrder = {
                AssignedEmployeeId: assignedEmployeeId,
                AssignedManagerId: loginRepository.getManagerId(),
                ProductOrders: productOrder,
                CompanyId: companyId,
                Status: 0,
                Type: $scope.incomingSelected ? 0:1,
                SupplierId: supplierId
            };

            ordersRepository.addNewOrder(newOrder).then(function () {
                if(newOrder.Type === 0)
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je stvorio ulaznu narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                else
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je stvorio izlaznu narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                $state.go('orders', {}, { reload: true });
            });          
        }
    });