"use strict";
(function(_w, _d, $){
	var _m, _h, _u, _i, _r, _a, _n;
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
		  var h, t=0, g = new google.maps.Geocoder();
			$(d.values).each(function(k,v){
				if(k){
					_t.sleep(_r*t).then(function(){_t.pin(g, h, v)});
					t+=1;
				}else{
					h = v; 
				}
			});
			_t.sleep(_r*t).then(function(){
				_t.filters();
				_t.loading(false);
			});
		},
		sleep: function(t){
  		return new Promise(function(r){setTimeout(r, t)});
		},
		pin : function(g, h, v){ 
			var a = v[h.indexOf('Address')], t=v[0], _t=this;
			if(a){
				if(a.search(/san francisco/i) < 0){
					a += ', San Francisco'; 
				}
				g.geocode( { 'address': a}, function(r, s){
		      if (s == google.maps.GeocoderStatus.OK) {
		        var m = new google.maps.Marker({
		        		title: t,
		            map: _m,
		            icon: {url:_t.fuzzy(v,h),scaledSize:new google.maps.Size(25, 25)},
		            position: r[0].geometry.location
		        });
		        var w = new google.maps.InfoWindow({
		          content: _t.content(v, h)
		        });
		        m.addListener('click', function() {
		        	for(var i=0;i<_i.length;i++){ _i[i][1].close(); }
		          w.open(_m, m);
		        });
		        m.setAnimation(google.maps.Animation.BOUNCE);
		        _t.sleep(_r).then(function(){m.setAnimation(null);});
		        _i.push([m,w]);
		      } else {
		        _t.error('geo: '+s+'('+t+')');
		      }
		    });
			}else{
				console.log(t+' NG');
			}
		},
		fuzzy : function(v, h){
			var e=this.emoji('Lunch'),a=_a[2];
			for(var i=0;i<a.length;i++){
				if(v[h.indexOf(a[i])]){
					e=this.emoji(a[i]);
					break;
				}
			}
			return 'css/emoji/'+e+'.png';
		},
		emoji : function(t){
			var n=_a[0],i=_a[1];
		 	return  (n.indexOf(t)>-1)?i[n.indexOf(t)]:'';
		},
		icon : function(t){
			var e = this.emoji(t);
		 	return (e)?'<i class="em em-'+e+'"></i>':'';
		},
		legend : function(){
			var l =' <div id="legend">', n=_a[0];
		 	for(var i=0;i<n.length;i++){
		 		l+='<div><a class="filter" data-value="'+_a[1][i]+'"><i class="em em-white_medium_square"></i>  '+this.icon(n[i])+' '+n[i]+'</a></div>';
		 	}
		 	l+='</div>';
		 	$('body').append(l);
		},
		filters : function(){
			var o = 'em-white_square_button', _t=this;
			$('#legend .filter i:first-child').addClass(o);
			$('#legend .filter').click(function(){_t.filter($(this),o);});
			$('#legend').addClass('loaded');
		},
		filter : function(e, o){
			var a=e.find('i:first-child'), b=e.data('value');
			if(a.hasClass(o)){
				_a[4].splice(_a[4].indexOf(b),1);
				a.removeClass(o); 
			}else{
				a.addClass(o); _a[4].push(b);
			}
			for(var i=0;i<_i.length;i++){ 
				var m=_i[i][0], w=_i[i][1], c=w.getContent(), h=true;
				if($('#legend .filter .em-white_medium_square').length != $('#legend .filter .'+o).length){
					for(var j=0;j<_a[4].length;j++){
						if(c.indexOf('em-'+_a[4][j])>-1){
							h=false; break;
						}	
					}
				}else{
					h=false;
				}
				if(!h){
					m.setVisible(true);
					for(var j=0;j<_a[3].length;j++){
						if(_a[4].indexOf(_a[3][j]) > -1 && c.indexOf('em-'+_a[3][j])>-1){
							m.setIcon({url:'css/emoji/'+_a[3][j]+'.png',scaledSize:new google.maps.Size(25, 25)});
							break;
						}
					}
				}else{m.setVisible(false);}
			}
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
			h += '<div class="icons">'+m+'</div></div>';
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
			var _t = this, a;
			a=_a[2];
			if((new Date()).getHours()>14){
				var x=0,y=1,n=a[x];
				a[x]=a[y]; a[y]=n;
				x=3,y=4,n=n=a[x];
				a[x]=a[y]; a[y]=n;
			} _a[2] = a;
			for(var i=0;i<_a[2].length;i++){
				_a[3].push(_a[1][_a[0].indexOf(_a[2][i])]);
			}		
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
			_i = []; 
			_r = 600;
			_a = [['Breakfast','AM Coffee','Lunch','PM Coffee','Dinner','Drinks','Good for Groups','Takes Reservations'],
						['donut','coffee','hamburger','tea','curry','beer','busts_in_silhouette','clipboard'],
						['Lunch','Dinner','Breakfast','AM Coffee','PM Coffee','Drinks','Good for Groups','Takes Reservations'],[]]; _a[4] = _a[1]; 

			_w.rmap = _t;  
		}
	}
	rmap.init(); 
	$(_d).ready(rmap.ready); 
})(window, document, jQuery);

