/***
   *
   * Preisach_Discrete.js
   * @author marcd 2017-01
   *
   ***/

Preisach_Discrete_Nonlinear = function(min, max, p){
    var supportMin: min;
    var supportMax = max;
    var hysteronPrecision = p;  
    
    /*
     * still not sure if these should be here or in the relay class!!
     */
    var branch0 = "0";
    var branch1 = "1";

    var input = 0.0;
    var output = 0.0;
    var previousMax = 0.0;
    var previousMin = 0.0;

    var supSize = supportMax - supportMax;
    var numGraduations = Math.floor(supSize/hysteronPrecision);
    var hysterons = createHysterons();
//    var normalised: true;

    /**
      * update function...
      * send commands to elements which must do their own updating
      *
      */
    function createHysterons(){	
	var hs = new Preisach_Discrete_Element[numGraduations][numGraduations];
	return hs;
    };
    /**
      * update function...
      * send commands to elements which must do their own updating
      *
      */
    update: function (input) {
	
    },
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