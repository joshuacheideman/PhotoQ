// Called when the user pushes the "submit" button 
function photoByNumber() {

	var num = document.getElementById("num").value;
	num = num.trim();
	var photoNum = Number(num);
	if (photoNum != NaN) {
		var photoReq = new XMLHttpRequest();
		url = "/query?num="+num;
		photoReq.open("GET", url);
		// setup callback
		photoReq.addEventListener("load", DisplayPhoto);
		// load event occurs when response comes back
		photoReq.send();
	    }
}

function DisplayPhoto()
{
	var photoStatus = this.status;
	var photoURL = this.responseText;
	var display = document.getElementById("photoImg");
	if (photoStatus ==200)//If status is OK
		display.src = photoURL;
	else if (photoStatus==400)//If bad query
	{
		display.src="#";
		display.alt=photoURL;
	}
}



