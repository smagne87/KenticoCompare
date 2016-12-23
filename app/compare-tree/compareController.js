//angular module
angular.module('myApp.compare', ['angularTreeview', 'ngRoute', 'myApp.KenticoService'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/compare', {
            templateUrl: 'compare-tree/compare.html',
            controller: 'compareController'
        });
    }])
    .controller('compareController', function ($scope, KenticoService, $q) {
        ///Properties
        $scope.tabs = [];
        $scope.sourceError = false;
        $scope.targetError = false;
        $scope.currentNodeSource = {};
        $scope.currentNodeTarget = {};

        ///Public methods
        $scope.loadKenticoTrees = loadKenticoTrees;
        $scope.loadPagesForItem = loadPagesForItem;
        $scope.compareItems = compareItems;
        $scope.updateCurrentNode = updateCurrentNode;
        $scope.closeCurrentTab = closeCurrentTab;
        $scope.isClosableTab = isClosableTab;
        $scope.areSelectedNodes = areSelectedNodes;
        $scope.showColumn = showColumn;
        $scope.updateTarget = updateTarget;

        function updateTarget(propName, sourceValue) {

        }

        function _getCurrentTab() {
            for (var i = 0; i < $scope.tabs.length; i++) {
                var tab = $scope.tabs[i];
                if (tab.active) {
                    return tab;
                }
            }
            return null;
        }

        function showColumn(propertyName) {
            var currentTab = _getCurrentTab();

            try {
                if (currentTab.displayKenticoFields) {
                    return true;
                } else if (propertyName.toLowerCase().indexOf("document") === 0) {
                    return false;
                } else {
                    return true;
                }
            } catch (e) {

            }
        }

        function areSelectedNodes() {
            try {
                return ($scope.currentNodeSource.DocumentID && $scope.currentNodeTarget.DocumentID) && ($scope.currentNodeSource.DocumentClassName === $scope.currentNodeTarget.DocumentClassName);
            }
            catch (e) {
                return false;
            }
        }

        function isClosableTab() {
            for (var i = 0; i < $scope.tabs.length; i++) {
                var tab = $scope.tabs[i];
                if (tab.active) {
                    return true;
                }
            }
            return false;
        }

        function closeCurrentTab() {
            var _tabs = [];
            for (var i = 0; i < $scope.tabs.length; i++) {
                var tab = $scope.tabs[i];
                if (!tab.active) {
                    _tabs.push(tab);
                }
            }
            $scope.tabs = _tabs;
        }

        function compareItems() {
            $q.all([
                KenticoService.getKenticoItemInfo($scope.txtSource, $scope.currentNodeSource.DocumentID),
                KenticoService.getKenticoItemInfo($scope.txtTarget, $scope.currentNodeTarget.DocumentID)
            ]).then(function (response) {
                var sourceDoc = response[0].data.d;
                var targetDoc = response[1].data.d;
                var compTitle = sourceDoc.DocumentName + " - " + targetDoc.DocumentName;
                $scope.tabs.push({
                    active: true,
                    title: compTitle.substr(0, 50),
                    content: "Comparing " + compTitle,
                    kenticoSource: sourceDoc,
                    kenticoTarget: targetDoc,
                    displayKenticoFields: false
                })
            }).catch(function (error) {
                console.log(error);
            })
        }

        function updateCurrentNode(node, treeId) {
            if (treeId === "sourceTreeView") {
                $scope.currentNodeSource = node;
            } else {
                $scope.currentNodeTarget = node;
            }
            console.log(node.DocumentID);
        }

        function loadPagesForItem(node, treeId) {
            if (treeId === "sourceTreeView") {
                KenticoService.getPagesForItem($scope.txtSource, node.DocumentID).then(function (response) {
                    $scope.sourceList = updateTreeViewList($scope.sourceList, node.DocumentID, response.data.d);
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                KenticoService.getPagesForItem($scope.txtTarget, node.DocumentID).then(function (response) {
                    $scope.targetList = updateTreeViewList($scope.targetList, node.DocumentID, response.data.d);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }

        function updateTreeViewList(sourceList, documentId, children) {
            var resultList = [];
            for (var i = 0; i < sourceList.length; i++) {
                var currentNode = sourceList[i];
                if (currentNode.DocumentID === documentId) {
                    currentNode.DocumentChildren = children;
                    currentNode.childrenLoaded = true;
                } else if (currentNode.hasChildren && currentNode.DocumentChildren != null) {
                    currentNode.DocumentChildren = updateTreeViewList(currentNode.DocumentChildren, documentId, children);
                }
                resultList.push(currentNode);
            }
            return resultList;
        }

        function loadKenticoTrees() {
            $scope.sourceError = false;
            $scope.targetError = false;
            KenticoService.getAllPages($scope.txtSource).then(function (response) {
                $scope.sourceList = response.data.d;
            }).catch(function (error) {
                $scope.sourceError = true;
            });

            KenticoService.getAllPages($scope.txtTarget).then(function (response) {
                $scope.targetList = response.data.d;
            }).catch(function (error) {
                $scope.targetError = true;
            });
        }
    });
