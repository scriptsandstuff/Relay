/**
  * Declare variables required to initialise the Preisach_Discrete object
  *
  */
var inPrecision = 0;
var supportMin = 0; 	
var supportMax = 1;
var hysteronPrecision = 0.5;
var branch0 = "0";
var branch1 = "1";
//think about making the JXG functions rather than the strings here
//that will, however, exclude portability

/* 
 * override the Preisach_Discrete.createHysterons() method
 */
Preisach_Discrete.createHysterons = function(){
    var hs = new Preisach_Discrete_Element_JXG[numGraduations][numGraduations];
    return hs;
}

var dp = new Preisach_Discrete(supportMin, supportMax, hysteronPrecision);
//var hysterons = 

// var r = new Preisach_Relay(0.5, 0.5, true);
// var dp = new Preisach_Discrete(supportMin, supportMax);
// var dpe = new Preisach_Discrete_Element();