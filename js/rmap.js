"use strict";
(function(_w, _d, $){
	var _m, _i=[], _h, _u;
	var rmap = {
		loading : function(on, msg){
			if(on){
				if(!$('#loading').length){ $('body').append('<div id="loading"></div>');}
				if(!msg){ msg = 'Loading...'; }
				$('#loading').html(msg).show();
			}else{
				$('#loading').hide();
			}
		},
		load : function(_t, d){
			_m = new google.maps.Map(document.getElementById('map'), {
		    center: {lat: 37.7749313, lng: -122.4210046},
		    zoom: 16
		  });
		  _t.legend(); 
		  _m.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('legend'));
		  var _h, t=0, _g = new google.maps.Geocoder();
			$(d.values).each(function(k,v){
				if(k){
					_t.sleep(500*k).then(function(){_t.pin(_g, _h, v)});
					t+=1;
				}else{
					_h = v; 
				}
			});
			_t.sleep(500*t).then(()=>_t.loading(false));
		},
		sleep: function(t){
  		return new Promise(function(r){setTimeout(r, t)});
		},
		pin : function(_g, _h, v){ 
			var a = v[_h.indexOf('Address')], t=v[0], _t=this;
			if(a){
				if(a.search(/san francisco/i) < 0){
					a += ', San Francisco'; 
				}
				_g.geocode( { 'address': a}, function(r, s){
		      if (s == google.maps.GeocoderStatus.OK) {
		        var marker = new google.maps.Marker({
		        		title: t,
		            map: _m,
		            icon: {url:_t.fuzzy(v,_h),scaledSize:new google.maps.Size(25, 25)},
		            position: r[0].geometry.location
		        });
		        var w = new google.maps.InfoWindow({
		          content: _t.content(v, _h)
		        });
		        marker.addListener('click', function() {
		        	for(var i=0;i<_i.length;i++){ _i[i].close(); }
		          w.open(_m, marker);
		        });
		        marker.setAnimation(google.maps.Animation.BOUNCE);
		        _t.sleep(500).then(function(){marker.setAnimation(null);});
		        _i.push(w);
		      } else {
		        _t.error('geo: '+s+'('+t+')');
		      }
		    });
			}else{
				console.log(t+' NG');
			}
		},
		fuzzy : function(v, _h){
			var e=this.emoji('Lunch'),a=['Lunch','Dinner','Breakfast','AM Coffee','PM Coffee','Drinks'];
			if((new Date()).getHours()>14){
				var x=0,y=1,n=a[x];
				a[x]=a[y]; a[y]=n;
				x=3,y=4,n=n=a[x];
				a[x]=a[y]; a[y]=n;
			}
			for(var i=0;i<a.length;i++){
				if(v[_h.indexOf(a[i])]){
					e=this.emoji(a[i]);
					break;
				}
			}
			return 'css/emoji/'+e+'.png';
		},
		emoji : function(t){
			var n=['Breakfast','AM Coffee','Lunch','PM Coffee','Dinner','Drinks','Good for Groups','Takes Reservations'],
		 	i=['donut','coffee','hamburger','tea','curry','beer','busts_in_silhouette','clipboard'];
		 	return  (n.indexOf(t)>-1)?i[n.indexOf(t)]:'';
		},
		icon : function(t){
			var e = this.emoji(t);
		 	return (e)?'<i class="em em-'+e+'"></i>':'';
		},
		legend : function(){
			var l =' <div id="legend">', 
		 	n=['Breakfast','AM Coffee','Lunch','PM Coffee','Dinner','Drinks','Good for Groups','Takes Reservations']
		 	for(var i=0;i<n.length;i++){
		 		l+='<div>'+this.icon(n[i])+' '+n[i]+'</div>';
		 	}
		 	l+='</div>';
		 	$('body').append(l);
		},
		content : function(v, _h){
			var h = '<div class="card">', d=['Restaurant','Local','Landmark','Address', 'Notes', 'Hours'], m=''; 
			for(var i=0;i<v.length;i++){
				if(d.indexOf(_h[i])>-1 && v[i]){
					h+='<div class="card-'+_h[i].toLowerCase()+' card-row">';
					if(i==0){
						var w=v[_h.indexOf('URL')], y=v[_h.indexOf('Yelp')],t='<strong>'+v[i]+'</strong>';
						t+=(w)?' <a href="'+w+'" target="_blank">Website</a>':'';
						t+=(y)?' <a href="'+y+'" target="_blank">Yelp</a>':'';
						h+=t;
					}else{
						h+='<strong>'+_h[i]+':</strong> '+v[i];
					}
					h+='</div>';
				}else{
					m+=(v[i])?this.icon(_h[i])+' ':'';
				}
			}
			h += '<div>'+m+'</div></div>';
			return h;
		},
		param : function(name){
		    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		    if (results==null){
		       return null;
		    }
		    else{
		       return decodeURI(results[1]) || 0;
		    }
		},
		error : function(m){
			console.log(m);
			this.loading(true, 'Something broke...');
		},
		initMap : function(){ 
			var _t = this;
			_t.loading(true);
		  $.getJSON('https://sheets.googleapis.com/v4/spreadsheets/'+_u+'/values/Sheet1!A1:Z?key='+_h).done(function(d){_t.load(_t,d)}).fail(function(j,t,e){_t.error(t+' '+e)});
		},
		ready : function(){
			$('head').append('<link href="css/emoji.css" rel="stylesheet" type="text/css" />'); // CREDIT: https://afeld.github.io/emoji-css/
			$('body').append('<script src="https://maps.googleapis.com/maps/api/js?callback=rmap.initMap&key='+_h+'"></script>');
		},
		init : function(){
			var _t = this;
			_h = _t.param('h'); 
			_u = _t.param('u');
			_w.rmap = _t;  
		}
	}
	rmap.init(); 
	$(_d).ready(rmap.ready); 
})(window, document, jQuery);

