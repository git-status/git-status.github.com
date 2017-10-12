var FlickrApp={};
FlickrApp.phodata='';
FlickrApp.pages=[];
FlickrApp.flickrCreds={
	api_key:"462ffce8d2fcb9edf64dd2ed01c29aff",
	extras:"date_taken,path_alias,url_sq,url_m",	
	format:"json",
	nojsoncallback:1,
	per_page:100,
	page:1,
	tags:"san francisco",
	tagmode:"any"
	
};
FlickrApp.loading_gif="loading.gif";
FlickrApp.load_photo_into_main_window=function(idx){
	console.log('Load Photo into Main with index # '+idx);
	FlickrApp.current_item.set_current_index(idx);
	var img = new Image();
	img.src = FlickrApp.phodata.photos.photo[idx].url_m;
//(phodata.photos.photo[0].url_m
	img.title=FlickrApp.phodata.photos.photo[idx].title;
	//document.body.appendChild( img );
	$("div#current-item").html(img);
	//$("div#current-item").appendTo('<h3>'+FlickrApp.phodata.photos.photo[idx].title+'</h3>');	
	return;
	var item=document.getElementById("current-item").childNodes[0];
		item.replaceChild(img,item.childNodes[0]);
		function myFunction()
		{
		var textnode=document.createTextNode("Water");
		var item=document.getElementById("myList").childNodes[0];
		item.replaceChild(textnode,item.childNodes[0]);
		}
}
FlickrApp.current_item= {
	current_index:0,
	set_current_index:function(idx){
		this.current_index=idx;
	},
	get_current_index: function (){
		return this.current_index;	
	}
};
FlickrApp.timeline={};
FlickrApp.timeline.get_num_items=function(){
	function photo_length(){
		//return FlickrApp.phodata.photos.photo.length;
	}
	return photo_length();
}
FlickrApp.timeline.ImageSingleWidth=135;
FlickrApp.timeline.width=FlickrApp.timeline.ImageSingleWidth*FlickrApp.timeline.get_num_items();
FlickrApp.load_timeline=function (){
	//alert(FlickrApp.phodata.photos.photo[0].title);
	for (var i = 0, thumb; thumb = FlickrApp.phodata.photos.photo[i++];) {
		$("#slider").append($("<img/>").attr(
				{
					src:thumb.url_sq,
					alt:thumb.title,
					title:thumb.title,
					id:'t-img'+i,
					"data-index":i,
					"data-date":thumb.datetaken
				}
			).click(FlickrApp.timelineClick)
		);
    	$("#slider").width(FlickrApp.phodata.photos.photo.length*FlickrApp.timeline.ImageSingleWidth);
	}
	//initially just load first image into DOM
		      if ( i === 1 ) {
				FlickrApp.current_item.set_current_index(i);
				$( "<img/>" ).attr( {
						src: item.url_m,
						title:'date:'+item.datetaken,
						'data-index':i
						}						
						).appendTo( "#current-item" );
			//return false;
		      }
};
FlickrApp.timelineClick=function(event){
					event.preventDefault();
					//load item into main display.	

					//$('"#t-img'+FlickrApp.current_item.get_current_index()).removeClass('timeline-active-item');
					FlickrApp.load_photo_into_main_window(parseInt(event.target.getAttribute("data-index")-1));
					FlickrApp.timelineAnim(this);			
				};
FlickrApp.timelineAnim=function(tImg){
		//alert($(tImg).attr("data-index"));
		$(tImg).addClass('timeline-active-item');
		var tPos=parseInt($(tImg).attr("data-index"),10);
		var tMove=0;
		for (i=3;i<tPos;i=i+5){
			console.log('i ['+i+']');
			tMove=tPos-i;
		}
		
		var imgSingleWidth=135;
		console.log('tMove:['+tMove+'],imgSingleWidth:['+imgSingleWidth+']');
		$('#slider').stop().animate({left: -tMove*imgSingleWidth}, 800);



}
FlickrApp.timeline.load_more_images=function(){
	//ajax call to flickr API load more images..
	alert('loadmore images');
	current_page=FlickrApp.flickrCreds.page=FlickrApp.flickrCreds.page+1;

	var flickerAPI = "http://api.flickr.com/services/rest/?method=flickr.photos.getRecent";
		  $.getJSON( flickerAPI, FlickrApp.flickrCreds)
		  .done(function( data ) {
		  	FlickrApp.pages[current_page]=data.photos;
			FlickrApp.phodata=data;
			console.log('start sort');
				data.photos.photo.sortBy(function(o){ return new Date( o.datetaken ) });		
			console.log('end sort');
		
			FlickrApp.load_timeline();

		  });
		
};
FlickrApp.pagenumber=1;



