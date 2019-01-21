
/**
 * must think about doing something to ensure that the hysteron is always in view 
 * must reset inputs to right or left of bounding box
 * must make constant axes on IO box
 */

var hystPolySize = 0.05;
var bb_pp = [-0.15, 1.15, 1.15, -0.15];		
var brd_pp = JXG.JSXGraph.initBoard('jxg-Relay', {
		boundingbox:bb_pp, 
		axis:true, 
		grid:false, 
		showNavigation:false,	showCopyright:false,
		zoom:{wheel:true, needshift:true}, 
		pan:{enabled:true, needshift:true},
		dependentBoards:['brd_IO', 'brd_IO_slider']
		//dependentBoards:['jxg-IO-v-time']
	});
/**
 * zoom on (0, 0) to always keep diagonal 
 *  
 */
brd.zoomIn = function(x, y){
		var z = 0.5*(x+y);//project (x, y) onto the diagonal

	    JXG.Board.prototype.zoomIn.call(this, z, z);
		JXG.Board.prototype.zoomIn.call(brd_IO, x, y);	
		JXG.Board.prototype.zoomIn.call(brd_IO_slider, x, y);
//		brd_IO.zoomIn(x, y);
//		brd_IO_slider.zoomIn(x, y);

		var bb = this.getBoundingBox(),
			boxSize = bb[2] - bb[0];
	    r.threshold_lower = bb[0] + boxSize*0.35/1.3;
	    r.threshold_higher = bb[0] + boxSize*0.85/1.3;
	    if(pp_highLow) hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
	    else hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
	    zeroInputs(bb[0], boxSize);
	    	
	return this;	
}
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
   /**
    * must think about doing something to ensure that the hysteron is always in view 
    * must reset inputs to right or left of bounding box
    */
//brd_pp.on('zoomIn', function(x, y){
brd_pp.zoomIn = function(x, y){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
   zeroInputs();
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
   var xx = bb[0] + (bb[2] - bb[0])/2;
   lr = (xx - bb[0]) / (bb[2] - bb[0]);
   tr = (bb[1] -xx) / (bb[1] - bb[3]);

    var xl = bb[0] + dX * lr;
    var xh = bb[2] - dX * (1 - lr);
 //   brd_pp.setBoundingBox([xl, bb[2] - dX * lr, xh, bb[0] + dX * (1 - lr)], false);
 //   brd_IO_slider.setBoundingBox([xl, 0.15, xh, -0.15], false);
    var boxSize = xh - xl;
    r.threshold_lower = xl + boxSize*0.35/1.3;
    r.threshold_higher = xl + boxSize*0.85/1.3;
    if(pp_highLow) hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
    else hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
    zeroInputs(xl, boxSize);
    
   this.setBoundingBox([bb[0] + dX * lr, bb[1] - dY * tr, bb[2] - dX * (1 - lr), bb[3] + dY * (1 - tr)], false);
   this.zoomX *= zX;
   this.zoomY *= zY;

   brd_IO.setBoundingBox([bb[0] + dX * lr, 1.15, bb[2] - dX * (1 - lr), -0.15], false);
   brd_IO_slider.setBoundingBox([bb[0] + dX * lr, 0.15, bb[2] - dX * (1 - lr), -0.15], false);
//   brd_IO.update();
//   brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
   return this.applyZoom();   
}
brd_pp.zoomOut= function (x, y) {
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
   zeroInputs();
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
   var xx = bb[0] + (bb[2] - bb[0])/2;
   lr = (xx - bb[0]) / (bb[2] - bb[0]);
   tr = (bb[1] -xx) / (bb[1] - bb[3]);
   
   var xl = bb[0] + dX * lr;
   var xh = bb[2] - dX * (1 - lr);
//   brd_pp.setBoundingBox([xl, bb[2] - dX * lr, xh, bb[0] + dX * (1 - lr)], false);
//   brd_IO_slider.setBoundingBox([xl, 0.15, xh, -0.15], false);
   var boxSize = xh - xl;
   r.threshold_lower = xl + boxSize*0.35/1.3;
   r.threshold_higher = xl + boxSize*0.85/1.3;
   if(pp_highLow) hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
   else hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
   zeroInputs(xl, boxSize);
   
   this.setBoundingBox([bb[0] + dX * lr, bb[1] - dY * tr, bb[2] - dX * (1 - lr), bb[3] + dY * (1 - tr)], false);
   brd_IO.setBoundingBox([bb[0] + dX * lr, 1.15, bb[2] - dX * (1 - lr), -0.15], false);
   brd_IO_slider.setBoundingBox([bb[0] + dX * lr, 0.15, bb[2] - dX * (1 - lr), -0.15], false);
   
   this.zoomX /= zX;
   this.zoomY /= zY;

//   brd_IO.update();
//   brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
   return this.applyZoom();
}
brd_pp.moveOrigin= function (evt) {
	/**
	 * for pp we have to project new point onto diagonal and drag to that one
	 */
	/**
	 * for IO it is just the following
	 */
	this.drag_dy = 0;
}
    /**
     * Moves the origin and initializes an update of all elements.
     * @param {Number} x
     * @param {Number} y
     * @param {Boolean} [diff=false]
     * @returns {JXG.Board} Reference to this board.
     */
    moveOrigin: function (x, y, diff) {
        if (Type.exists(x) && Type.exists(y)) {
           this.origin.scrCoords[1] = x;//this is new x but we want to override this...
           this.origin.scrCoords[2] = y;
				 
            if (diff) {
                this.origin.scrCoords[1] -= this.drag_dx;
                this.origin.scrCoords[2] -= this.drag_dy;                          
            }
        }
        this.updateCoords().clearTraces().fullUpdate();

        this.triggerEventHandlers(['boundingbox']);

        return this;
    },

    
    
