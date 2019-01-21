
/***
   *
   * Preisach_Discrete_Element.js
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
function Element(tl, th, weight){
//pt, func1, func2, weight){//r, brd, bl, bh, n){
    this.weight = weight;
    this.relay = new Relay(tl, th, false);
    

    this.update = function(x) {
	var state = this.relay.state;
	this.relay.update(x);
	var changeThisUpdate = 0;
	if( state == this.relay.state) {	    
	    changeThisUpdate = 0; // this.noFlip();
	}else if(state && !this.relay.state){	
	    changeThisUpdate -= this.weight;
	}else{
	    changeThisUpdate += this.weight;
	}
	dpTotal += changeThisUpdate;
    };   
}
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