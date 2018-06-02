/* This array is just for testing purposes.  You will need to 
   get the real image data using an AJAX query. */

var photos = [];	
	
	// A react component for a tag
	class Tag extends React.Component {
	
		render () {
		return React.createElement('p',  // type
			{ className: 'tagText'}, // properties
		   this.props.text);  // contents
		}
	};
	
	
	// A react component for controls on an image tile
	class TileControl extends React.Component {
	
		render () {
		// remember input vars in closure
			var _selected = this.props.selected;
			var _src = this.props.src;
			var _tags = this.props.tags;
			var _landmark=this.props.landmarks;
			// parse image src for photo name
			var tagList = _tags.split(",");
		var photoName = _src.split("/").pop();
		photoName = photoName.split('%20').join(' ');
	
		var args=[];
		args.push('div');//Create element div
		args.push({className:_selected ? 'selectedControls' : 'normalControls'});
		
		for(let i=0;i<tagList.length;i++)
		{
			args.push(React.createElement(Tag,{text: tagList[i],key:tagList[i]+i}));
		}
		return( React.createElement.apply(null,args));// return
		} // render
	};
	
	
	// A react component for an image tile
	class ImageTile extends React.Component {
	
		render() {
		// onClick function needs to remember these as a closure
		var _onClick = this.props.onClick;
		var _index = this.props.index;
		var _photo = this.props.photo;
		var _selected = _photo.selected; // this one is just for readability
	
		return (
			React.createElement('div', 
				{style: {margin: this.props.margin, width: _photo.width},
				 className: 'tile',
							 onClick: function onClick(e) {
					console.log("tile onclick");
					// call Gallery's onclick
					return _onClick (e, 
							 { index: _index, photo: _photo }) 
					}
			 }, // end of props of div
			 // contents of div - the Controls and an Image
			React.createElement(TileControl,
				{selected: _selected, 
				 src: _photo.src,
				 tags:_photo.tags,
				 landmarks:_photo.landmarks
				}),
			React.createElement('img',
				{className: _selected ? 'selected' : 'normal', 
						 src: _photo.src, 
				 width: _photo.width, 
						 height: _photo.height
					})
					)//createElement div
		); // return
		} // render
	} // class
	
	
	// The react component for the whole image gallery
	// Most of the code for this is in the included library
	class App extends React.Component {
	
	  constructor(props) {
		super(props);
		this.state = { photos: photos };
		this.selectTile = this.selectTile.bind(this);
	  }
	
	  selectTile(event, obj) {
		
		console.log("in onclick!", obj);
		let photos= this.state.photos;
		photos[obj.index].selected = !photos[obj.index].selected;
		this.setState({ photos: photos });
	  }
	
	  render() {
		if(document.documentElement.clientWidth>=700){
			return (
		   		React.createElement( Gallery, {photos: this.state.photos.slice(0,12),
		   		onClick: this.selectTile, 
		   		ImageComponent: ImageTile
				,columns:2} )
			  );
			}
	  	
		else
		{
			return (
			React.createElement( Gallery, {photos: this.state.photos.slice(0,12),
			onClick: this.selectTile, 
			ImageComponent: ImageTile
			 ,columns:1} )
		   );
		}	  
	  }
	
	}
	
	/* Finally, we actually run some code */
	
	const reactContainer = document.getElementById("react");
	var reactApp = ReactDOM.render(React.createElement(App),reactContainer);
	var noitems = document.getElementById("noitems");
	var reactcontainer= document.getElementById("react-container");	
	/* Workaround for bug in gallery where it isn't properly arranged at init */
	window.dispatchEvent(new Event('resize'));
	function updateImages()
	{
	  var keys = document.getElementById("key").value;
	
	  if (!keys){
		return; // No query? Do nothing!
	  }
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", "/query?keyList=" + encodeURIComponent(keys.replace(/,/g, "+"))); // We want more input sanitization than this!
	  xhr.addEventListener("load", (evt) => {
		if (xhr.status == 200) {
			noitems.style.display="none";
			reactcontainer.style.alignItems="flex-start";
			reactcontainer.style.display="block";
			reactApp.setState({photos:JSON.parse(xhr.responseText)});
			window.dispatchEvent(new Event('resize')); /* The world is held together with duct tape */
		} else {
			document.getElementById("key").value="You got a "+ xhr.responseText+". Try another input";
		}
	  } );
	  xhr.send();
	}
	
	const keyNode = document.getElementById("key");
	keyNode.addEventListener("keydown", function(event) {
			if (event.key === "Enter") {
					event.preventDefault();
					// Do more work
					updateImages();
			}
	});
	var isMobile=false;
	function resize()
	{
		if(document.documentElement.clientWidth>=700&&isMobile)
		{
			isMobile=false;
			updateImages();
		}
		else if(!isMobile&&document.documentElement.clientWidth<700)
		{
			isMobile=true;
			updateImages();
		}
	}