$(document).ready(function () {


//working on making this display during loading requests
$('#loading-div')
    .hide()  // hide it initially
    .ajaxStart(function() {
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    })
;

/*example flickr api url
 http://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=c0149e5b72506cd0b5895a036deb3a48&extras=date_taken%2Cpath_alias%2Curl_sq&per_page=100&page=1&format=json&auth_token=72157633487404966-e0c7f90aa7c134b2&api_sig=0f0dc45d9e30460c55fdbaec64d4d22d
*/

		(function() {
		  var flickerAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent";
		  $.getJSON( flickerAPI, FlickrApp.flickrCreds)
		  .done(function( data ) {
			FlickrApp.phodata=data;
			console.log('start sort');
				data.photos.photo.sortBy(function(o){ return new Date( o.datetaken ) });		
			console.log('end sort');
		
			FlickrApp.load_timeline();

		  });
		})();


	//Main Frame Arrow Navigation..
	$("div.arrow-left").click(function(){
			var prev=$("div#current-item img").attr('data-index')-1;
			console.log('prev item : ',prev);
			FlickrApp.load_photo_into_main_window(FlickrApp.current_item.get_current_index()-1);				
			//goToItem ($("div#current-item"),prev);
			//replace current-item with item #?

			
		}	
	);
	
	$("div.arrow-right").click(function(){
			var next=parseInt($("div#current-item img").attr('data-index'),10)+1;
			console.log('next item : ',FlickrApp.current_item.get_current_index+1);
			//replace current-item with item #?
			FlickrApp.load_photo_into_main_window(FlickrApp.current_item.get_current_index()+1);	
			//goToItem($("div#current-item"),next);
			
			
		}
	);

	/*Timeline Arrow Navigation*/
	 var galW = $('#gallery').width(),   // 680
      	imgN = $('#slider img').length, // 100/10=10 frames of 10 images
      	c = 0;

	function anim(){
			console.log('fn.anim: left{[- '+c+'] * galW['+galW+']}');
    		$('#slider').stop().animate({left: -c*galW}, 800);
		//$('#gallery_nav span').removeClass('active').eq( c ).addClass('active');
    
	}

	//$('#slider').width( galW*imgN );//7500
	//$('#slider').width( 7500 );//7500  
	$('.timeline-arrow-left, .timeline-arrow-right').click(function(){          
		console.log('.timeline-arrow:[c1]'+c);
		var myId = this.id=='next' ? c++ : c-- ;   
		console.log('.timeline-arrow:[c2]'+c);
		imgN = $('#slider img').length;
		console.log('number of images in timeline',imgN);
		//c=((c==-1) ? parseInt(imgN)-1 : c%parseInt(imgN) ); 
		c=((c<0)?0:c);//left most
		if (c>(imgN/5)){ 
			c=(imgN/5);
			FlickrApp.timeline.load_more_images(FlickrApp.pagenumber+1);
		}				//right most

		console.log('.timeline-arrow:[c3]'+parseInt(c)+' [imgN]'+imgN);
		console.log('.timeline-arrow-(left|right).click:['+c+']');
		anim();
	  });

   });

/* Schwarzian Algorithm Sorting JSON response*/

(function(){
  if (typeof Object.defineProperty === 'function'){
    try{Object.defineProperty(Array.prototype,'sortBy',{value:sb}); }catch(e){}
  }
  if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

  function sb(f){
    for (var i=this.length;i;){
      var o = this[--i];
      this[i] = [].concat(f.call(o,o,i),o);
    }
    this.sort(function(a,b){
      for (var i=0,len=a.length;i<len;++i){
        if (a[i]!=b[i]) return a[i]>b[i]?-1:1;
      }
      return 0;
    });
    for (var i=this.length;i;){
      this[--i]=this[i][this[i].length-1];
    }
    return this;
  }
})();

/*generic sort..

	data.photos.photo.sort(function(a,b){
		  a = new Date(a.datetaken);
		  b = new Date(b.datetaken);
		  return a<b?-1:a>b?1:0;
		});				
	
*/



