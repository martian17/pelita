/**
 * Script um das TU-speeddial aufzubauen
 * @author Nicolas Klenert
 * (who was not able to decide which language he want to use to comment this script)
 *
 * Der Aufbau findet automatisch beim ausführen des Script statt. Dieses Script befolgt keiner Modul-Schreibweise (da ich mich damit erst später befasst habe), sondern ist einfach chronologisch aufgebaut
 */


//TUfunc_object wird unsere global-Variable, welche die Funktionen für die Event-Handler besitzt
//Das System ist nicht ausgereift. Wenn die Handler kopiert werden würden, benötigt man wohl keine globale Variable!
//ebenso werden teilweise die Handler kopiert, teilweise als Referenz übergeben. Dies ist zu ändern!
var TUfunc_object;

//Funktion die dafür zuständig ist, dass das Script erst nach dem Laden der Seite ausgeführt wird (dadurch kann das Skript an jeder Stelle der Seite geladen werden)

document.addEventListener("DOMContentLoaded", function(event) {
	TUfunc_object = TU_speeddial()
});

//closure function, so the variables are not global
function TU_speeddial(){
	//Konvention: <div id="app-field"></div>
	var TUspeeddial_body = document.getElementById("app-field");

	//only do everything, if there is a node with "app-field"
	if(TUspeeddial_body){

	//Variables....

	//hol dir die src des files. Falls keine id gesetzt wurde, nimm die standardurl
	//diese Methode exestiert nur, damit man das Speeddial besser entwickeln kann, da in bastet die id angegeben werden kann
	var TUspeeddial_path = document.getElementById("TUspeeddial");
	if(TUspeeddial_path){
		TUspeeddial_path = TUspeeddial_path.src;
		TUspeeddial_path = TUspeeddial_path.substr(0,TUspeeddial_path.lastIndexOf("/"));
	}else{
		TUspeeddial_path = "https://isis.tu-berlin.de/tu-speeddial";
	}

	var TUspeeddial_linkImg = TUspeeddial_path + "/pix/logos.png";
	//var TUspeeddial_glassEffect = TUspeeddial_path + "/note-overlay.png";
	var TUspeeddial_loadcss = TUspeeddial_path + "/style.css";
	var TUspeeddial_more = TUspeeddial_path + "/more.php";

	var TUspeeddial_fontchange = false;
	var TUspeeddial_transparent = "0.95";
	var TUspeeddial_linktransparent = "0.6";		//exist also in css
	var TUspeeddial_sizeImage = 18;	//in px (optimices for 22px)		exist also in css
	var TUspeeddial_toleft = null;		//is the block going left or right....
	var TUspeeddial_overflow = null;
	var TUspeeddial_css = null;

	var TUspeeddial_gap = 15;
	var TUspeeddial_padding = 5;		//exist also in css
	var TUspeeddial_linkHeight = 70;	//exist also in css
	var TUspeeddial_linkWidth = 70;		//exist also in css
	var TUspeeddial_textHeight = 20;	//exist also in css
	var TUspeeddial_listPadding = 15;	//exist also in css
	var TUspeeddial_footer = 50;
	var TUspeeddial_lang = document.documentElement.lang;  //welche Sprache eingestellt ist

	var TUspeeddial_linkArray = [
		{url: "https://www.tu.berlin/", name: "TU Berlin", img: 1},
		{url: "https://isis.tu-berlin.de/my/", name: "ISIS", img: 2},
		{url: "https://www.stw.berlin/mensen.html", name: "Mensa", img: 3},
		{url: "https://moseskonto.tu-berlin.de/moses/", name: "Moses", img: 4},
		{url: "https://chat.tu-berlin.de/", name: "Matrix Chat", img: 5},
		{url: "https://www.ub.tu-berlin.de/", name: "Bibliothek", img: 6 },
		{url: "https://www.tu-sport.de/", name: "TU Sport", img: 7 },
		{url: "https://www.tu.berlin/studieren/uni-leben/campusplan/", name: "Campusplan", img: 9 },
		{url: "https://exchange.tu-berlin.de/", name:"TU-Mail", img: 8},
		{url: "https://www.studienberatung.tu-berlin.de/", name: "Studien-beratung", img: 10 },
		{url: "https://bbb.innocampus.tu-berlin.de/", name: "BigBlueButton", img: 11 },
		{url: "https://moseskonto.tu-berlin.de/moses/verzeichnis/index.html", name: "Vorlesungs-verzeichnis", img: 12 },
		{url: "https://meet.innocampus.tu-berlin.de/", name: "Videochat", img: 17 },
		{url: "https://tubcloud.tu-berlin.de/", name: "tubCloud", img: 14},
		{url: "https://gitlab.tu-berlin.de/", name: "GitLab", img: 15},
		{url: "https://chatu.qu.tu-berlin.de/", name: "CHATU Bot", img: 16}
	];

	//set variables with data-* attributes. null is default!
	//if(TUspeeddial_body.dataset){
		var TUspeeddial_css = TUspeeddial_body.getAttribute('data-css'); //TUspeeddial_body.dataset.css;
		var TUspeeddial_align = TUspeeddial_body.getAttribute('data-align'); //TUspeeddial_body.dataset.left;
		var TUspeeddial_overflow = TUspeeddial_body.getAttribute('data-overflow'); //TUspeeddial_body.dataset.overflow;
		var TUspeeddial_buttonsize = TUspeeddial_body.getAttribute('data-buttonsize');
	//}
		if(TUspeeddial_css){
			TUspeeddial_css = (TUspeeddial_css === 'true');
		}
		if(TUspeeddial_align != 'left' && TUspeeddial_align != 'right'){
			TUspeeddial_align = null;
		}
		if(TUspeeddial_overflow){
			TUspeeddial_overflow = (TUspeeddial_overflow === 'true');
		}
		if(TUspeeddial_buttonsize){
			TUspeeddial_buttonsize = parseInt(TUspeeddial_buttonsize);
			if(TUspeeddial_buttonsize < 18){
				TUspeeddial_buttonsize = 18;
			}
		}else {
			TUspeeddial_buttonsize = 20;		//standardgröße
		}

	//---------------------------------------------------------------------

	//---------------------------create funtcions-------------------------
	//I have to initialise the functions first. Otherwise Firefox says the function would not be declared.
	//I have no idea why. Maybe FF load the Script differently. Check document.load events and such things.
	//Wurde wahrscheinlich behoben

	/** function to get the position of a DOM-Node.
	 * Is needed if the speeddial is a direct children of the body tag (due a overflow:hidden or similiar restriction)
	 *
	 */
	function TUspeeddial_getPosition(o){
	    var r = { top:0, left:0, width:0, height:0 };

	    if(!o) return r;
	    else if(typeof o == 'string' ) o = document.getElementById(o);

	    if( typeof o != 'object' ) return r;

	    if(typeof o.offsetTop != 'undefined')    {
	         r.height = o.offsetHeight;
	         r.width = o.offsetWidth;
	         r.left = r.top = 0;
	         while (o && o.tagName != 'HTML')         {
	              r.top  += parseInt( o.offsetTop );
	              r.left += parseInt( o.offsetLeft );
	              o = o.offsetParent;
	         }
	    }
	    return r;
	}

	/**
	 * function to know the pattern (2x2,3x3,4x4 Links)
	 * not supported yet(only 4x4 works)
	 *
	 * WICHTIG (deswegen auf Deutsch für meinen Nachfolger:)
	 * Als weitere Eigenschaft (data-size) wollte ich die Möglichkeit zum Einstellen geben, wie viele Links angezeigt werden
	 * Das Problem ist, dass bisher die Links relativ mit top: xxx und left: xxx an ihren Stellen positioniert werden. Dies ist auch nötig, da sonst FF rumzicken kann (also versuch kein float)
	 * Die Berechnung(für die Position der Links (siehe weiter unten beim Aufbau)) geht bisher einfach davon aus, dass es 4x4 Links gibt. Dies ist eben umzuschreiben.
	 */
	function TUspeeddial_calculateSize(){
		for(var i = 2; i < 5; ++i){
			if(TUspeeddial_linkArray.length <= i*i){
				return i;						//size: TUspeeddial_width/i,
			}
		}
	}

	/**
	 * Verbesserungsmöglichkeit: Background-color: rgba(); nutzen, da Opacity ein Filter ist und alle Childrens des Nodes beeinflusst
	 */
	function TUspeeddial_hide(){
		TUspeeddial_list.style.opacity = "0";
		//other hide effects come into the play AFTER the trasitionsevent is over!
	}

	function TUspeeddial_changeVisibility(){
		if(TUspeeddial_list.style.opacity == "0"){
			TUspeeddial_list.style.opacity = TUspeeddial_transparent;
			TUspeeddial_list.style.top = TUspeeddial_topList+"px";
			TUspeeddial_list.ariaHidden = "false";
			TUspeeddial_list.setAttribute("aria-hidden","false");
		}else{
			TUspeeddial_hide();
		}
	}

	/**
	 * function set as Event-Handler for the resize of the Browser
	 *
	 * Diese Funktion ist ziemlich hässlich und leider notwendig. Wenn das Speeddial am body-tag hängt, wird jedes Mal
	 * die Position neu berechnet, wo das Speeddial hängen muss. Ebenso verschwindet das Speeddial, wenn das app-field verschwindet (bisher nur bei Display: none)
	 */
	function TUspeeddial_resize(){

		//Abfrage ob Neuberechnung der Position notwednig ist
		if(!(TUspeeddial_align != null && TUspeeddial_overflow)){
			TUspeeddial_imgPos = TUspeeddial_getPosition(TUspeeddial_img);
		}
		//Abfrage ob getestet werden muss, ob das Speeddial noch genug Platz hat
		if(TUspeeddial_align === null){
			TUspeeddial_testAlign();
		}else{
			testedAlign = TUspeeddial_align;
		}

		//Fall, dass das Speeddial am app-field hängen kann
		if(TUspeeddial_overflow){
			if(TUspeeddial_toleft != testedAlign){
				if(testedAlign == 'left'){
					TUspeeddial_list.className += ' left';
				}else{
					//TUspeeddial_list.className = TUspeeddial_list.className.replace( /(?:^|\s)left(?!\S)/g , '' );
					TUspeeddial_list.className = 'TUspeeddial_list';
				}
			}
		//Fall, dass das Speeddial am Body-tag hängt
		}else{
			//wird immer geändert, da resize!
			//kontrolliere ob app-field verschwindet, dann lasse auch list verschwinden!
			if(TUspeeddial_imgPos.width == 0 && TUspeeddial_imgPos.height == 0){
				TUspeeddial_list.style.display = 'none';
			}else{
				if(TUspeeddial_list.style && TUspeeddial_list.style.display == 'none'){	//TODO: richtig einstellen!
					TUspeeddial_list.style.display = 'block';
				}
			}
			if(testedAlign == 'left'){
				TUspeeddial_list.style.left = (TUspeeddial_imgPos.left - TUspeeddial_padding - TUspeeddial_width) +"px";
				TUspeeddial_list.style.right = "auto";
			}else{
				TUspeeddial_list.style.left = (TUspeeddial_imgPos.left) +"px";		//- TUspeeddial_padding
				TUspeeddial_list.style.right = "auto";
			}
		}

		//teste außerdem, ob die Speechbubble geändert werden muss
		if(TUspeeddial_toleft != testedAlign){
			TUspeeddial_toleft = testedAlign;
			if(TUspeeddial_speech){
				if(testedAlign == 'left'){
					TUspeeddial_speech.className = 'speech inverse';
					TUspeeddial_speech.style.left = "auto";
					TUspeeddial_speech.style.right = TUspeeddial_buttonsize -10 +"px";
				}else{
					TUspeeddial_speech.className = 'speech';
					TUspeeddial_speech.style.left = TUspeeddial_buttonsize -10 +"px";
					TUspeeddial_speech.style.right = "auto";
				}
			}
		}

		TUspeeddial_topList = TUspeeddial_gap + TUspeeddial_buttonsize;		//TUspeeddial_imgPos.top

		if(!TUspeeddial_overflow){
			TUspeeddial_topList = TUspeeddial_topList + TUspeeddial_imgPos.top + 3;
		}

		//finde heraus ob das Fenster gerade gezeigt wird oder nicht
		//aria-Hidden dient eigentlich nur für "behindertengerechte" Websiten und Performenceverbesserung,
		//wird hier aber auch zur Erkennung genutzt und somit für das Skript notwendig!
		if(TUspeeddial_list.ariaHidden == "false"){
			TUspeeddial_list.style.top = TUspeeddial_topList + "px";
		}


	}

	function TUspeeddial_testAlign(){
		if(TUspeeddial_imgPos.left + TUspeeddial_width + TUspeeddial_buttonsize > window.innerWidth && TUspeeddial_imgPos.left >  window.innerWidth / 2){
			testedAlign = 'left';
		}else{
			testedAlign = 'right';
		}
		return;
	}

	/**
	 *  function to test/find out which transitionevent does work
	 */
	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    }

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}

	//return true, if i can use the overflow-option, ohterwise list have to be a child of body
	function isOverflow(o){
		if(!o) return false;
	    else if(typeof o == 'string' ) o = document.getElementById(o);
	    if( typeof o != 'object' ) return false;

	    while (o && o.tagName != 'BODY'){
	    	if(o.style){
	    		var overflow = window.getComputedStyle(o).getPropertyValue("overflow");
	    		//because o.style.overflow only works for element-style (not extern css-files)

		    	if(overflow !== "visible" && overflow !== "inherit"){
		    		return false;
		    	}
	    	}
	    	 o = o.parentNode;
	    }
	    return true;

	}

	//function für jsonp
	function callback(href){
		setTimeout(function(){		//die assign function muss in setTimeout drinn sein...
			//ansonsten kann man nich zurück-button von ff nutzen....
			//um ehrlich zu sein habe ich keine Ahnung, warum es ausgerechnet dann funktioniert
			window.location.assign(href);
		},1);
	}

	//------------------------create content-----------------------------------

	//Füge die css_datei hinzu, falls sie noch nicht gegeben wurde (data-css)
	//sehr ugly hack, deswegen die data-* option
	if(!TUspeeddial_css){
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.href = TUspeeddial_loadcss;
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	var TUspeeddial_rowcounter = TUspeeddial_calculateSize();
	var TUspeeddial_width = TUspeeddial_rowcounter*(TUspeeddial_linkWidth+TUspeeddial_padding*2); + TUspeeddial_listPadding;		// + TUspeeddial_padding
	var TUspeeddial_height =  TUspeeddial_rowcounter*(TUspeeddial_linkHeight+TUspeeddial_padding+TUspeeddial_textHeight) +TUspeeddial_listPadding + TUspeeddial_footer;		//+TUspeeddial_padding

	//set onclick event and style
	document.onclick = function() {TUfunc_object.hide()};
	//TUspeeddial_body.setAttribute("onclick","TUfunc_object.changeVisibility()");
	TUspeeddial_body.onclick = function(e) {
		e.stopPropagation();
		TUfunc_object.changeVisibility();
		};


	//TUspeeddial_body.setAttribute("onmouseenter","TUfunc_object.changeVisibility()");

	TUspeeddial_body.setAttribute("style","position: relative; float: none; display: inline-block;")		//inline-block ist ganz wichtig, damit die Position richtig berechnet wird (margin und padding sind nicht erlaubt...?)


	//set image
	var TUspeeddial_img = document.createElement("DIV");
	TUspeeddial_img.className = 'TUspeeddial_button';
	//rechne aus, wie groß background-size sein muss (es wird davon ausgegangen, dass logos.png 100px 1900px groß ist)
	var img_width = TUspeeddial_buttonsize * 100/22;
	var img_height = TUspeeddial_buttonsize * 1900/22;
	TUspeeddial_img.setAttribute("style","background-image: url("+TUspeeddial_linkImg+"); background-size: "+img_width+"px "+img_height+"px; background-position: 0 0;");
	TUspeeddial_img.style.width = TUspeeddial_buttonsize+"px";
	TUspeeddial_img.style.height = TUspeeddial_buttonsize+"px";
	TUspeeddial_body.appendChild(TUspeeddial_img);


	//set a function to track resizing
	window.addEventListener("resize", TUspeeddial_resize, true);


	//create app-list
	if(TUspeeddial_overflow === null){
		TUspeeddial_overflow = isOverflow(TUspeeddial_body);
	}

	var TUspeeddial_list = document.createElement("DIV");
	TUspeeddial_list.className = 'TUspeeddial_list';

	TUspeeddial_list.style.position = 'absolute'; //notwendig, da css zu langsam reagiert

//	if(TUspeeddial_overflow){
//		TUspeeddial_body.appendChild(TUspeeddial_list);
//	}else{
//		document.getElementsByTagName("body")[0].appendChild(TUspeeddial_list);
//	}

	// --> füge die Liste erst hinzu, wenn alles erzeugt wurde (um den sichtbaren Aufbau zu vermeiden)


	//add speechbubble
	var TUspeeddial_speech = document.createElement("DIV");
	TUspeeddial_list.appendChild(TUspeeddial_speech);
	TUspeeddial_speech.className = 'speech';
	TUspeeddial_speech.setAttribute("style","background-image: url("+TUspeeddial_linkImg+");");

	var TUspeeddial_imgPos;
	var testedAlign;
	var TUspeeddial_topList;

	TUspeeddial_resize();		//to adjust the speech and initialise the variabeln

	TUspeeddial_list.style.height = TUspeeddial_height+"px";
	TUspeeddial_list.style.width = TUspeeddial_width+"px";
	TUspeeddial_list.style.top = "-9999px";
	TUspeeddial_list.style.opacity = "0";

//	TUspeeddial_list.style.transition = "opacity 0.3s";
	//TUspeeddial_list.setAttribute("onmouseleave","TUfunc_object.hide()");

	TUspeeddial_list.addEventListener(
			whichTransitionEvent(),
		     function( event ) {
		    	 if(TUspeeddial_list.style.opacity == "0"){
		    			TUspeeddial_list.style.top = "-9999px";
		    			TUspeeddial_list.ariaHidden = "true";
		    			TUspeeddial_list.setAttribute("aria-hidden","true");

		    	 }
		     }, false );


	//create Links

	var temp;
	var tempChild;

	for(var i = 0; i<TUspeeddial_linkArray.length; ++i){
		//link
		temp = document.createElement("A");
		temp.className = 'TUspeeddial_link';
		TUspeeddial_list.appendChild(temp);
		//wird einfach nur hinzugefügt, damit User denken, es wäre ein ganz normaler Link
		temp.href = TUspeeddial_linkArray[i].url;

		var templeft = i%TUspeeddial_rowcounter*(TUspeeddial_linkWidth+2*TUspeeddial_padding)+TUspeeddial_listPadding;
		var temptop = Math.floor(i/TUspeeddial_rowcounter)*(TUspeeddial_linkHeight+TUspeeddial_textHeight+2*TUspeeddial_padding)+TUspeeddial_listPadding;
		temp.style.left = templeft+"px";
		temp.style.top = temptop+"px";
		temp.setAttribute("data-img",TUspeeddial_linkArray[i].img);
		temp.onclick = function (event){
			 var e = event || window.event;
			 e.preventDefault();		//notwendig, da a href sonst manchmal zu schnell ist
			//aufgrund von same origin policy wird hier jsonp verwendent (json padding)
			var ascript = document.createElement('script');
			ascript.type = 'text/javascript';
			//cache und time wird verwendet um sicherzugehen, dass alle Anfragen tatsächlich die Seite aufrufen und nich nur den gecachten wert holen
			var date = new Date();
			ascript.src = TUspeeddial_path+'/TUspeeddial_count.php?id='+this.getAttribute("data-img")+'&cache='+Math.random()+'&time='+date.getTime();
			document.getElementsByTagName('head')[0].appendChild(ascript);
			//lass die callback function die Weiterleitung übernehmen -> es wird sichergestellt, dass das Script ausgeführt wird
			return false; //ff way for preventDefault
		}
		//image

		if(typeof TUspeeddial_linkArray[i].img == "string"){
			//falls es eine url ist
			tempChild = document.createElement("IMG");
			temp.appendChild(tempChild);
			tempChild.setAttribute("src",TUspeeddial_linkArray[i].img);
			tempChild.setAttribute("alt",TUspeeddial_linkArray[i].name);
		}else{
			tempChild = document.createElement("DIV");
			temp.appendChild(tempChild);
			if(typeof TUspeeddial_linkArray[i].img == "number"){
				//falls es eine nummer ist (die ansagt wo das bild zu finden ist)
				tempChild.setAttribute("style","background-image: url("+TUspeeddial_linkImg+"); background-size:"+TUspeeddial_linkWidth+"px "+TUspeeddial_linkHeight*19+"px; background-position: 0 "+ (-(TUspeeddial_linkArray[i].img)*TUspeeddial_linkHeight)+"px;");
			}else{
				//default: nimm einfach das nächste bild
				tempChild.setAttribute("style","background-image: url("+TUspeeddial_linkImg+"); background-size:"+TUspeeddial_linkWidth+"px "+TUspeeddial_linkHeight*18+"px; background-position: 0 "+ (-(i+1)*TUspeeddial_linkHeight)+"px;");
			}
		}
		//style for all cases
		tempChild.className = 'TUspeeddial_image';

		//text
		tempChild = document.createElement("SPAN");
		tempChild.className = 'TUspeeddial_text';
		temp.appendChild(tempChild);
		tempChild.innerHTML = TUspeeddial_linkArray[i].name;


		if(TUspeeddial_fontchange){
			if(TUspeeddial_linkArray[i].name.length > 11){
				tempChild.style.fontSize = "10px";
			}else if(TUspeeddial_linkArray[i].name.length > 9){
				tempChild.style.fontSize = "12px";
			}else{
				tempChild.style.fontSize = "13px";
			}

			if(TUspeeddial_linkArray[i].name.length > 15){
				temp.style.lineHeight = "5px";
				tempChild.style.verticalAlign = "text-top";
			}else{
				tempChild.style.verticalAlign = "sub";
			}

		}else{
			tempChild.style.fontSize = "11px";

			if(TUspeeddial_linkArray[i].name.length > 13){
				temp.style.lineHeight = "5px";
				tempChild.style.verticalAlign = "text-top";
			}else{
				tempChild.style.verticalAlign = "sub";
				tempChild.style.whiteSpace = "nowrap";
			}
		}


	}

	//create footer (= temp)
	temptop = TUspeeddial_rowcounter*(TUspeeddial_linkHeight+TUspeeddial_textHeight+2*TUspeeddial_padding);	//war 2mal padding
	temp = document.createElement("DIV");
	temp.className = 'TUspeeddial_footer';

	temp.style.top = (temptop + 5) +"px";

	//more button
	tempChild = document.createElement("A");
	tempChild.className = 'TUspeeddial_more';
	temp.appendChild(tempChild);

	//teste was für eine Sprache genutzt wird
	if(TUspeeddial_lang == "de"){
		tempChild.innerHTML ="Mehr anzeigen";
	}else{
		tempChild.innerHTML = "Show more";
	}

	tempChild.href = TUspeeddial_more + "?lang="+TUspeeddial_lang;

	//copyright
	tempChild = document.createElement("A");
	tempChild.className = 'TUspeeddial_copyright';
	temp.appendChild(tempChild);

	tempChild.innerHTML = "Copyright by InnoCampus";
	tempChild.href = "http://www.innocampus.tu-berlin.de/";

	//readme
	tempChild = document.createElement("A");
	tempChild.className = 'TUspeeddial_readme';
	temp.appendChild(tempChild);

	tempChild.innerHTML = "README";
	tempChild.href = (TUspeeddial_path + "/README.html");

	TUspeeddial_list.appendChild(temp);

	// --> füge die Liste am Ende des Aufbaus hinzu
	if(TUspeeddial_overflow){
		TUspeeddial_body.appendChild(TUspeeddial_list);
	}else{
		document.getElementsByTagName("body")[0].appendChild(TUspeeddial_list);
	}

	return {changeVisibility: TUspeeddial_changeVisibility, hide: TUspeeddial_hide, callback: callback}; // click: TUspeeddial_onClick
	}//end if
	else{
		return;
	}
}
