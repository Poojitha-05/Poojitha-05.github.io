
var first = 0;
var second = 0;
var third = 0;

var firstCat = "HI";
var secondCat = "HOLA";
var thirdCat = "BONJ";

var totalStateEm = 0;

// var vehicleEm = 0; var natGasEm = 0; var elecEm = 0; var fuelOilEm = 0; var propaneEm = 0; var wasteEm = 0;
// var totalEm = [0, 0, 0, 0, 0, 0];

function vehicle (un, mi, normalFE) {
  var emissions = 0;
  const GHGPerGal = 19.6*1.01;
  if (un == 'weeks' && normalFE != 0) {
    emissions = ((mi*52)/normalFE)*GHGPerGal;
  } else if (un == 'years' && normalFE != 0){
    emissions = (mi/normalFE)*GHGPerGal;
  } else {
  	emissions = 0;
  }
  return emissions;
}

function natGas (un, monthlyAmt) {
  const GHGPerCubicFt = 119.58/1000;
  const GHGPerTherm = 11.7;
  const cubicFtPrice = 10.68/1000;
  // const thermPrice = 1.04;
  var emissions = 0;

  if (un == 'cubic ft') {
    emissions = monthlyAmt*GHGPerCubicFt*12;
  } else if (un == 'therms') {
    emissions = (monthlyAmt/GHGPerTherm)*12;
  } else if (un == 'dollars') {
    emissions = (monthlyAmt/cubicFtPrice)*GHGPerCubicFt*12;
  }
  return emissions;
}

function electricity (state, un, monthlyAmt, greenPower) {
  // window.alert(state + " " + un + " " + monthlyAmt + " " greenPower);
  var emissions = 0;

  // make a EGRID_DATA arr & get the const from start
  // Changing for testing
  // const EGRID_DATA = 1238.516/1000;
  const EGRID_DATA = eGrid(state);
  // window.alert("EGRID_DATA: " + EGRID_DATA);
  const pricePerKwH = 0.119;
  if (un == 'kwH'){
    emissions = monthlyAmt*EGRID_DATA*12;
  } else {
    emissions = (monthlyAmt/pricePerKwH)*EGRID_DATA*12;
  }

  if (greenPower > 0) {
    emissions *= (1-(greenPower/100));
  }
  // window.alert("EGRIDDATA: " + EGRID_DATA);
  return emissions; 
}



function eGrid(state) {
  // window.alert("Hello moussee");
    // States
    var states = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
    // Factors list in lbs CO2e / MwH
    // window.alert("HI");
    var factors = [912.0, 868.3, 1219.1, 972.2, 422.0, 1371.4, 509.5, 440.1, 900.4, 947.7, 931.9, 1524.8, 1077.4, 160.7, 818.5, 1748.5, 996.6, 1835.7, 839.4, 733.8, 841.2, 268.2, 1115.8, 1003.1, 1712.9, 919.5, 1165.9, 804.1, 1516.9, 1417.5, 305.8, 502.1, 1340.4, 746.6, 418.7, 1329.8, 893.4, 314.2, 788.8, 868.8, 634.6, 520.0, 748.4, 983.7, 1609.4, 742.8, 57.5, 200.0,  1396.3, 1961.5, 2063.8]
    
    // var len1 = states.length;
    // var len2 = factors.length;
    // window.alert(states.length + " " + factors.length)
    function getState(param) {
      return param == state;
    }
    
    var index = states.findIndex(getState);
    var factor = factors[index];
    return factor/1000;
}

  function fuelOil (un, monthlyAmt) {
  const fuelOilFactor = 22.61; // lbs
  const pricePerGallon = 4.02;
  var emissions = 0;
  if (un == 'gallons') {
    // gallons: (avg monthly fuel oil) fuel oil emission factor * months in year
    emissions = monthlyAmt*fuelOilFactor*12;


  } else {
    // dollars: (avg monthly fuel oil bill / price per gallon) fuel oil emission factor * months in year
    emissions = (monthlyAmt/pricePerGallon)*fuelOilFactor*12;
  }
  return emissions;
}

