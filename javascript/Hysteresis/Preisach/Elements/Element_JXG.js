
/**
 *
 * Element_JXG.js
 *  @author marcd 2017-01
 *
 */
/***
   *
   * Preisach_Discrete will send commands to this object
   * this object will send commands to the sub-objects (relay, graphObj, etc)
   *
   */
function Element_JXG(tl, th, weight, brd, PPhVl){
//    super()
    this.relay = new Relay(tl, th, false);
    this.weight = weight;
    this.pointPP = brd.create('point');
    this.pointPP.setAttribute({ size:10, color:'green', fillOpacity:0 });
    if(PPhVl){
    	this.pointPP.moveTo(
    			[this.relay.threshold_higher, this.relay.threshold_lower]
    	);
    }else{
    	this.pointPP.moveTo(
    			[this.relay.threshold_lower, this.relay.threshold_higher]
    	);
    }
    
    this.update = function(x) {
		var state = this.relay.state;
		this.relay.update(x);
		var changeThisUpdate = 0;
		if( state == this.relay.state) {	    
		    changeThisUpdate = 0; // this.noFlip();
		}else if(state && !this.relay.state){	
		    this.point.setAttribute({ fillOpacity:1 });
		    changeThisUpdate -= this.weight;
		}else{
		    this.point.setAttribute({ fillOpacity:0 });
		    changeThisUpdate += this.weight;
		}
		dpTotal += changeThisUpdate;
    };
}