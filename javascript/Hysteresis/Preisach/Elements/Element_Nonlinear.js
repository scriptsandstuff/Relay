
/***
   *
   * Element_Nonlinear.js
   * @author marcd 2017-01
   *
   */
/***
   *
   * this is a container class 
   * the member common to all Discrete_Preisach_Element objects is the Preisach_Relay
   * This is a parent class and expected to be extended to include graphical elements
   * --because the sub objects in the container are arbitrary
   *
   * Discrete_Preisach will send commands to this object
   * this object will send commands to the sub-objects 
   *
   */
function Element_Nonlinear(tl, th, func1, func2, weight){//r, brd, bl, bh, n){
    // since it is an extension we do not need any such ?semiConstant
    // var isSemiConstant = true;
    // these func's should be static
    this.func1 = func1;
    this.func2 = func2;
    this.weight = weight;
    var relay = new Relay(th, tl, false);
    
   
    this.update = function(x) {
	var state = this.relay.state;
	this.relay.update(x);
	if( state != this.relay.state) this.flip();
    };

    this.updateNoFlip = function(x) {
	//need this function for function relays
    };
    this.flip = function(onTotal) {
	if(this.relay.state){
	    this.point.setAttribute({ fillOpacity:1 });
	    onTotal -= this.weight;	    
	}else{
	    this.point.setAttribute({ fillOpacity:0 });
	    onTotal += this.weight;
	}
	this.relay.state = !this.relay.state;
    };
/*
    setLowerBound: function (a) {
	this.lowerBound = a;
    },
    setHigherBound: function(b) {
	this.higherBound = b;
    },
    setWeight: function (w) {
	this.weight = w;
    },	
*/
    return this;
}
/*
		if(x <= this.threshold_lower) this.state = 0;
		else if(x >= this.threshold_higher) this.state = 1;
      return this.state;
   };
   this.init = function(inMin, inMax, buf){
   	var size = inMax - inMin;
   	var x = inMin + buf;
   	var threshold_lower_inset = 0.25*(size - 2*buf);
   	var threshold_higher_inset = 0.75*(size - 2*buf);
		threshold_lower = x + threshold_lower_inset;
		threshold_higher = x + threshold_higher_inset;
		this.update(x);
   	
   };
   */
   /*
   getState = function(){
   	return state;
   };
   */
}

/*	
var relay = {
    state: false,
    lowerBound: 0.0,
    higherBound: 1.0,
    weight: 1.0,
    
    update: function (input) {
		//this.input = input;
		if(x <= lowerBound) this.state = false;
		else if(x >= higherBound) this.state = true;
      return this.state;
   },    
	setLowerBound: function (a) {
		this.lowerBound = a;
	},
	setHigherBound: function(b) {
		this.higherBound = b;
	},
	setWeight: function (w) {
		this.weight = w;
	},	
}
*/