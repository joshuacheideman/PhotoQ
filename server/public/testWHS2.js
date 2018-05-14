// Global; will be replaced by a call to the server! 
var photoURLArray=
[
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/A%20Torre%20Manuelina.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Uluru%20sunset1141.jpg" },
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Sejong tomb 1.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Serra%20da%20Capivara%20-%20Painting%207.JPG"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Royal%20Palace%2c%20Rabat.jpg"},
 { url: "http://lotus.idav.ucdavis.edu/public/ecs162/UNESCO/Red%20pencil%20urchin%20-%20Papahnaumokukea.jpg"}
 ];

// Called when the user pushes the "submit" button 
function photoByNumber() {

	var nums = document.getElementById("num").value;
	nums = nums.trim();
	var num = nums.replace(/,/g,"+");
	var numsplit = nums.split(",");
	var goodRequest = true;
	for(let i=0;i<numsplit.length;i++)
	{
		if(numsplit[i] ==NaN)
			goodRequest=false;
	}
	if (goodRequest) {
		var photoReq = new XMLHttpRequest();
		url = "/query?numList="+num;
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
	var photoURLs = this.responseText;
	var photoURL = photoURLs.split("\n");
	var display = document.getElementById("photoImg");
	for(let i=0;i<photoURL.length;i++)
	{
		if (photoStatus ==200)//If status is OK
		{
			console.log(photoURL[i]);
			//display.src = photoURL;
		}
		else if (photoStatus==400)//If bad query
		{
			display.src="#";
			display.alt=photoURL;
		}
	}
}



