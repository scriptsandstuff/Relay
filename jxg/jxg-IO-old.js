
/**
 * math vars
 */
var input_bounds = [0, 1];
var inpput_interval = function(return input_bounds[1]-inputbounds[0]);
var input_min = 0;
var relay_thresholds = [0.25, 0.75];
var buffer_around_view = [-0.15, 1.15];

var r = new relay(relay_thresholds[0], relay_thresholds[1], 0);
var pp_highLow = true;//hysteron on right of diagonal
var time_current = 0.0;
var time_last_update = +new Date();//the '+' makes it a number I think

var brd_IO = JXG.JSXGraph.initBoard(
    'jxg-IO', {
			axis:true,    
			showNavigation:false, showCopyright:false,	 
			boundingbox:[-0.15, 1.15, 1.15, -0.15],
			zoom:{wheel:true, needshift:true, factorX:1.5, factorY:1}, 
//			pan:{enabled:true, needshift:true}, 
			showReload:true,
//			dependentBoards:['brd_pp', 'brd_IO_slider']
    }
);
/**
 * yConst is checked on drag and maybe also on zoom events
 * xvx also for drag events
 */
//brd_IO.attr = JXG.Merge(brd_IO.attr, {yConst:false, xvx:false});

//brd_IO_slider.origin.usrCoords = [1, x, 0];	
//brd_IO_slider.origin.setAttribute({usrCoords:[1, x, 0]});
//axis.setAttribute({origin:[x, 0]});

//brd_IO.attr = JXG.Merge(brd_IO.attr, {ymin:-0.15, ymax:1.15});
//brd_IO.attr = JXG.Merge(brd_IO.attr, {ymin:function(){return this.getBoundingBox()[0];}, ymax:1.15});
//board.attr.ymin = -4;
//var p00 = board.create('point', [function(){return board.attr.ymin;}, 0]);

brd_IO.ymin = function(b){	return -0.15;	}//don't need override here...it is cause of this 
brd_IO.ymax = function(b){ return 1.15; } 
//var p0 = board.create('point', [function(){return board.ymin()}, 0]);

function updateIO(x, bb){
	in_out.moveTo([ x, 0 ]);
	brd_IO.setBoundingBox([ bb[0], 1.15, bb[2], -0.15 ], false);
}
function updatsIOSlide(x, bb){
	inSlider.moveTo([ x, 0 ]);
//	brd_IO_slider.defaultAxes.x.point1.coords.usrCoords = [ 1, 0, 0 ];
//	brd_IO_slider.defaultAxes.x.point2.coords.usrCoords = [ 1, 1, 0 ];
//	brd_IO_slider.defaultAxes.y.point1.coords.usrCoords = [ 1, x, 0 ];
//	brd_IO_slider.defaultAxes.y.point2.coords.usrCoords = [ 1, x, 1 ];
	mvAxes(brd_IO_slider, [[x, 0], [x+1, 0]], [[x, 0], [x, 1]]);
	brd_IO_slider.setBoundingBox([ bb[0], 0.15, bb[2], -0.15 ], false);
//    this.zoomX *= this.attr.zoom.factorx;
}
function updatePP(x, bb){
	in_in.moveTo([ x, x ]);
	if (pp_highLow) hysteron_pp.moveTo([ r.threshold_higher, r.threshold_lower ]);
	else hysteron_pp.moveTo([ r.threshold_lower, r.threshold_higher ]);	
	mvAxes(brd_pp, [[x, x], [x+1, x]], [[x, x], [x, x+1]]);
	brd_pp.setBoundingBox([ bb[0], bb[2], bb[2], bb[0] ], false);	
}
//updateIOTime(){}
var brdBoxes:{IO:{y=[-0.15, 1.15]}, IOslide:{y=[-0.15, 0.15]}, pp:{y=[function(){return b0;}, funvtion(){return b1;}]}};

function mvAxes(b, ox, oy){
	b.defaultAxes.x.point1.coords.usrCoords = [ 1, ox[0][0], ox[0][1] ];
	b.defaultAxes.x.point2.coords.usrCoords = [ 1, ox[1][0], ox[1][1] ];
	b.defaultAxes.y.point1.coords.usrCoords = [ 1, oy[0][0], oy[0][1] ];
	b.defaultAxes.y.point2.coords.usrCoords = [ 1, oy[1][0], oy[1][1] ];	
}
function initRelay(p, x, size){//thisBoard){
	r.threshold_lower = p + size * 0.4 / 1.3;
	r.threshold_higher = p + size * 0.9 / 1.3;
	r.update(x);
}
function boardChanged(b0, b1){
	
}
function boardChanged(b0, b1){
// 	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	var boxSize = b1 - b0;
	var x = b0 + boxSize * 0.15 / 1.3;
	initRelay(b0, x, boxSize); 
	updateIO(x, [ b0, -0.15 , b1, 1.15 ]);
	updatsIOSlide(x, [b0, -0.15 , b1, 0.15]);
	updatePP(x, [b0, b0 , b1, b1]);		
//	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
}

