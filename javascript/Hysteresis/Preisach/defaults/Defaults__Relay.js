var inputInterval = [0, 1],	
	inputPrecision = 0,
	branch1 = "0",
	branch2 = "1",
	inputIntervalSize = function(){
		return inputInterval[1] - inputInterval[0];
	},
	r = function(){
		var i = inputIntervalSize/3.0;
		return new relay(inputInterval[0]+i, inputInterval[0]+2*i, false);
	},
	branches = [],
	drawBranches = false;