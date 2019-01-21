/***
   *
   * Discrete.js
   * will be extended ..._Nonlinear
   * @author marcd 2017-01
   *
   ***/

/**
 * the builder class will build whatever is needed
 * this is for the dynamics
 * 
 */
Discrete = function(thresholds, weights){
    this.thresholds = thresholds;
    this.weights = weights;
    this.history = [];
    var input = 0.0;
    var output = 0.0;

  
    this.hysterons =  function(){	
		var l = ts.length;
		var elements = new Element[l][l];
		var i = 0;
		var j = 0
		for(t : ts){
		    for(tt : ts){
				elements[i][j] = new element(t, tt, this.weight);
				j++;
			}
		    i++;
		}
		return elements;
    };
    /**
      * update function...
      * send commands to elements which must do their own updating
      *
      */
    this.update = function (input) {
	if (input <= inputOld) {
	    if ( idxT == 0 || input > this.thresholds[idxT] ) {
	    	decreaseNoSwitch(input);
	    } else {
	    	decrease(input);
	    	idxT--;
	    }
	}else if(input >= inputOld){
	    if(idxT+1 == thresholds.length || input < this.thresholds[idxT+1]){
	    	increaseNoSwitch();
	    }else {
	    	increase(input);
	    	idxT++;
	    }
	}else{
		Console.out("Error");
	}// update called without input change
	inputOld = input;
};

//    this.update = function(increasing, switched){ if(increasing){} if(switched){}    }
/*
 * must be overridden for Elements where
 *  --Relays are not semi constant 
 *  --they contain more than just the relay
 *
 */
    this.decrease = function(){
    };

    this.increase = function(){
    };
    
    this.decreaseNoSwitch = function(){
    	return this.output;
    };
    
    this.increaseNoSwitch = function(){
    	return this.output;
    };
}

/*
  this stuff shold be done in .._Element class
	for(attribute : Preisach_Discrete_Element.attributes){
	    attribute.update;
	}
	//this.input = input;
	if(x <= lowerBound) this.state = false;
	else if(x >= higherBound) this.state = true;
	return this.state;
*/