function updateBoards(b0, b1){
		updateVars();
	var boxSize = b1 - b0;
	var x = b0 + boxSize * 0.15 / 1.3;
	initRelay(b0, x, boxSize); 	
		for(brd in brds) {
			brd.boardUpdate(x, b0, b1);
		}
	}
brd_IO.zoomIn = function (x, y) {
    if (this.zoomX > this.attr.zoom.max)  return this;
    var b0 = 7*b[0]/6.0 + b[2]/6.0;
    var b1 = 5*b[2]/4.0 - 3*b[0]/4.0;
    updateBoards(b0, b1);
	for(brd in brds) {
		brd.zoomX *= brd.attr.zoom.factorx;
	}
    return this.applyZoom();
}
brd_IO.zoomOut = function (x, y) {
    mi = this.attr.zoom.eps || this.attr.zoom.min || 0.001;  // this.attr.zoom.eps is deprecated
    if this.zoomX < mi return this; 	
    var b0 = 2*bb[0]/3 + bb[2]/3;
    var b1 = 2*bb[2]/3 + bb[0]/3;
    boardChanged(b0, b1);
    for(brd in brds) brd.zoomX /= brd.attr.zoom.factorx;
    return this.applyZoom();
}
/*
brd_IO.mouseWheelListener = function(evt) {
	if (!this.attr.zoom.wheel || (this.attr.zoom.needshift && !evt.shiftKey)) {
		return true;
	}
	evt = evt || window.event;
	var wd = evt.detail ? -evt.detail : evt.wheelDelta / 40, 
			pos = new Coords(Const.COORDS_BY_SCREEN, this.getMousePosition(evt), this);
	
	var xx = boardChangeStart(this);
	if (wd > 0) this.zoomIn(xx, xx);// this.zoomIn(0, 0);
	else this.zoomOut(xx, xx);// this.zoomIn(pos.usrCoords[1], pos.usrCoords[2]);
	if(wd != 0) boardChangeEnd(this);//this, [brd_IO_slider, brd_pp]);
	evt.preventDefault();
	return false;
}
brd_IO.mouseOriginMove= function (evt) {
//	boardChangeStart(this);
//	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
   var rr = (this.mode === this.BOARD_MODE_MOVE_ORIGIN),
       pos;				
   if (rr) {
       pos = this.getMousePosition(evt);
       this.moveOrigin(pos[0], pos[1], true);
       var bb = this.getBoundingBox();
       boardChanged(bb[0], bb[2]);
       //problem with update,,,...
   }
   return rr;
}
 /*
	 * //b.on('zoomIn', function(x, y){ brd_IO.zoomIn = function(x, y){
	 * qualityDown([brd_IO, brd_IO_slider, brd_pp]); zeroInputs(); var bb =
	 * this.getBoundingBox(), zX = this.attr.zoom.factorx, zY =
	 * this.attr.zoom.factory, dX = (bb[2] - bb[0]) * (1.0 - 1.0 / zX), dY =
	 * (bb[1] - bb[3]) * (1.0 - 1.0 / zY), lr = 0.5, tr = 0.5;
	 * 
	 * if (this.zoomX > this.attr.zoom.max || this.zoomY > this.attr.zoom.max) {
	 * return this; } var xx = bb[0] + (bb[2] - bb[0])/2; lr = (xx - bb[0]) /
	 * (bb[2] - bb[0]); tr = (bb[1] -xx) / (bb[1] - bb[3]);
	 * 
	 * this.zoomX *= zX; this.zoomY *= zY; // this.applyZoom(); //
	 * brd_pp.update(); // return this; brd_pp.update(); brd_IO_slider.update();
	 * qualityUp([brd_IO, brd_IO_slider, brd_pp]); return this.applyZoom(); }
	 * brd_IO.zoomOut = function (x, y) { qualityDown([brd_IO, brd_IO_slider,
	 * brd_pp]); zeroInputs(); var bb = this.getBoundingBox(), zX =
	 * this.attr.zoom.factorx, zY = this.attr.zoom.factory, dX = (bb[2] - bb[0]) *
	 * (1.0 - zX), dY = (bb[1] - bb[3]) * (1.0 - zY), lr = 0.5, tr = 0.5, mi =
	 * this.attr.zoom.eps || this.attr.zoom.min || 0.001; // this.attr.zoom.eps
	 * is deprecated
	 * 
	 * if (this.zoomX < mi || this.zoomY < mi) { return this; } var xx = bb[0] +
	 * (bb[2] - bb[0])/2; lr = (xx - bb[0]) / (bb[2] - bb[0]); tr = (bb[1] -xx) /
	 * (bb[1] - bb[3]);
	 * 
	 * var xl = bb[0] + dX * lr; var xh = bb[2] - dX * (1 - lr); var boxSize =
	 * xh - xl; r.threshold_lower = xl + boxSize*0.35/1.3; r.threshold_higher =
	 * xl + boxSize*0.85/1.3; if(pp_highLow)
	 * hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]); else
	 * hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
	 * zeroInputs(xl, boxSize);
	 * 
	 * this.setBoundingBox([xl, 1.15, xh, -0.15]);
	 * brd_IO_slider.setBoundingBox([xl, 0.15, xh, -0.15], false);
	 * brd_pp.setBoundingBox([xl, xh, xh, xl], false); //
	 * jxgOriginal.setBoundingBox([] // bb[0] + dX * lr, // bb[1] - dY * tr, //
	 * bb[2] - dX * (1 - lr), // bb[3] + dY * (1 - tr) // ], false);
	 * 
	 * this.zoomX /= zX; this.zoomY /= zY;
	 * 
	 * brd_pp.update(); brd_IO_slider.update(); qualityUp([brd_IO,
	 * brd_IO_slider, brd_pp]); return this.applyZoom(); }
 */

