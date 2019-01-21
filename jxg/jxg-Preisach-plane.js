
/**
 * must think about doing something to ensure that the hysteron is always in view 
 * must reset inputs to right or left of bounding box
 * must make constant axes on IO box
 */

var hystPolySize = 0.05;
var bb_pp = [-0.15, 1.15, 1.15, -0.15];		
var brd_pp = JXG.JSXGraph.initBoard('jxg-Relay', {
		boundingbox:bb_pp, axis:false, grid:false, 
		showNavigation:false,	showCopyright:false,
		zoom:{wheel:true, needshift:true}, 
		pan:{enabled:true, needshift:true}, 
		//dependentBoards:['jxg-IO-v-time']
	});
/**
 * make axes permanent
 * credit for these axes to the author of http://jsfiddle.net/migerh/DWpAw/
 */
var x0 = brd_pp.create('point', [function () {
    	var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [0, brd_pp.canvasHeight - 30], brd_pp);
    	return coords.usrCoords;
	}], {needsRegularUpdate: false, visible: false});
var x1 = brd_pp.create('point', [function () {
	    var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [brd_pp.canvasWidth, brd_pp.canvasHeight - 30], brd_pp);
   	 return coords.usrCoords;
	}], {needsRegularUpdate: false, visible: false});
var oX = brd_pp.create('axis', [x0, x1], {needsRegularUpdate: false, strokeColor: 'black'});// 'blue'});

var y0 = brd_pp.create('point', [function () {
    var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [30, brd_pp.canvasHeight], brd_pp);
    return coords.usrCoords;
}], {needsRegularUpdate: false, visible: false});
var y1 = brd_pp.create('point', [function () {
    var coords = new JXG.Coords(JXG.COORDS_BY_SCREEN, [30, 0], brd_pp);
    return coords.usrCoords;
}], {needsRegularUpdate: false, visible: false});
var oY = brd_pp.create('axis', [y0, y1], {needsRegularUpdate: false, strokeColor: 'black'});// 'red'});

/**
 * zoom on (0, 0) to always keep diagonal 
 *  
 */
/*brd_pp.on('mouseWheelListener', function(evt){
	if (!this.attr.zoom.wheel || (this.attr.zoom.needshift && !evt.shiftKey)) {
		return true;
   }
	evt = evt || window.event;
	var wd = evt.detail ? -evt.detail : evt.wheelDelta / 40,
	pos = new Coords(Const.COORDS_BY_SCREEN, this.getMousePosition(evt), this);
            
	if (wd > 0) {
   	this.zoomIn(-pos.usrCoords[1], -pos.usrCoords[1]);
	} else {
   	this.zoomOut(-pos.usrCoords[1], -pos.usrCoords[1]);
	}
	
	evt.preventDefault();
	return false;
});
*/
//brd_pp.on('zoomIn', function(x, y){
brd_pp.zoomIn = function(x, y){
	//return zoomInEqual(this, x, y);
	
	var bb = this.getBoundingBox(),
       zX = this.attr.zoom.factorx,
       zY = this.attr.zoom.factory,
       dX = (bb[2] - bb[0]) * (1.0 - 1.0 / zX),
       dY = (bb[1] - bb[3]) * (1.0 - 1.0 / zY),
       lr = 0.5,
       tr = 0.5;

   if (this.zoomX > this.attr.zoom.max || this.zoomY > this.attr.zoom.max) {
       return this;
   }
//   if (Type.isNumber(x) && Type.isNumber(y)) {
//       lr = (x - bb[0]) / (bb[2] - bb[0]);
//       tr = (bb[1] - y) / (bb[1] - bb[3]);
//   }  //------- y=x=0;
    lr = ( -bb[0]) / (bb[2] - bb[0]);
    tr = (bb[1] ) / (bb[1] - bb[3]);

   this.setBoundingBox([bb[0] + dX * lr, bb[1] - dY * tr, bb[2] - dX * (1 - lr), bb[3] + dY * (1 - tr)], false);
   this.zoomX *= zX;
   this.zoomY *= zY;

   brd_IO.setBoundingBox([bb[0] + dX * lr, 1.15, bb[2] - dX * (1 - lr), -0.15], false);
   brd_IO_slider.setBoundingBox([bb[0] + dX * lr, 0.15, bb[2] - dX * (1 - lr), -0.15], false);
   /**
    * must think about doing something to ensure that the hysteron is always in view 
    * must reset inputs to right or left of bounding box
    */
   return this.applyZoom();   
}
brd_pp.zoomOut= function (x, y) {
   var bb = this.getBoundingBox(),
       zX = this.attr.zoom.factorx,
       zY = this.attr.zoom.factory,
       dX = (bb[2] - bb[0]) * (1.0 - zX),
       dY = (bb[1] - bb[3]) * (1.0 - zY),
       lr = 0.5,
       tr = 0.5,
       mi = this.attr.zoom.eps || this.attr.zoom.min || 0.001;  // this.attr.zoom.eps is deprecated

   if (this.zoomX < mi || this.zoomY < mi) {
       return this;
   }
	lr = ( - bb[0]) / (bb[2] - bb[0]);
   tr = (bb[1] ) / (bb[1] - bb[3]);
       
   this.setBoundingBox([bb[0] + dX * lr, bb[1] - dY * tr, bb[2] - dX * (1 - lr), bb[3] + dY * (1 - tr)], false);
   this.zoomX /= zX;
   this.zoomY /= zY;

   brd_IO.setBoundingBox([bb[0] + dX * lr, 1.15, bb[2] - dX * (1 - lr), -0.15], false);
   brd_IO_slider.setBoundingBox([bb[0] + dX * lr, 0.15, bb[2] - dX * (1 - lr), -0.15], false);
   return this.applyZoom();
}
/**
 * set boundingBox to always keep diagonal y=x after panning 
 *  
 */
