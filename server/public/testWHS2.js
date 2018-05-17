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
	var photoURLs = JSON.parse(this.responseText);
	var display = document.getElementById("photoImg");
	for(let i=0;i<photoURLs.length;i++)
	{
		if (photoStatus ==200)//If status is OK
		{
			console.log(photoURLs[i].fileName);
			//display.src = photoURL;
		}
		else if (photoStatus==400)//If bad query
		{
			display.src="#";
			display.alt=photoURL;
		}
	}
}