function propane (un, monthlyAmt) {
  const propaneFactor = 12.43; // lbs
  const pricePerGallon = 2.47;
  var emissions = 0;
  if (un == "dollars") {
    // dollars: (avg monthly propane bill / price per gallon) propane emission factor * months in year
    emissions = (monthlyAmt/pricePerGallon)*propaneFactor*12;
  } else {
    // gallons: (avg monthly propane gallons) propane emission factor * months in year
    emissions = monthlyAmt*propaneFactor*12;
  }  
  return emissions;
}

function waste (numPeople, metal, plastic, glass, paper) {
  var emissions = 692*numPeople; // lbs waste emission per person
  /*
  Final: Total waste before + reduction from newspaper + reduction from glass + reduction from plastic + reduction from metal 
  */
  if (metal) {
    // Metal: # people in household * avg # -89.38 lbs CO2e/year/person
    emissions += (numPeople*-89.38);
  }
  if (plastic) {
    // Plastic: # people in household * -35.56 lbs CO2e/year/person
    emissions += (numPeople*-35.56);
  }
  if (glass) {
    // Glass: # people in household * -25.39 lbs CO2e/year/person
    emissions += (numPeople*-25.39);
  }
  if (paper) {
    // Newspaper: # people in household * -113.14 lbs CO2e/year/person
    // Magazine: # people in household * -27.46 lbs CO2e/year/person
    emissions +=  (numPeople*(-113.14 - 27.46));
  }
  return emissions;
}