var in_out = brd_IO.create(	'point', [0.0, 0.0 ],
{	name:'', face:'o', size:4, /*fillOpacity:0,*/ color:'black', fixed:true
//	trace: true,	traceAttributes:{size: 3, strokeWidth: 0, fillOpacity: 0.1	}//strokeOpacity:'0.06'
});
/**
 * make thresholds 
 */
var threshold_higher_io = brd_IO.create('line', 
		[[function(){return r.threshold_higher;}, 0], [function(){return r.threshold_higher;}, 1]],
		{color:'red', dash:true, strokeWidth:1, straightfirst:false, straightLast:false, lastArrow:true}
);
var threshold_lower_io = brd_IO.create('line', 
		[[function(){return r.threshold_lower;}, 1], [function(){return r.threshold_lower;}, 0]],
		{color:'blue', dash:true, strokeWidth:1, straightFirst:false, straightLast:false, lastArrow:true}
);
var io_branch0 = brd_IO.create('line',
		[[function(){return r.threshold_higher - 1;}, 0],[function(){return r.threshold_higher;}, 0]],
		{color:'black',strokeWidth:3, straightLast:false}
);
var io_branch1 = brd_IO.create('line',
		[[function(){return r.threshold_lower;}, 1],[function(){return r.threshold_lower + 1;}, 1]],
		{color:'black',strokeWidth:3, straightFirst:false}
);
threshold_lower_io.on('drag', function(evt){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	bb = brd_IO.getBoundingBox();
	zeroInputs(bb[0], bb[2]-bb[0]);
    var crds = new JXG.Coords(JXG.COORDS_BY_SCREEN, brd_IO.getMousePosition(evt), brd_IO);
    var x = crds.usrCoords[1];//	var x = this.point1.X();
	r.threshold_lower = x;
	if(x > r.threshold_higher - 0.1) r.threshold_higher = x + 0.1;
	
	if(pp_highLow){
		hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
	}else{
		hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);		
	}	
//	brd_pp.update();
    brd_pp.update();
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
});
threshold_higher_io.on('drag', function(evt){
	qualityDown([brd_IO, brd_IO_slider, brd_pp]);
	bb = brd_IO.getBoundingBox();
	zeroInputs(bb[0], bb[2]-bb[0]);
    var crds = new JXG.Coords(JXG.COORDS_BY_SCREEN, brd_IO.getMousePosition(evt), brd_IO);
    var x = crds.usrCoords[1];
    r.threshold_higher = x;
	if(x - r.threshold_lower < 0.1)	r.threshold_lower = x - 0.1;
	if(pp_highLow) hysteron_pp.moveTo([r.threshold_higher, r.threshold_lower]);
	else hysteron_pp.moveTo([r.threshold_lower, r.threshold_higher]);
//	brd_pp.update();
    brd_pp.update();
    brd_IO_slider.update();
	qualityUp([brd_IO, brd_IO_slider, brd_pp]);
});
function qualityDown(brds){	for(brd in brds) brd.zoomX *= brd.attr.zoom.factorx; }
function qualityDown(brds){	for(brd in brds) brd.updateQuality = brd.BOARD_QUALITY_LOW; }
function qualityUp(brds){	for(brd in brds) brd.updateQuality = brd.BOARD_QUALITY_HIGH; }