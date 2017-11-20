(function(){
	"use strict";
	(window.Crop = function(
		name,buy_price,sell_price,maturity,
		args
	){
		if('undefined' === typeof(args)){
			args = {};
		}
		if('last_day' in args){
			this.last_day = args.last_day;
		}else{
			this.last_day = 28;
		}
		if('sell_qty' in args){
			this.sell_qty = args.sell_qty;
		}else{
			this.sell_qty = 1;
		}
		if('seed_qty' in args){
			this.seed_qty = args.seed_qty;
		}else{
			this.seed_qty = 0;
		}
		if('next' in args){
			this.next = args.next;
			if('seed_qty' in args){
				throw "Mixing seed_qty with next is unsupported.";
			}
		}
		this.name = name;
		this.buy_price = buy_price;
		this.sell_price = sell_price;
		this.maturity = maturity;
		this.calc_dpy = (function(_crop){
			return function(){
				if(_crop.days < _crop.maturity){
					return 0;
				}
				let dpy;
				dpy = (function(dpy){
					let days = _crop.days;
					let accumulator = 0 - _crop.buy_price;
					accumulator *= Math.pow(dpy,_crop.maturity);
					days -= _crop.maturity;
					accumulator += _crop.sell_price*_crop.sell_qty;
					if(_crop.seed_qty){
						let active_plants = 1;
						for(;_crop.maturity <= days; days -= _crop.maturity){
							active_plants *= _crop.seed_qty;
							accumulator *= Math.pow(dpy,_crop.maturity);
							accumulator += active_plants* _crop.sell_price*_crop.sell_qty*_crop.seed_qty;
						}
					}else if(_crop.next){
						for(;_crop.next <= days; days -= _crop.next){
							accumulator *= Math.pow(dpy,_crop.next);
							accumulator += _crop.sell_price*_crop.sell_qty;
						}
					}
					return accumulator;
				}).regula_falsi(0.5,1.4,{x_epsilon:0.00001});
				dpy -= 1;
				dpy *= 100;
				return dpy;
			}
		})(this);
		this._dpy = null;
		this._days = null;
		this._start_day = 1;
	}).prototype = {
		get start_day (){return this._start_day;}
		,set start_day(_){
			if(this._start_day === _){return}
			this._start_day = _;
			this._days = null;
		}
		,get days(){
			if(null === this._days){
				let days = this.last_day - this.start_day;
				if(days < this.maturity){
					this.days = 0;
				}else if(this.next){
					this.days = days-(days-this.maturity)%this.next;
				}else{
					this.days = days-days%this.maturity;
				}
			}
			return this._days;
		}
		,set days(_){
			if(this._days === _){return}
			this._days = _;
			this._dpy = null;
		}
		,get dpy(){
			if(null === this._dpy){
				this._dpy = this.calc_dpy();
			}
			return this._dpy;
		}
	};
})();
