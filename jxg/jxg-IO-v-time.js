/**
 * 
 */
var time_window = 5;
var bb = [-0.15, 1.15, time_window + 0.15, -0.15];		
var brd_IOt = JXG.JSXGraph.initBoard('jxg-IO-v-time',	{
		boundingbox:bb, axis:false, grid:false, 
		zoom:{wheel:true, needshift:true}, 
		pan:{enabled:true, needshift:true}, 
		showNavigation:true,	showCopyright:false  
	});
/**
 * have 2 gliders in screen coords---may be over kill or may be best
 * 2 points for in and out before turtle get to end
 * maybe 2 points at end of turtle bur prolly not
 */
/**
 * make permanent Y axis ticks for relay states
 */ 
var tick00 = screenPoint([50, brd_IOt.canvasHeight - 30]);
var tick01 =  screenPoint([30, brd_IOt.canvasHeight - 30]);
var tick0 = brd_IOt.create('line', [tick00, tick01], {
		withLabel:true, name:'0', Label:{color:'blue'},
		straightFirst:false, straightLast:false
	});
var tick10 = screenPoint([50, 30]);
var tick11 = screenPoint([30, 30]);
var tick1 = brd_IOt.create('line', [tick10, tick11], {
		withLabel:true, name:'1', Label:{color:'blue'}, 
		straightFirst:false, straightLast:false
	});
/**
 * make permanent axes 
 */
var x0 = screenPoint([0, brd_IOt.canvasHeight - 50]);
var x1 = screenPoint([brd_IOt.canvasWidth, brd_IOt.canvasHeight - 50]);
var oX = brd_IOt.create('axis', [x0, x1], {needsRegularUpdate: false, strokeColor: 'black'});

var y0 = screenPoint([50, brd_IOt.canvasHeight]);
var y1 = screenPoint([50, 0]);
var oY = brd_IOt.create('axis', [y0, y1], 
		{needsRegularUpdate: false, strokeColor: 'black', ticks:{label:{color:'black'}}});
		//why does the label color change on update??

var y00 = screenPoint([50, brd_IOt.canvasHeight]);
var y01 = screenPoint([50, 0]);
var thresh0 = brd_IOt.create('line', [y0, y1], 
		{needsRegularUpdate: false, strokeColor: 'red', ticks:{label:{color:'red'}}});

var y10 = screenPoint([50, brd_IOt.canvasHeight]);
var y11 = screenPoint([50, 0]);
var thresh1 = brd_IOt.create('line', [y0, y1], 
		{needsRegularUpdate: false, strokeColor: 'blue', ticks:{label:{color:'blue'}}});
		//why does the label color change on update??

function screenPoint(pos){
	pt = brd_IOt.create('point',	
			[ function () {return new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, brd_IOt).usrCoords; }	], 
			{needsRegularUpdate: false, visible: false});
	return pt;
}
var tstep = 0.05;
var out_time_trace = [];
/*
out_time.update = function (fromParent) {
    if (!this.needsUpdate) {
        return this;
    }

    this.updateCoords(fromParent);

    if (this.visProp.trace) {
        this.cloneToBackground(true);
    }

    return this;
}
cloneToTemp: function () {
    var copy = {};

    copy.id = this.id + 'T' + this.numTraces;
    this.numTraces += 1;

    copy.coords = this.coords;
    copy.visProp = Type.deepCopy(this.visProp, this.visProp.traceattributes, true);
    copy.visProp.layer = this.board.options.layer.trace;
    copy.elementClass = Const.OBJECT_CLASS_POINT;
    copy.board = this.board;
    Type.clearVisPropOld(copy);

    this.board.renderer.drawPoint(copy);
    this.traces[copy.id] = copy.rendNode;

    return this;
}
*/
/*
var timeStep = function(){	//if(time_current>10) return;
	time_since_update = +new Date() - time_last_update;
	//n = 'out_time' + time_last_update;
	var p = brd_IOt.create('point', [out_time.X(), out_time.Y()], {name:'out_time' + time_last_update});
	out_time_trace.push('out_time' + time_last_update);
	//prolly have to name the point and remove by name
	time_last_update = +new Date();
	time_current += time_since_update/1000;
	
	in_time_turtle.moveTo([time_current, in_in.X()]);
	out_time.moveTo([time_current, r.state]);//input not changed...no r.update required
		
	if(time_current > time_window ){
		var i = 0;
		while(true){
			tr = out_time_trace.shift().value;//pop for last shift for first
			//out_time_trace[i]...out_time_trace[i]
			if(tr.X() < time_current-(time_window+0.15))	tr.removeObject;
			else break;
			i++
		}
		brd_IOt = moveView(brd_IOt, time_current);
	}	
	var tr;
	for(tr in out_time_trace.value){	
		tr.cloneToBackground(true);	
		}
	//for(i = 0; i < out_time_trace.length; i++){		out_time_trace[i].cloneToBackground();	}
		
	setTimeout(timeStep, tstep*1000); // delay by 200 ms
}
*/

