/* This array is just for testing purposes.  You will need to 
   get the real image data using an AJAX query. */
   var suggested;
   var PopupVisible;
   var dropDown;
var photos = [];	
	// A react component for a tag
	class Tag extends React.Component {
	
		render () {
		var _onClick = this.props.onClick;
		var key = this.props.id;
		var xButton = this.props.xButton;
		return (xButton) ? React.createElement('p',  // type
			{ className: 'tagText'}, // properties
		   this.props.text,  // contents
		 React.createElement('button',{className:'xButton',onClick: function onClick(e){
		console.log("Tag onClick");
		e.stopPropagation(); //not all ancestors
		_onClick(e,key);
	}},"x")) : React.createElement('button',  // type
	{ className:"tagText",onClick: function onClick(e){
	console.log("Tag onClick");
	e.stopPropagation(); //not all ancestors
	_onClick(e,key);
	}},this.props.text);
}}
	class AddButton extends React.Component{
		render(){
		var _onClick = this.props.onClick;
		var key = this.props.id;
		return React.createElement('button',{className:"NWArrow",onClick: function onClick(e){
			e.stopPropagation();
			_onClick(e,key);
		}},"\u2196");
		}
	};
	class AddTag extends React.Component {
		render(){
		var _onClick = this.props.onClick
		var key = this.props.id;
		var _text = this.props.text;
		return React.createElement('p',//type
			{className: 'AddTag'},//properties
			React.createElement('input',{className:'addText',id:key+this.props.index,onClick: function(e){e.stopPropagation();}}),React.createElement('button',{className:'addButton',onClick:function onClick(e){
			console.log("AddTag onClick");
			e.stopPropagation();//not all ancestors
			_onClick(e,key,_text);			
}},"+"));//contents
		}
	};
	

	var SelectContainerTagList=[];
	class SelectContainer extends React.Component{
		constructor(props)
		{
			super(props);
			this.TagClick = this.TagClick.bind(this);
			this.state = {SelectContainerTagList}; 
		}
		TagClick(event,key)
		{
			let tag = SelectContainerTagList.find(x => x == key);//find matching key in our tag object
			let index = SelectContainerTagList.indexOf(tag);
			SelectContainerTagList.splice(index, 1);//get rid of this element
			this.setState({ tags: SelectContainerTagList });
			dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
		}
			render()
			{
				var args=[];
				args.push('div');//Create element div
				args.push({className:"SelectRow"});
				if (SelectContainerTagList)
				for(let i =0;i<SelectContainerTagList.length;i++)
				{
						args.push(React.createElement(Tag,{text: SelectContainerTagList[i],id: SelectContainerTagList[i], onClick:this.TagClick, xButton:true}));
				}this
				return( React.createElement.apply(null,args));// return
			}
	}
	class SuggestContainer extends React.Component{
		constructor(props)
		{
			super(props);
			this.TagClick = this.TagClick.bind(this);
			this.state = {tags:this.props.tags}; 
		}
		TagClick(event,key)
		{
			let suggested_tags = this.props.tags;
			let tag = suggested_tags.find(x => x == key);//find matching key in our tag object
			let index = suggested_tags.indexOf(tag);
			SelectContainerTagList.push(suggested_tags.splice(index, 1));//get rid of this element
			this.setState({ tags: suggested_tags });
			dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
		}
		render(){
			console.log("INSIDE SUGGEST")
			var args=[];
			var suggested_tags = this.props.tags;
			
			args.push('div');//Create element div
			args.push({});
			if (suggested_tags)
				for(let i =0;i<suggested_tags.length;i++)
				{
					if(suggested_tags[i])
						args.push(React.createElement('div',{className:"suggestDiv"},React.createElement(Tag,{text: suggested_tags[i],id: suggested_tags[i], onClick: this.TagClick,xButton:false}),React.createElement(AddButton,{id:suggested_tags[i],onClick:this.TagClick})));
					else
						break;
				}this
				return( React.createElement.apply(null,args));// return
		}
	}
	// A react component
	class AutoSuggest extends React.Component{
		render()
		{
			return React.createElement('div'//type
										,{id:"Popup",style: {visibility: PopupVisible ?"visible":"hidden"}},//property
										React.createElement(SelectContainer,{},),
										React.createElement('p',{className:"dropdown_text"},"Press enter to search"),
										React.createElement('hr',{},),
										React.createElement('p',{className:"dropdown_text"},"Suggested Tags"),
										React.createElement(SuggestContainer,{tags:suggested},));//contents
		}
	}
	// A react component for controls on an image tile
	class TileControl extends React.Component {
		constructor(props)
		{
			super(props);
			this.state = {tags:this.props.tags.split(",").map(x =>JSON.parse( "{\"name\":\""+x+"\"}"))};
			this.addTags = this.addTags.bind(this);
			this.deleteTags = this.deleteTags.bind(this);
		}
		addTags(event,key)
		{	
			var _numId = this.props.numId;
			let tags = this.state.tags;
			let name = document.getElementById(key+this.props.index);
			tags.push(JSON.parse("{\"name\":\""+name.value+"\""+",\"key\":\""+name.value+tags.length+"\"}"));
			this.setState({tag:tags});
			addDelTag(_numId, tags);
		}
		deleteTags(event,key)
		{
			var _numId = this.props.numId;
			let tags = this.state.tags;
			let tag = tags.find(x => x.key === key);//find matching key in our tag object
			let index = tags.indexOf(tag);
			tags.splice(index, 1);//get rid of this element
			this.setState({ tags: tags });
			addDelTag(_numId, tags);
		}
		render () {
		var args=[];
		// remember input vars in closure
		// console.log("$$$$$$$$")
		// console.log(this.props)
			var _selected = this.props.selected;
			var _numId = this.props.numId;
			var _src = this.props.src;
			var _tags = this.state.tags;
			var _landmark=this.props.landmarks;
			// parse image src for photo name
		var photoName = _src.split("/").pop();
		photoName = photoName.split('%20').join(' ');
	
		args.push('div');//Create element div
		args.push({className:_selected ? 'selectedControls' : 'normalControls'});
		
		for(let i=0;i<_tags.length;i++)
		{
			args.push(React.createElement(Tag,{numId: _numId, text: _tags[i].name,id:_tags[i].name+i,onClick: this.deleteTags,xButton:true}));
			this.state.tags[i].key = _tags[i].name+i;
		}
		if(_tags.length<=6)//can only have 7 tags at one time
		args.push(React.createElement(AddTag,{numId: _numId, key:"NewTag",id:"NewTag",index:this.props.index,onClick: this.addTags}));
		//console.log(args);
		return( React.createElement.apply(null,args));// return
		} // render
	};
	
	
	// A react component for an image tileYou got a Bad Query. Try another input
	class ImageTile extends React.Component {
	
		render() {
		// onClick function needs to remember these as a closure
		var _onClick = this.props.onClick;
		var _index = this.props.index;
		var _photo = this.props.photo;
		var _selected = _photo.selected; // this one is just for readability
		var _numId = this.props.photo.id;
	
		return (
			React.createElement('div', 
				{style: {margin: this.props.margin, width: _photo.width},
				 className: 'tile',
							 onClick: function onClick(e) {
					// console.log("tile onclick");
					// call Gallery's onclick
					return _onClick (e, 
							 { index: _index, photo: _photo }) 
					}
			 }, // end of props of div
			 // contents of div - the Controls and an Image
			React.createElement(TileControl,
				{
				 numId: _numId,
				 selected: _selected, 
				 src: _photo.src,
				 tags:_photo.tags,
				 landmarks:_photo.landmarks,
				index:_index
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
		console.log(this.state.photos)
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
	const dropContainer = document.getElementById('reactPop');
	var reactApp = ReactDOM.render(React.createElement(App),reactContainer);
	dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
	PopupVisible = false;
	var noitems = document.getElementById("noitems");
	var reactcontainer= document.getElementById("react-container");	
	/* Workaround for bug in gallery where it isn't properly arranged at init */
	window.dispatchEvent(new Event('resize'));
	function updateImages()
	{
	  var keys="";
	  if(SelectContainerTagList.length!=0)
			keys = keys+ SelectContainerTagList;
	
	  if (!keys){
		return; // No query? Do nothing!
	  }
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", "/query?keyList=" + encodeURIComponent(keys.replace(/^\s+|\s+$/g, "").replace(/,/g, "+"))); // We want more input sanitization than this!
	  console.log("/query?keyList=" + encodeURIComponent(keys.replace(/,/g, "+")))
	  xhr.addEventListener("load", (evt) => {
		if (xhr.status == 200) {
			noitems.style.display="none";
			reactcontainer.style.alignItems="flex-start";
			reactcontainer.style.display="block";
			reactApp.setState({photos:JSON.parse(xhr.responseText)});
			window.dispatchEvent(new Event('resize')); /* The world is held together with duct tape */
		} else {
			if(xhr.status==400)
			document.getElementById("key").value="You got a "+ xhr.responseText+". Try another input";
			else if(xhr.status==401)
			document.getElementById("key").value =  "There were no photos satisfying this query.";
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

	function addDelTag(id, new_tags)
	{
	  var xhr = new XMLHttpRequest();
	  tag = String(id) + "," + new_tags.map(x=>x.name);
	  console.log(tag);
	  xhr.open("GET", "/query?tag=" + encodeURIComponent(tag)); // We want more input sanitization than this!
	  console.log("/query?tag=" + encodeURIComponent(tag))
	  xhr.send();
	}
var results;
var twokey;
function checkInput() {
	var keys = document.getElementById("key").value;
	console.log("@@@@@")
	console.log(keys)
	console.log(keys.length)
	if (keys.length <= 1) {
		PopupVisible=false;
		dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
		return;
	}


	console.log("GREATER THAN 2");

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/query?autocomplete=" + encodeURIComponent(keys)); // We want more input sanitization than this!
	console.log("/query?autocomplete=" + encodeURIComponent(keys))
	if(results===undefined)
	{
	xhr.addEventListener("load", (evt) => {
		if (xhr.status == 200) {
			noitems.style.display="none";
			reactcontainer.style.alignItems="flex-start";
			reactcontainer.style.display="block";

			results = xhr.responseText;
			if(keys.length==2)
		{
		    twokey= JSON.stringify(JSON.parse(results)[keys.toLowerCase()].tags);
            twokey = twokey.replace(/[{}"]/g, "").split(",");
			twokey = twokey.map(x=>x.split(":")[0]);
			suggested=twokey;
			PopupVisible=true;
			dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
		}

		} else {
			document.getElementById("key").value = "You got a " + xhr.responseText + ". Try another input";
		}
	});
	xhr.send();
	}
	else{
		if(keys.length==2)
		{
			twokey= JSON.stringify(JSON.parse(results)[keys.toLowerCase()].tags);
            twokey = twokey.replace(/[{}"]/g, "").split(",");
			twokey = twokey.map(x=>x.split(":")[0]);
			suggested=twokey;
		}
		else
        {
            suggested= twokey.filter(x=>x.toLowerCase().startsWith(keys.toLowerCase()));
        }
	}
	PopupVisible=true;
	dropDown = ReactDOM.render(React.createElement(AutoSuggest),dropContainer);
}