brd_pp.mouseOriginMove= function (evt) {
   var r = (this.mode === this.BOARD_MODE_MOVE_ORIGIN),
       pos;				
   if (r) {
       pos = this.getMousePosition(evt);
       this.moveOrigin(pos[0], pos[1], true);
       var bbb = this.getBoundingBox();
       this.setBoundingBox([bbb[3], bbb[1], bbb[1], bbb[3]], false);
      // if(this.)
   }
   return r;
}
/**
 * board objects
 */

var diagonal = brd_pp.create('line', 
		[[0, 0], [1, 1]], 
		{fixed:true, strokecolor: 'black', highlightstrokecolor: 'black'}//'blue'}
);
var in_in = brd_pp.create('glider', [ 0, 0,	diagonal]);
in_in.setAttribute({fixed: false, size:6, name:''});
/**
 * from http://jsxgraph.uni-bayreuth.de/docs/symbols/Point.html
 * //If given by a string or a function that coordinate will be constrained
 * //that means the user won't be able to change the point's position directly by mouse
 * //because it will be calculated automatically depending on the string or the function's return value.
 */ 
//so I guess we can go back to making a polygon!!
//polygons don't move either...but why can lines??
var hysteron_pp = brd_pp.create('point', [r.threshold_higher, r.threshold_lower],//[0.75, 0.25],
			{fixed:false, face:'[]', size:10, name:'', color:'green', //color:'lightblue', 
	fillOpacity:function(){return r.state;}});
