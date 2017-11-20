(function(){
	"use strict";
	angular.module('App', []
	).filter('cropField',function(){
		return function(field_value,field_name){
			switch(field_name){
				case'dpy':
					return field_value.toPrecision(3)+"%";
				default:
					return field_value;
			}
		}
	}).controller('CropAnalysisController',['$scope',function($scope,$filter) {
		window.$scope = $scope;
		$scope.weekdays= [
			{index:0,name:'Monday'}
			,{index:1,name:'Tuesday'}
			,{index:2,name:'Wednesday'}
			,{index:3,name:'Thursday'}
			,{index:4,name:'Friday'}
			,{index:5,name:'Saturday'}
			,{index:6,name:'Sunday'}
		];
		$scope.day = 0;
		Object.defineProperties($scope,{
			week_index:{
				get:function(){return Math.floor(this.day/7)}
				,set:function(_){
					this.day = 7*_ + this.weekday_index;
				}
			},weekday_index:{
				get:function(){return this.day%7}
				,set:function(_){
					this.day -= this.weekday_index;
					this.day += _;
				}
			},day_no:{
				get:function(){return 1+this.day}
				,set:function(_){this.day = _-1}
			},week_no:{
				get:function(){return 1+this.week_index}
				,set:function(_){this.week_index = _-1}
			}
		});
		$scope.seasons = [
			{
				name:'Spring'
				,crops:[
					new Crop('cauliflower',80,175,12)
					,new Crop('green bean',60,40,10,{next:3})
					,new Crop('kale',70,110,6)
					,new Crop('parsnip',20,35,4)
					,new Crop('potato',50,80*1.2,6)
					,new Crop('tulip',20,30,6)
				]
			},
			{
				name:'Summer'
				,crops:[
					new Crop('blueberries',80,50,13,{next:4,sell_qty:3})
					,new Crop('corn',150,50,14,{next:4,max_days:28*2})
					,new Crop('hops',60,25,11,{next:1})
					,new Crop('hot peppers',40,40,5,{next:3})
					,new Crop('mellon',80,250,12)
					,new Crop('poppy',100,140,7)
					,new Crop('radish',40,90,6)
					,new Crop('summer spangle',50,90,8)
					,new Crop('sunflower',200,80,8,{seed_qty:0.9})
					,new Crop('tomato',50,60,11,{next:4})
					,new Crop('wheat',10,25,4)
				]
			},
			{
				name:'Fall'
				,crops:[
					new Crop('corn',150,50,14,{next:4})
					,new Crop('sunflower',200,80,8,{seed_qty:0.9})
					,new Crop('wheat',10,25,4)
					,new Crop('amaranth',70,150,7)
					,new Crop('bok choy',50,80,4)
					,new Crop('cranberries',240,75,7,{next:5,sell_qty:2})
					,new Crop('eggplant',20,60,5,{next:5})
					,new Crop('fairy rose',200,290,12)
					,new Crop('grape',60,80,10,{next:3})
					,new Crop('pumpkin',100,320,13)
					,new Crop('yam',60,160,10)
				]
			}
		];
		$scope.current_season = $scope.seasons[0];
	}]).controller('CropController',['$scope',function($scope,$filter) {
		$scope.$watch('day_no',function(_){
			$scope.crop.start_day = _;
		});
	}]);
})();