function addVehicles () {
  window.alert("inside addvehicles")
  document.getElementById("enter").disabled = true;
  var display = document.getElementById("dynamicInput");
  var parent = document.createElement("div");
  parent.className = "container gy-2 gx-5";

  // get total numVehicles
  var num = document.getElementById("inputNumVehicles").value;

  for (var i = 0; i < num; i++) {
    var label = document.createElement("span");
    label.className = "badge bg-secondary";
    label.innerHTML = "Vehicle " + (i+1);

    // Fuel econ
    var input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.step = 0.01;
    input.className = "form-control"; // set the CSS class
    input.name = "fuelEcon";
    var hi = "fuelEcon" + i;
    input.id = hi;
    input.placeholder = "Your vehicle's fuel economy in mpg (Use search bar if needed.)"
    input.required = true;

    // Fuel econ validation
    var invalid = document.createElement("div");
    invalid.className = "invalid-feedback";
    invalid.innerHTML = "Please input a positive integer or 0.";

    // Mileage
    var input2 = document.createElement("input");
    input2.type = "number";
    input2.min = 0;
    input2.step = 0.01;
    input2.className = "form-control"; // set the CSS class
    input2.name = "miles"
    input2.id = ("mileage" + i);
    input2.placeholder = "Number of miles (219 mi/week or 11398 mi/year is the nat. avg.)";
    input2.required = true;

    // Mileage validation
    var invalid2 = document.createElement("div");
    invalid2.className = "invalid-feedback";
    invalid2.innerHTML = "Please input a positive integer or 0.";

    parent.appendChild(label);
    parent.appendChild(input);
    parent.appendChild(invalid);
    parent.appendChild(input2);
    parent.appendChild(invalid2);
  }

  document.getElementById("dynamicInput").appendChild(parent);
  // window.alert("parent: " + parent + " display: " + display); 
  
  
}



    // document.getElementById("overview").innerHTML = (first + " " + second + " " + third);
    // document.write(first + " " + second + " " + third);
    function calculate() {
        window.alert("Hello world!")
        // Vehicles
        var vehicleUn = document.getElementById("vehicleUnits").value;
        
        var numVehicles = document.getElementById("inputNumVehicles").value;

		    var vehicleEm = 0;
        window.alert("vehicleUn: " + vehicleUn + " vehicleEm: " + vehicleEm)
        

        for (var i = 0; i < numVehicles; i++) {
        	// window.alert("inside")
            var fuelEconomy = document.getElementById(("fuelEcon" + i)).value;
            // window.alert("fuelEcon: " + fuelEconomy)
            var mileage = document.getElementById(("mileage" + i)).value;
            // Call the emissions function for each vehicle
            vehicleEm += vehicle(vehicleUn, mileage, fuelEconomy);
        }
        window.alert("vehicleEm!" + vehicleEm)
        window.alert("Hello world!")


        // Electricity
        
        var theState = document.getElementById("state").value;
        // window.alert("Hello world!");
        var elecUn = document.getElementById("elecUnits").value;
        // window.alert("Hello world!");
        var elecMonthlyAmt = document.getElementById("inputElec").value;
        // window.alert("var: " + elecMonthlyAmt);
        
        var greenPower = document.getElementById("inputGreenPow").value;
        if (greenPower == '') {
            greenPower = 0;
        }
        // window.alert("var: " + greenPower);
        // Call electricity
        // window.alert("state=" + theState + " elecUn=" + elecUn + " elecMonthlyAmt=" + elecMonthlyAmt + " greenPower=" + greenPower);
        var elecEm = electricity(theState, elecUn, elecMonthlyAmt, greenPower);
        var testEGRID = eGrid(theState);
        window.alert("EGRID_DATA" + testEGRID)
        window.alert("elecEm: " + elecEm)

       
       // Natural Gas
        var natGasUn = document.getElementById("natGasUnits").value;
        var natGasMonthlyAmt = document.getElementById("inputNatGas").value;
        // Call natGas
        var natGasEm = natGas(natGasUn, natGasMonthlyAmt);
        window.alert("natGasEm! " + natGasEm)

        
        // Fuel Oil
        var fuelOilUn = document.getElementById("fuelOilUnits").value;
        var fuelOilMonthlyAmt = document.getElementById("inputFuelOil").value;
        // Call fuelOil
        var fuelOilEm = fuelOil(fuelOilUn, fuelOilMonthlyAmt);
        window.alert("fuelOilEm:  " + fuelOilEm)

       
        // Propane
        var propaneUn = document.getElementById("propaneUnits").value;
        // window.alert("propaneUn: " + propaneUn)
        var propaneMonthlyAmt = document.getElementById("inputPropane").value;
        // window.alert("propaneMonthlyAmt: " + propaneMonthlyAmt)
        // Call propane
        var propaneEm = propane(propaneUn, propaneMonthlyAmt);
        window.alert("propaneEm: " + propaneEm)

        // Waste
        var numPeople = document.getElementById("people").value;
        var yesMetal = document.getElementById("metalWaste").checked;
        var yesPlastic = document.getElementById("plasticWaste").checked;
        var yesGlass = document.getElementById("glassWaste").checked;
        var yesPaper = document.getElementById("paperWaste").checked;
        // Call waste
        var wasteEm = waste(numPeople, yesMetal, yesPlastic, yesGlass, yesPaper);
        window.alert("wasteEm " + wasteEm)
        // window.alert(natGasUn + " " + natGasMonthlyAmt + " " + natGasEm);
        // window.alert("\n" + fuelOilUn + " " + fuelOilMonthlyAmt + " " + fuelOilEm);
        // window.alert("\n" + propaneUn + " " + propaneMonthlyAmt + " " + propaneEm);
        // window.alert("\n" + numPeople + " " + yesMetal + " " + yesPlastic + " " + yesGlass + " " + yesPaper + " " + wasteEm);
        // window.alert("vehicle em = " + vehicleEm + " numVehicles = " + numVehicles + " vehicleUn: " + vehicleUn);

        // Total Emissions 
        var totalEm = [vehicleEm, natGasEm, elecEm, fuelOilEm, propaneEm, wasteEm];
        window.alert("totalEm" + totalEm)

        totalEm.sort((a, b) => a - b); // ascending order so last 3 are the top 3
        
         // window.first = totalEm[5];
         // window.second = totalEm[4];
         // window.third = totalEm[3];
         first = totalEm[5];
         second = totalEm[4];
         third = totalEm[3];
         // check which category each is:
          firstCat = category(first, vehicleEm, natGasEm, elecEm, fuelOilEm, propaneEm, wasteEm);
          secondCat = category(second, vehicleEm, natGasEm, elecEm, fuelOilEm, propaneEm, wasteEm);
          thirdCat = category(third, vehicleEm, natGasEm, elecEm, fuelOilEm, propaneEm, wasteEm);

         document.getElementById("top1").value = [first];
         window.alert("Top1: " + document.getElementById("top1").value)

         document.getElementById("top2").value = [second];
         window.alert("Top2: " + document.getElementById("top2").value)

         document.getElementById("top3").value = [third];
         window.alert("Top3: " + document.getElementById("top3").value)

         document.getElementById("topCat1").value = [firstCat];
         window.alert(document.getElementById("topCat1").value)

         document.getElementById("topCat2").value = [secondCat];
         window.alert(document.getElementById("topCat2").value)

         document.getElementById("topCat3").value = [thirdCat];
         window.alert(document.getElementById("topCat3").value)
        
         var total = vehicleEm + natGasEm + elecEm + fuelOilEm + propaneEm + wasteEm;;
         document.getElementById("all").value = total.toFixed(2);
         window.alert("Total!! " + document.getElementById("all").value)

         /* Added var for state avg to display in display.html 
         instead of nat avg */
         totalStateEm = stateAvg(theState);
         document.getElementById("displayEm").value = [totalStateEm];
         window.alert("state's avg: " + document.getElementById("displayEm").value)

        //window.alert(window.first + " " + window.second + " " + window.third);
        //window.alert(first + " " + second + " " + third);
        

    }
  
  function getTopThree () {
    // var topThree = [window.first, window.second, window.third];
    window.alert(first + " - " + second + "- " + third);
    var topThree = [first, second, third];

 
    return topThree;
  }


  function category(arrEl, vehicleEm, natGasEm, elecEm, fuelOilEm, propaneEm, wasteEm) {
  	if (arrEl == vehicleEm) {
  		return "vehicle";
  	} else if (arrEl == natGasEm) {
  		return "natural gas";
  	} else if (arrEl == elecEm) {
  		return "electricity";
  	} else if (arrEl == fuelOilEm) {
  		return "fuel oil";
  	} else if (arrEl == propaneEm) {
  		return "propane";
  	} else {
  		return "waste"; 
  	}
  }

  /* This method is not finished */
  function stateAvg(theState) {
  	// get state from form in calculator.html
  	// var theState2 = document.getElementById("state").value;
  	// window.alert("state: " + theState2)

  	// make local arr of state acronyms
    var states2 = ["AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];
  	// window.alert("arrLen: " + states2.length)

  	// make local arr of state emissions in *million metric tons*
  	var ems = [34.1, 108.3, 63.9, 85.6, 358.6, 87.0, 33.4, 2.6, 12.3, 226.5, 131.9, 17.6, 76.3, 18.4, 201.1, 175.8, 57.9, 113.6, 226.4, 63.3, 51.6, 15.4, 151.8, 87.9, 122.4, 67.4, 30.3, 115.0, 47.7, 13.4, 101.0, 48.7, 46.2, 156.7, 204.3, 92.7, 38.3, 215.3, 10.0, 68.8, 14.5, 97.6,, 706.5, 58.2, 97.9, 5.8, 78.2, 97.6, 90.8, 60.6];
  	// window.alert("emsLen: " + ems.length)
  	// In metric tons 
  	var emsPerCapita = [46.3, 22.4, 21.4, 12.2, 9.2, 15.6, 9.4, 3.8, 12.9, 10.9, 12.7, 12.4, 24.4, 10.8, 15.8, 26.6, 20.0, 25.7, 48.8, 9.3, 8.6, 11.6, 15.3, 15.9, 20.2, 22.7, 28.9, 11.3, 74.9, 25.0, 10.0, 11.4, 23.4, 12.2, 8.1, 17.6, 23.7, 9.3, 16.9, 9.5, 13.8, 16.7, 14.6, 25.1, 18.9, 11.6, 9.3, 10.6, 17.0, 50.3, 105.4];

  	// window.alert("emsPerCapita!!!! " + emsPerCapita.length)
  	
  	// search through arr until state is found
  	function getState2(param2) {
      return param2 == theState;
    }
    
    var index2 = states2.findIndex(getState2);
    return emsPerCapita[index2];
  }

 





 