/*
var hysteron_pp = brd_pp.create('point', 
		  [
		 	function(){	if(pp_highLow) return r.threshold_higher; else return r.threshold_lower;},
		 	function(){ if(pp_highLow) return r.threshold_lower; else return r.threshold_higher;}
		  ],
	{fixed:false, face:'[]', size:10, color:'lightblue', name:''}
);
var hystPoly = brd_pp.create('regularPolygon',  [
		   [
		 	function(){	if(pp_highLow) return r.threshold_higher - hystPolySize; else return r.threshold_lower - hystPolySize;},
		 	function(){ if(pp_highLow) return r.threshold_lower- hystPolySize; else return r.threshold_higher - hystPolySize;}
		  ],[
			 	function(){	if(pp_highLow) return r.threshold_higher + hystPolySize; else return r.threshold_lower + hystPolySize;},
			 	function(){ if(pp_highLow) return r.threshold_lower - hystPolySize; else return r.threshold_higher - hystPolySize;}
		     ]
		   , 4], {hasInnerPoints: true}
		);
*/
//var hystPoly = brd_pp.create('regularPolygon',  [[0.7, 0.2], [.8, .2], [.8, .3], [.7, .3]], 
//		{vertices:{visible:false}, hasInnerPoints: true});
var threshold_higher_pp = brd_pp.create('line', 
		//because we are drawing the threshold all the way across plane we can define the line in a more simple way 
		[[function(){if(pp_highLow) return r.threshold_higher; else return brd_pp.getBoundingBox()[0];},
		  function(){if(pp_highLow) return  brd_pp.getBoundingBox()[3]; else return r.threshold_higher;}],
		  [
		 	function(){	if(pp_highLow) return r.threshold_higher; else return r.threshold_lower;},
		 	function(){ if(pp_highLow) return r.threshold_lower; else return r.threshold_higher;}
		  ]
		 ],
		{color:'red', dash:true, strokeWidth:1}//, straightLast:false}
);
var threshold_lower_pp = brd_pp.create('line', 
		[[function(){if(pp_highLow) return brd_pp.getBoundingBox()[0]; else return r.threshold_lower;},
		  function(){if(pp_highLow) return r.threshold_lower; else return  brd_pp.getBoundingBox()[3];}],
		  [
		 	function(){	if(pp_highLow) return r.threshold_higher; else return r.threshold_lower;},
		 	function(){ if(pp_highLow) return r.threshold_lower; else return r.threshold_higher;}
		  ]
		 ],
		{color:'blue', dash:true, strokeWidth:1}//, straightLast:false}
);
//remember the axis does not go thro (0, 0) so might look a little off!!
//var poly = b.create('regularpolygon', [[0.7, 0.2], [0.8, 0.2], 4]);

//hysteron_pp.on('mousedrag', function(evt){

