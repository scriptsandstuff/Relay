 

//    this.support = support;
//    this.idxT = 0; //current (lower) index in thresholds list
//    var previousInput = 0.0;
//    var previousMax = 0.0;
//    var previousMin = 0.0;

//    var supSize = supportMax - supportMax;
//    var hysteronPrecision = supSize/weights.length;  
//    var numGraduations = Math.floor(supSize/hysteronPrecision);
    // var normalised: true;

    var thresholds = function(){// value of input thresholds [min, ..., max]    
		t = [];
		var tmp = min + hysteronPrecision;
		for(i = 0; i < numGraduations; i++){
		    t.append(tmp);
		    tmp += hysteronPrecision;
		}
		return t;
    }
//    this.weight = 1.0/((numGraduations*(numGraduations+1))/2.0);
    var weights = function(){
		w = [][];
		for(t : thresholds){
		    for(tt : thresholds){
		    	w[i][j] = 1.0/((numGraduations*(numGraduations+1))/2.0);
		    	j++
		    }
		    i++;
		}
		return w;
    }