/**
 * set boundingBox to always keep diagonal y=x after panning 
 *  
 */
brd_pp.mouseOriginMove= function (evt) {
	/**
	 * ony pans on x movement
	 */
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
   var rr = (this.mode === this.BOARD_MODE_MOVE_ORIGIN),
       pos;				
   if (rr) {
       pos = this.getMousePosition(evt);
       this.moveOrigin(pos[0], pos[1], true);
       var bbb = this.getBoundingBox(); 
          
          var boxSize = bbb[2] - bbb[0];
          r.threshold_lower = bbb[0] + boxSize*0.35/1.3;
          r.threshold_higher = bbb[0] + boxSize*0.85/1.3;
          if(pp_highLow) hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
          else hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
          zeroInputs(bbb[0], boxSize);
          
       brd_IO.setBoundingBox([bbb[0], 1.15, bbb[2], -0.15], false);
       brd_IO_slider.setBoundingBox([bbb[0], 0.15, bbb[2], -0.15], false);
       this.setBoundingBox([bbb[0], bbb[2], bbb[2], bbb[0]], false);
       
//       this.setBoundingBox([bbb[3], bbb[1], bbb[1], bbb[3]], false);
//       brd_IO.setBoundingBox([bbb[3], 1.15, -0.15, bbb[3]], false);
//       brd_IO_slider.setBoundingBox([bbb[3], 0.15, -0.15, bbb[3]], false);
       
   }
//   brd_IO.update();
//   brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
   return rr;
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
var threshold_vertical_pp = brd_pp.create('line', 
		//because we are drawing the threshold all the way across plane we can define the line in a more simple way 
		[ [function(){return pp_highLow?r.threshold_higher:r.threshold_lower;},0],
		  [function(){return pp_highLow?r.threshold_higher:r.threshold_lower;}, 1]
		],
		{color:function(){if(pp_highLow) return 'red'; else return 'blue';}, dash:true, strokeWidth:1}//, straightLast:false}
);
var threshold_horizontal_pp = brd_pp.create('line',
		[ [0, function(){return pp_highLow?r.threshold_lower:r.threshold_higher;}],
		  [1, function(){return pp_highLow?r.threshold_lower:r.threshold_higher;}]
		],
		{color:function(){return pp_highLow?'blue':'red'}, dash:true, strokeWidth:1}//, straightLast:false}
);
hysteron_pp.on('drag', function(evt){
//hystPoly.on('drag', function(evt){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	bb = brd_pp.getBoundingBox();
	zeroInputs(bb[0], bb[2]-bb[0]);

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
    brd_IO.update();
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
});
threshold_vertical_pp.on('drag', function(evt){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	bb = brd_pp.getBoundingBox();
	zeroInputs(bb[0], bb[2]-bb[0]);
	
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
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
}
);
threshold_horizontal_pp.on('drag', function(evt){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	bb = brd_pp.getBoundingBox();
	zeroInputs(bb[0], bb[2]-bb[0]);
	
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
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
}
);
in_in.on('drag', function(){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	
// should be able to draw in_in up to threshold and then the rest...
	time_since_update = +new Date() - time_last_update;
	time_last_update = +new Date();
	time_current += time_since_update/1000;
	//pt2.setAttribute({size:20});belongs to IO	
	var out = r.update(this.X());
	//in_out.setPositionDirectly(JXG.COORDS_BY_USER, [this.X(), out]);
	in_out.moveTo([this.X(), out]);//could define in_out as a function cause it is not draggable, 
	inSlider.moveTo([this.X(), 0]);//can't be defined as a function cause it is draggable
	//wouldn't need to set position if defined as function, just board.update()s
	//in_time_turtle.moveTo([time_current, this.X()]);
	//in_time.setPositionDirectly(JXG.COORDS_BY_USER, [time_current, this.X()]);

    brd_IO.update();
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
});