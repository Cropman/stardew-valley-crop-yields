(function(){
	"use strict";
	/**\
	 * Searches for roots of a continuous fn(x).
	 * Rarely slower than bisection; often much faster.
	 *
	 * @x0,@x1 := domain bounds within which to search for a root
	 * @options ?: {} := {
	 * 	@sanity ?: 99 := upper limit on how many times we might iterate
	 * 	@x_epsilon ?: Number.EPSILON := required domain accuracy
	 * 	@y_epsilon ?: 0 := required range accuracy
	 * }
	\**/
	Function.prototype.regula_falsi = function(x0,x1,options){
		if('undefined' === typeof(options)){
			options = {};
		}
		if('undefined' === typeof(options.sanity)){
			options.sanity = 99;
		}
		if(options.sanity <= 0){
			throw "sanity must be a positive integer";
		}
		if('undefined' === typeof(options.x_epsilon)){
			options.x_epsilon = Number.EPSILON;
		}
		if('undefined' === typeof(options.y_epsilon)){
			options.y_epsilon = 0;
		}
		let xs = [x0,x1];// lets us refer to x0 as x[0] without `eval`
		let ys = [this(xs[0]),this(xs[1])]; // ditto
		let num_variations = 4;// determines how often we fall back to bisection

		// Sometimes we're passed the answer.
		if(0 === ys[0]){return xs[0]}
		if(0 === ys[1]){return xs[1]}

		let x,which_bound=0; // zero was chosen arbitrarilly.
		do{
			let _case = (num_variations- options.sanity % num_variations)% num_variations;
			switch(_case){
				case 0: // Bisection.

					x = (xs[0]+xs[1])/2;
					if(x === xs[0] || x === xs[1]){
						// We've reached the precision limits of floating point numbers.
						// Let's return the better of 'em.
						if(Math.abs(ys[which_bound]) < Math.abs(ys[1-which_bound])){
							return xs[which_bound];
						}else{
							return xs[1-which_bound];
						}
					}
				break;
				case 1: // True Regula Falsi
				case 2: // Illinois
				default: // Even more Illinois?  Our use case has insane functions.
					/**\
					 * Choose a new x, starting from the bound that didn't move (xs[1-which_bound])
					 * and slide walk towards the other bound by -y/slope
					 * Fudge the slope ensure we don't get stuck choosing the same bound over and over again.
					 * (This "fudge factor" actually has mathematical riggor.)
					\**/
					let m = ((ys[1-which_bound]/_case-ys[which_bound])
							/(xs[1-which_bound]-xs[which_bound]));
					x =
						xs[which_bound]
						-ys[which_bound]
						/m
					;
				break;
				// It would be reasonable to add other cases:
				// case 3: // Muller's method.
			}
			let y = this(x);
			if(Math.abs(y) <= options.y_epsilon){return x}
			which_bound = 
				(y < 0) === (ys[0] < 0)
				? 0
				: 1
			;
			xs[which_bound] = x;
			ys[which_bound] = y;
			if(Math.abs(xs[0]-xs[1]) <= options.x_epsilon){return x}
		}while(options.sanity--);
		return x;
	};
})();
