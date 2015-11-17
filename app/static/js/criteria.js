function populate_criteria(){
	$.ajax({
		contentType: 'application/json; charset=utf-8',
		url:'/data/get_scale_fields',
		dataType: 'json',
		success: function (results) {
		  var radio_home = document.getElementById("radio_home");
		  for(var i=0; i< results.length; i++){
		  	var button = makeRadioButton("scale", results[i]["field_name"]+"#"+results[i]["field_type"], results[i]["field_name"]);
		  	radio_home.appendChild(button);  	
		  }
		}
	});
}


function makeRadioButton(name, value, text) {
	var div = document.createElement("div");
	div.style.width = "300px"; 
	div.style.height = "100px"; 
	div.style.background = "Blue"; 
	div.style.color = "white"; 
	div.style.border = "thick solid #FFFFFF";

	var radio = document.createElement("input");
	radio.type = "radio";
	radio.name = name;
	radio.value = value;
	radio.onclick = function() {
        setScale(this.value)
    };
	div.appendChild(radio);

	div.appendChild(document.createTextNode(text));
	return div;
}

function setScale(val){
	data_rec = val.split("#");
	$.ajax({
		contentType: 'application/json; charset=utf-8',
		url:'/data/setscale',
		dataType: 'text',
		data: "scale="+data_rec[0]+"&scaletype="+data_rec[1],
		success: function (results) {
			console.log(results);
		}
	});
}