var timeStep = function(){	//if(time_current>10) return;
	time_since_update = +new Date() - time_last_update;
	time_last_update = +new Date();
	time_current += time_since_update/1000;
	
	in_time_turtle.moveTo([time_current, in_in.X()]);
	out_time_turtle.moveTo([time_current, r.state]);//input not changed...no r.update required	
	//out_time.moveTo([time_current, r.state]);//input not changed...no r.update required
		
	if(time_current > time_window ){
		var i = 0;
		while(true){
			tr = out_time_trace.shift().value;//pop for last shift for first
			//out_time_trace[i]...out_time_trace[i]
			if(tr.X() < time_current-(time_window+0.15))	tr.removeObject;
			else break;
			i++
		}
		brd_IOt = moveView(brd_IOt, time_current);
	}	
	var tr;
	for(tr in out_time_trace.value){	
		tr.cloneToBackground(true);	
		}
	//for(i = 0; i < out_time_trace.length; i++){		out_time_trace[i].cloneToBackground();	}
		
	setTimeout(timeStep, tstep*1000); // delay by 200 ms
}
var moveView = function(b, t){
	//b.suspendUpdate();
	//out_time.visProp.frozen=true;
	//time_out trace disappears on move because of 
    //this.clearTraces(); in the function jsxgraph.moveOrigin, can override this method or...
	//going to try and dump traces to a var and re paint them...careful of the memory...
	//...allow default clearTraces, use some of element.cloneToBackground somehow to clone the right traces! 
	//tr = out_time.traces;
	b.setBoundingBox([t-time_window +0.15, 1.15, t+0.15, -0.15], false);
	return b;
}


/*
 * 
 * point.cloneToBackground: function () {
            var copy = {};

            copy.id = this.id + 'T' + this.numTraces;
            this.numTraces += 1;

            copy.coords = this.coords;
            copy.visProp = Type.deepCopy(this.visProp, this.visProp.traceattributes, true);
            copy.visProp.layer = this.board.options.layer.trace;
            copy.elementClass = Const.OBJECT_CLASS_POINT;
            copy.board = this.board;
            Type.clearVisPropOld(copy);

            this.board.renderer.drawPoint(copy);
            this.traces[copy.id] = copy.rendNode;

            return this;
        }
        
 * board.clearTraces: function () {
            var el;

            for (el = 0; el < this.objectsList.length; el++) {
                this.objectsList[el].clearTrace();
            }

            this.numTraces = 0;
            return this;
        },
        
 brd_IOt.clearTraces = function(){
	//doing nothing means those traces are permanent
	 var el;

     for (el = 0; el < this.objectsList.length; el++) {
    	 if(x < board_min){}
         this.objectsList[el].clearTrace();
     }

     this.numTraces = 0;
     return this;
}
*/
var in_time_turtle = brd_IOt.create('turtle');
in_time_turtle.hideTurtle();
var out_time =  brd_IOt.create('point',[0.0, 0.0],  
{
	face:'o', size:6, color:'blue',
	trace: false,
	traceAttributes:{strokeWidth:'0', fillOpacity:0.1}//strokeOpacity:'0.06'
});

timeStep();