hysteron_pp.on('drag', function(evt){
//hystPoly.on('drag', function(evt){
	qualityDown([brd_IO, brd_pp]);

    var crds = new JXG.Coords(JXG.COORDS_BY_SCREEN, brd_pp.getMousePosition(evt), brd_pp);
//    var x = crds.usrCoords[1];//	var x = this.point1.X();
    if(crds.usrCoords[1] > crds.usrCoords[2]){
    	pp_highLow = true;
		r.threshold_higher = crds.usrCoords[1];
		r.threshold_lower = crds.usrCoords[2];
		hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
    }else{
    	pp_highLow = false;
		r.threshold_lower = crds.usrCoords[1]; 
		r.threshold_higher = crds.usrCoords[2];
		hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
    }
    /*
	r.threshold_lower = x;
	if(x > r.threshold_higher - 0.1) r.threshold_higher = x + 0.1;
	
	
	var x = hysteron_pp.X(),
		y = hysteron_pp.Y();
	if(x > y){
		pp_highLow = true;
		r.threshold_lower = y;//hysteron_pp.Y();
		r.threshold_higher = x;//hysteron_pp.X();
//		threshold_lower_io0.moveTo([y, 1]);
//		threshold_lower_io1.moveTo([y, 0]);
		
	}else if(y > x){
		pp_highLow = false;
		r.threshold_lower = hysteron_pp.X();
		r.threshold_higher = hysteron_pp.Y();		
	}else if (x == y){
		//it is a switch
		//can think about attracting it to diagonal and doing something special for switch
	}else{}
//	can't happen but maybe should handle
	*/
	
	brd_IO.update();
	brd_pp.update();
	qualityUp([brd_IO, brd_pp]);
});
threshold_higher_pp.on('drag', function(evt){
	qualityDown([brd_IO, brd_pp]);
	
	var crds = new JXG.Coords(JXG.COORDS_BY_SCREEN, brd_pp.getMousePosition(evt), brd_pp);
	var x = crds.usrCoords[1];
    var y = crds.usrCoords[2];
    if(pp_highLow){//plane on right at last update
    	if(x > r.threshold_lower){//if plane still on right
        	r.threshold_higher = x;
//        	r.threshold_lower = y; //y doesn't change
        	pp_highLow = true;
        	hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
    	}else{//plane changed to left
        	r.threshold_higher = r.threshold_lower;
        	r.threshold_lower = x;
        	pp_highLow = false;
        	hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);    		
    	}
	}else{//plane on left at last update
    	if(x < r.threshold_higher){//if plane still on left
        	r.threshold_lower = x;
//        	r.threshold_lower = y; //y doesn't change
        	pp_highLow = false;
        	hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
    	}else{//plane changed to right
        	r.threshold_lower = r.threshold_higher;
        	r.threshold_higher = x;
        	pp_highLow = true;
        	hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);    		
    	}		
	}
	brd_IO.update();
	brd_pp.update();		
	qualityUp([brd_IO, brd_pp]);
}
);
threshold_lower_pp.on('drag', function(evt){
	qualityDown([brd_IO, brd_pp]);
	
	var crds = new JXG.Coords(JXG.COORDS_BY_SCREEN, brd_pp.getMousePosition(evt), brd_pp);
	var x = crds.usrCoords[1];
    var y = crds.usrCoords[2];
    if(pp_highLow){//plane on right at last update
    	if(y < r.threshold_higher){//if plane still on right
//        	r.threshold_higher = x;
        	r.threshold_lower = y; //x doesn't change
        	pp_highLow = true;
        	hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
    	}else{//plane changed to left
    		r.threshold_lower = r.threshold_higher
        	r.threshold_higher = y;
        	pp_highLow = false;
        	hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);    		
    	}
	}else{//plane on left at last update
    	if(y > r.threshold_lower){//if plane still on left
//        	r.threshold_lower = x;
        	r.threshold_higher = y; //x doesn't change
        	pp_highLow = false;
        	hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
    	}else{//plane changed to right
        	r.threshold_lower = r.threshold_higher;
        	r.threshold_higher = y;
        	pp_highLow = true;
        	hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);    		
    	}		
	}
	brd_IO.update();
	brd_pp.update();		
	qualityUp([brd_IO, brd_pp]);
}
);
in_in.on('drag', function(){
	qualityDown([brd_IO, brd_pp]);
	
// should be able to draw in_in up to threshold and then the rest...
	time_since_update = +new Date() - time_last_update;
	time_last_update = +new Date();
	time_current += time_since_update/1000;
	//pt2.setAttribute({size:20});belongs to IO	
	var out = r.update(this.X());
	//in_out.setPositionDirectly(JXG.COORDS_BY_USER, [this.X(), out]);
	in_out.moveTo([this.X(), out]);//could define in_out as a function cause it is not draggable, 
	in_out_slide.moveTo([this.X(), 0]);//can't be defined as a function cause it is draggable
	//wouldn't need to set position if defined as function, just board.update()s
	//in_time_turtle.moveTo([time_current, this.X()]);
	//in_time.setPositionDirectly(JXG.COORDS_BY_USER, [time_current, this.X()]);
	/*
	if(switched){	
		out_time_turtle.penup();
		out_time_turtle.moveTo([time_current, r.state]);
		out_time_turtle.moveTo([time_current, r.state]);
		out_time_turtle.pendown();
		out_time_turtle.moveTo([time_current, r.state]);	
	}
	//out_time.moveTo([time_current, out]);
	if(time_current > time_window ){
		brd_IOt = moveView(brd_IOt, time_current);
	}
	*/
//	brd_pp.update();
	qualityUp([brd_IO, brd_pp]);
});

/*
wiper = brd_pp.create(   'line',	[	//horizontal line           
		[ function(){return inVal.X();},  function(){return inVal.X();}  ],
		[ 2, function(){return inVal.X();} ]
	],
	{	// strokeColor:'#aa2233',
		straightFirst:false, 
		straightLast:false, 
		strokeWidth:1, 
		trace:false
	}
);
painter = brd_pp.create(	'line', [	// vertical line 
 		[ function(){return inVal.X();}, function(){return inVal.X();} ],
		[ function(){return inVal.X();},            0        ]	
	], 
 	{	//	strokeColor:'#aa2233',
		straightFirst:false, 
		straightLast:false, 
 		strokeWidth:3, 
 		trace:false
 	}
);
*/

