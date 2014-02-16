$(document).ready(function() {
	var teiInput = $("#teiID"),
		prevText = "",
		teiInputIcon = $("#teiIcon"),
		ID_LENGTH = "00:11:22:33".length,
		OK_ICON = "fa-check",
		WRITE_ICON = "fa-edit",
		teiInputButton = $("#teiButton"),
		OK_BUTTON = "btn-success",
		WRITE_BUTTON = "btn-default",
		graphs = [];

	teiInput.filter_input({
	  regex:'[0-9A-Fa-f:]', 
	  feedback: function(char) {
	  	
	  }
	});

	teiInput.on("input", onTextChange);

	teiInputButton.on("click", onClickMAC);
	$("#teiID").on("keypress", onPressKeyMAC);

	function onClickMAC() {
		if ($(teiButton).hasClass(OK_BUTTON)) {
			window.location.href = "?mac=" + $("#teiID").val().toLowerCase();
		}
	}

	function onPressKeyMAC(e) {
		if (e.keyCode == 13) { // Enter
			onClickMAC();
			return false;
		}
	}

	function onTextChange(text) {
		var id = text.target.value;

		if (prevText.length < id.length) {
			// Adding characters
			if (id.length >= ID_LENGTH) {
				text.target.value = id.substr(0, ID_LENGTH);

			} else if (id.length % 3 == 2) {
				text.target.value = id + ":";
			}
		} else {
			// Removing characters
			if (id.length % 3 == 2) {
				text.target.value = id.substr(0, id.length - 1);
			}
		}
		prevText = text.target.value;
		teiIcon.className = "fa " + (prevText.length == ID_LENGTH ? OK_ICON : WRITE_ICON);
		teiButton.className = "btn " + (prevText.length == ID_LENGTH ? OK_BUTTON : WRITE_BUTTON);
	}


	function setupGraphs() {
		graphs["analog0"] = new Graph("analog0Graph");
		graphs["analog1"] = new Graph("analog1Graph");
	}

	// Spacebrew things
	var sb
	, app_name = "monito";

	function setupSpacebrew () {
		app_name = app_name + $("#teiMAC").text().toLowerCase();

		// setup spacebrew!
		var server = window.location.hostname;
		console.log(server);
		//if (server == "localhost") server = "insbits.com";
		sb = new Spacebrew.Client(server);
		sb.name(app_name);

		// Override Spacebrew events - this is how you catch events coming from Spacebrew
		sb.onOpen = onOpen;
		sb.onRangeMessage = onRangeMessage;
		sb.onStringMessage = onStringMessage;

		// create the spacebrew subscription channels
		sb.addSubscribe("analog0", "range");
		sb.addSubscribe("analog1", "range");
		sb.addSubscribe("digital0", "range");
		sb.addSubscribe("digital1", "range");
		sb.addSubscribe("digital2", "range");
		sb.addSubscribe("digital3", "range");
		sb.addSubscribe("json", "string");

		// connect to spacebrew
		sb.connect();
	}

	if ($("#teiMAC").text().length > 0) {
		setupGraphs();
		setupSpacebrew();
	}

	$('.slider').slider();

	function onOpen() {
	}

	function processDigital(name, value) {
		var isTrue = (parseInt(value) != 0); 
		$("#" + name).toggleClass("btn-info", isTrue).toggleClass("btn-default", !isTrue).html(value);
	}  

	function processAnalog(name, value) {
		graphs[name].addValue(parseInt(value));
		$("#"+ name + "Slider").slider("setValue", value);
		$("#" + name + "Label").html(value);
	}  

	function onRangeMessage(name, value) {
		if (name.indexOf("analog") != -1) {
			processAnalog(name, value);
		} else {
  			processDigital(name, value);
  		}
  	}

  	function onStringMessage(name, value) {
  		if (name == "json") {
  			var json = JSON.parse(value);
  			for(var i in json) {
  				onRangeMessage(i, parseInt(json[i]));
  			}
  		}
  	}
});


var Graph = function(canvasId) {
  // create the three different time series that graph the range inputs from spacebrew
  var line = new TimeSeries();

  // create the chart wher the time series will be graphed
  var smoothie = new SmoothieChart({  grid: { strokeStyle: 'rgb(255, 125, 125)', 
                                              fillStyle: 'rgb(220, 220, 220)', 
                                              lineWidth: 1, 
                                              millisPerLine: 250, 
                                              verticalSections: 6 
                                            } 
                                      });

  // add the time series to the graph
  smoothie.addTimeSeries(line, { strokeStyle: 'rgb(221, 25, 150)', fillStyle: 'rgba(211, 25, 150, 0.4)', lineWidth: 3 });
  
  // add the graph to the canvas
  smoothie.streamTo(document.getElementById(canvasId), 1000);

  function add(value) {
  	line.append(new Date().getTime(), value);  // append new data point to line
  }

  return {
  	addValue: add
  }
};