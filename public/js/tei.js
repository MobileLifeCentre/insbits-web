$(document).ready(function() {
	var teiInput = $("#teiID"),
		prevText = "",
		teiInputIcon = $("#teiIcon"),
		ID_LENGTH = "00:11:22:33".length,
		OK_ICON = "fa-check",
		WRITE_ICON = "fa-edit",
		teiInputButton = $("#teiButton"),
		OK_BUTTON = "btn-success",
		WRITE_BUTTON = "btn-default";

	teiInput.filter_input({
	  regex:'[0-9A-Fa-f:]', 
	  feedback: function(char) {
	  	
	  }
	});

	teiInput.on("input", onTextChange);

	teiInputButton.on("click", onClickMAC);

	function onClickMAC() {
		if ($(teiButton).hasClass(OK_BUTTON)) {
			window.location.href = "?mac=" + $("#teiMAC").text().toLowerCase();
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

	// Spacebrew things
	var sb
	, app_name = "monitor";

	function setup () {
		app_name = app_name + $("#teiMAC").text().toLowerCase();

		// setup spacebrew!
		var server = window.location.origin.hostname;
		console.log(server);
		if (server == "http://localhost") server = "insbits.com";
		sb = new Spacebrew.Client(server);
		sb.name(app_name);

		// Override Spacebrew events - this is how you catch events coming from Spacebrew
		sb.onOpen = onOpen;
		sb.onRangeMessage = onRangeMessage;

		// create the spacebrew subscription channels
		sb.addSubscribe("digital0", "range");
		sb.addSubscribe("digital1", "range");
		sb.addSubscribe("digital2", "range");
		sb.addSubscribe("digital3", "range");

		// connect to spacebrew
		sb.connect();
	}

	setup();

	function onOpen() {
	}
	        
	function onRangeMessage(name, value) {
		var isTrue = (parseInt(value) != 0); 
		$("#" + name).toggleClass("btn-info", isTrue).toggleClass("btn-default", !isTrue).html(value);
  	}
});