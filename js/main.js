//image_compare version 1.2

var FS = FS || {}; //utilise l'objet FS s'il existe ou (||) créé un nouvel objet {}

FS.main = {
	init : function (tabdata) {
			console.log('init');
/**--------------------------------------------------------------
	Défintion des données à afficher et mise en place 
----------------------------------------------------------------*/	

		// récupération de la variable générale contenant les données et affectation à la variable interne
		FS.main.donnees = tabdata;

		for(var i in FS.main.donnees) {
			if (FS.main.donnees[i][0] != 'image1' && FS.main.donnees[i][0] != 'image2') {

				if (FS.main.donnees[i][2] == 'cigal') {
					FS.main.donnees[i][2] = 'https://www.cigalsace.org/geoserver/cigal/gwc/service/wms';
				}

				$('#ImageGauche').append($('<option>', {
					value: FS.main.donnees[i][0],
					text: FS.main.donnees[i][1]
				}));
				$('#ImageDroite').append($('<option>', {
					value: FS.main.donnees[i][0],
					text: FS.main.donnees[i][1]
				}));
			};
			if (FS.main.donnees[i][0] == 'image1' ) {
				$('#ImageGauche option')[FS.main.donnees[i][1]].selected = true;
			};
			if (FS.main.donnees[i][0] == 'image2' ) {
				$('#ImageDroite option')[FS.main.donnees[i][1]].selected = true;
			};
		};


/**--------------------------------------------------------------
	Déclaration des couches (couches BIS utilisées pour la carte
	de droite en mode côte à côte et la carte de dessous en
	mode switcher
----------------------------------------------------------------*/		

		var source = [];
		var couches = [];

		for(var i in FS.main.donnees) {
			if (FS.main.donnees[i][1] == 'XYZ') {
				source[i] = new ol.source.XYZ({
					url: FS.main.donnees[i][2],
					//crossOrigin: 'anonymous'
				});					
			} else {
				source[i] = new ol.source.TileWMS({
					url: FS.main.donnees[i][2],
					params: {
						'LAYERS': FS.main.donnees[i][3],
						'TILED': true,
					},
					crossOrigin: 'anonymous'
				});
			}
			couches[i] = new ol.layer.Tile ({
				source: source[i],
				opacity: 1,
				name: FS.main.donnees[i][0],
				visible : false
			});



		};
		var nb_couches = FS.main.donnees.length
		for(var i= 0; i < nb_couches; i++) {	
			couches[FS.main.donnees.length+i] = new ol.layer.Tile ({
				source: source[i],
				opacity: 1,
				name: FS.main.donnees[i][0]+'_BIS',
				visible : false
			});
		};
		
	
		
/**--------------------------------------------------------------
	Couche des mesures
---------------------------------------------------------------*/
					
		FS.main.mesure = new ol.source.Vector();		
		FS.main.vectorLayer = new ol.layer.Vector({
			source: FS.main.mesure,
			name: 'Mesure_vector',
			visible : true,
			style: new ol.style.Style({
			    fill: new ol.style.Fill({
					color: 'rgba(251, 175, 23, 0.1)'
				}),
				stroke: new ol.style.Stroke({
					color: '#ffcc33',
					width: 2
				}),
			    image: new ol.style.Circle({
					radius: 7,
					fill: new ol.style.Fill({
						color: '#ffcc33'
					})
			    })
			})
		});




/**-------------------------------------------------------------------
	Paramétrage de la vue et des cartes (gauche = map1, droite = map2) 
---------------------------------------------------------------------*/		
			
		FS.main.vue = new ol.View({ // création de la vue, par défaut en Mercator
			center: ol.proj.fromLonLat([7.75,48.58]), // transformation des coordonnées en degrés vers Mercator 
			zoom: 14, // niveau de zoom
			extent: [848000,6180500,880000,6221800], // étandue maximale du centre de la carte
			minZoom : 11,
			maxZoom : 20
		});
		
		var scaleLine = new ol.control.ScaleLine();
		var zoomSlider = new ol.control.ZoomSlider();
		var fullScreen = new ol.control.FullScreen();

		var layers1 = [];
		for(var i in couches) {
			layers1[i]=couches[i];
		}
		layers1[layers1.length]=FS.main.vectorLayer;

		var layers2 = [];
		for(var i= 0; i < FS.main.donnees.length; i++) {
			layers2[i]=couches[i+FS.main.donnees.length];
		}
		layers2[layers2.length]=FS.main.vectorLayer;
		
		FS.main.map1 = new ol.Map({
			target: 'carte1', // cible de la carte
			layers: layers1,
			view: 
				FS.main.vue,
			controls: [new ol.control.Zoom,scaleLine,zoomSlider]
		});	
		
		FS.main.map2 = new ol.Map({
			target: 'carte2', // cible de la carte
			layers: layers2,
			view: 
				FS.main.vue,
			controls: []
		});
		
/**--------------------------------------------------------------
	Message d'alerte pour IE 
----------------------------------------------------------------*/
		
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		if (isIE) {
			$('#ie_avertissement').css("visibility", "visible");
			
			$('body').keypress(function(e){
				if(e.which == 27){
					$('#ie_avertissement').css("visibility", "hidden");
				}
			});
		};

		
/**----------------------------------------------------------------------
	Initialisation de la hauteur des cartes en fonction des navigateurs 
-----------------------------------------------------------------------*/
		
		var hauteur = FS.main.HauteurCarte();
		$("#carte1").css("height", hauteur);
		$("#carte2").css("height", hauteur);
		$("#toolbar").css("height", hauteur);
		FS.main.map1.updateSize();
		var offset = $( "#contenu" ).offset();
		$("#chercheAdresse").css('top', offset.top+17);
		$("#listeAdresses").css('top', offset.top+57);	

/**--------------------------------------------------------------
	Fonction d'initialisation et déclaration de varibles
----------------------------------------------------------------*/
		
		FS.main.initControls(); // Initialisation des contrôles
		FS.main.initEvents(); // Initialisation des évènements de cartes et taille de fenêtre de navigateur

		var CompareCote = '';
		var CompareSuperpose = '';
		var CompareSwitcher = '';		
		var ModeMesure = '';
		var ModeCoord = '';
		var Impression ='off';
		
		var draw;
		var sketch;
		
		FS.main.Switch(); // initialisation avec l'outil pour switcher
		
	
	},

/**--------------------------------------------------------------
	Fonction d'initialisation des évènements
----------------------------------------------------------------*/
	initEvents: function () {
					
		FS.main.map1.on("singleclick", function (e) {
			$("#listeAdresses").hide(800);
			$("#listeAdresses").html('');
			$("#adresse").val('');
		});
				
		$(window).resize(function () {	
			if (window.resizeMapUpdateTimer) {
				clearTimeout(window.resizeMapUpdateTimer)
			}
			window.resizeMapUpdateTimer= setTimeout(function () {
			var hauteur = FS.main.HauteurCarte();
			//console.log('height '+hauteur );
			$("#carte1").css("height", hauteur);
			$("#carte2").css("height", hauteur);
			$("#toolbar").css("height", hauteur);
			FS.main.map1.updateSize();
			FS.main.map2.updateSize();
			var offset = $("#contenu").offset()
			//console.log('offset '+offset.top)
			$("#chercheAdresse").css('top', offset.top+17);
			$("#croix").css('top', offset.top+17);
			$("#listeAdresses").css('top', offset.top+52);			
			}, 100)
		})
	},

	
/**--------------------------------------------------------------
	Fonction d'initialisation des contrôles
----------------------------------------------------------------*/
	initControls: function () {

		$.widget( "custom.combobox", {
			_create: function() {
				this.wrapper = $( "<span>" )
				  .addClass( "custom-combobox" )
				  .insertAfter( this.element );
		 
				this.element.hide();
				this._createAutocomplete();
				this._createShowAllButton();
				this._hoverOption();
				this._endhoverOption();
			},
	 
			_hoverOption: function() {
				var input = this.input;
				input.autocomplete( "widget" ).each(function() {
					$(this).on('mouseenter', "li", function(){
						FS.main.Combobox_hover(this);
					});

				});
			},
			
			_endhoverOption: function() {
				var input = this.input;
				input.autocomplete( "widget" ).each(function() {
					$(this).on('mouseleave', "li", function(){
						FS.main.Combobox_endhover(this);
					});

				});
			},
	 
			_createAutocomplete: function() {
				var selected = this.element.children( ":selected" ),
				value = selected.val() ? selected.text() : "";
	 
				this.input = $( "<input>" )
					.appendTo( this.wrapper )
					.val( value )
					.attr( "title", "" )
					.addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: $.proxy( this, "_source" )
					})
					.tooltip({
						classes: {
							"ui-tooltip": "ui-state-highlight"
						}
					});
	 
				this._on( this.input, {
					autocompleteselect: function( event, ui ) {
						ui.item.option.selected = true;
						this._trigger( "select", event, {
							item: ui.item.option
						});
					},
	 
				autocompletechange: "_removeIfInvalid"
				});
			},
	 
		    _createShowAllButton: function() {
				var input = this.input,
				  wasOpen = false;
		 
				$( "<a>" )
				    .attr( "tabIndex", -1 )
				    //.attr( "title", "Montrer tous les \u00e9l\u00e9ments" )
				    .tooltip()
				    .appendTo( this.wrapper )
				    .button({
						icons: {
						  primary: "ui-icon-triangle-1-s"
						},
						text: false
				    })
				    .removeClass( "ui-corner-all" )
				    .addClass( "custom-combobox-toggle ui-corner-right" )
				    .on( "mousedown", function() {
						wasOpen = input.autocomplete( "widget" ).is( ":visible" );
				    })
				    .on( "click", function() {
						input.trigger( "focus" );
		 
						// Close if already visible
						if ( wasOpen ) {
							return;
						}
		 
						// Pass empty string as value to search for, displaying all results
						input.autocomplete( "search", "" );
				    });
		    },
	 
		    _source: function( request, response ) {
				var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
				response( this.element.children( "option" ).map(function() {
				    var text = $( this ).text();
				    if ( this.value && ( !request.term || matcher.test(text) ) )
						return {
						    label: text,
						    value: text,
						    option: this
						};
				}) );
		    },
	 
		    _removeIfInvalid: function( event, ui ) {
	 
				// Selected an item, nothing to do
				if ( ui.item ) {
				    return;
				}
		 
				// Search for a match (case-insensitive)
				var value = this.input.val(),
				  valueLowerCase = value.toLowerCase(),
				  valid = false;
				this.element.children( "option" ).each(function() {
				    if ( $( this ).text().toLowerCase() === valueLowerCase ) {
						this.selected = valid = true;
						return false;
				    }
				});
		 
				// Found a match, nothing to do
				if ( valid ) {
				    return;
				}
		 
				// Remove invalid value
				this.input
				    .val( "" )
				    .attr( "title", value + " ne correspond \u00e0 aucun \u00e9l\u00e9ment" )
				    .tooltip( "open" );
				this.element.val( "" );
				this._delay(function() {
				    this.input.tooltip( "close" ).attr( "title", "" );
				}, 2500 );
				this.input.autocomplete( "instance" ).term = "";
		    },
	 
		    _destroy: function() {
				this.wrapper.remove();
				this.element.show();
		    }

		});
 		
		$('#adresse').on('input', function(e) {
			FS.main.chercheAdresse();
		});		
		$('#annul_adresse').on('click', function(e) {
			$("#listeAdresses").hide(400);
			$("#listeAdresses").html('');
			$("#adresse").val('');
			$("#annul_adresse").hide(0);
		});

		$( "#ImageGauche" ).combobox({
		    select: function (event, ui) {
				var indexG = $("#ImageGauche").prop('selectedIndex');			
				/*if (indexG == $("#ImageDroite").prop('selectedIndex')) {
					if ($("#ImageDroite").prop('selectedIndex') == $("#ImageDroite option").length-1) {
						$('#ImageDroite option')[0].selected = true;
						console.log(custom.combobox.input.value())
					} else {
						$('#ImageDroite option')[indexG+1].selected = true;
					}
				}*/
				FS.main.ChoixImage();				
			}
		});

	$( "#ImageDroite" ).combobox({
		    select: function (event, ui) {
				var indexD = $("#ImageDroite").prop('selectedIndex');
				/*if (indexD == $("#ImageGauche").prop('selectedIndex')) {
					if ($("#ImageGauche").prop('selectedIndex') == $("#ImageGauche option").length-1) {
						$('#ImageGauche option')[0].selected = true;
					} else {
						$('#ImageGauche option')[indexD+1].selected = true;
					}
				}*/
				FS.main.ChoixImage();	
			}
		});
				
		$('#btnIG').on('click', function(e) {
			var lien = FS.main.Metadonnes($('#ImageGauche').val());
			window.open(lien);		
		});
		$('#btnLG').on('click', function(e) {
			var nom_couche_WMS;
			var URL_couche_WMS;
			var titre_couche_WMS;
			for(var i in FS.main.donnees) {
				if (FS.main.donnees[i][0] == $('#ImageGauche').val()) {
					nom_couche_WMS= FS.main.donnees[i][3];
					URL_couche_WMS= FS.main.donnees[i][2];
					titre_couche_WMS= FS.main.donnees[i][1];
				} 
			};

			Limg = URL_couche_WMS+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+nom_couche_WMS+"&LEGEND_OPTIONS=fontColor:0x505050;fontAntiAliasing:true";
			var hauteur = FS.main.HauteurCarte()-150;
			var LegendWindow = window.open("", "_blank", "width=450,height="+hauteur+",menubar=0,status=0,titlebar=0,toolbar=0");
			LegendWindow.document.write("<html><head><title>Légende</title></head><span style='font-family:arial;color:#31455d;font-size:160%;'>Légende</span><p style='font-family:arial;color:#505050;'>"+titre_couche_WMS+"</p><img src="+Limg+">");	
		});

		$('#btnLD').on('click', function(e) {
			var nom_couche_WMS;
			var URL_couche_WMS;
			var titre_couche_WMS;
			for(var i in FS.main.donnees) {
				if (FS.main.donnees[i][0] == $('#ImageDroite').val()) {
					nom_couche_WMS= FS.main.donnees[i][3];
					URL_couche_WMS= FS.main.donnees[i][2];
					titre_couche_WMS= FS.main.donnees[i][1];
				} 
			};

			Dimg = URL_couche_WMS+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+nom_couche_WMS+"&LEGEND_OPTIONS=fontColor:0x505050;fontAntiAliasing:true";
			var hauteur = FS.main.HauteurCarte()-150;
			var LegendWindow = window.open("", "_blank", "width=450,height="+hauteur+",menubar=0,status=0,titlebar=0,toolbar=0");
			LegendWindow.document.write("<html><head><title>Légende</title></head><span style='font-family:arial;color:#31455d;font-size:160%;'>Légende</span><p style='font-family:arial;color:#505050;'>"+titre_couche_WMS+"</p><img src="+Dimg+">");	
		});									   
		
		$('#btnID').on('click', function(e) {
			var lien = FS.main.Metadonnes($('#ImageDroite').val());
			window.open(lien);		
		});
		
		$('#btnCote').on('click', function(e) {
			FS.main.Cote();				
		});		
		$("#btnCote").hover(function(){
			$(this).css("background-color", "#46cfc0");
			}, function(){
			if (FS.main.CompareCote == 'oui') {
				$(this).css("background-color", "#fbaf17");
			} else {
				$(this).css("background-color", "transparent");
			}
		});
		
		$('#btnSuperpose').on('click', function(e) {
			FS.main.Superpose();			
		});		
		$("#btnSuperpose").hover(function(){
			$(this).css("background-color", "#46cfc0");
			}, function(){
			if (FS.main.CompareSuperpose == 'oui') {
				$(this).css("background-color", "#fbaf17");
			} else {
				$(this).css("background-color", "transparent");
			}
		});
		
		$('#btnSwitcher').on('click', function(e) {
			FS.main.Switch();			
		});			
		$("#btnSwitcher").hover(function(){
			$(this).css("background-color", "#46cfc0");
			}, function(){
			if (FS.main.CompareSwitcher == 'oui') {
				$(this).css("background-color", "#fbaf17");
			} else {
				$(this).css("background-color", "transparent");
			}
		});
		
		$("#btnMesureDistance").hover(function(){
			$(this).css("background-color", "#46cfc0");
			if (FS.main.CompareCote == 'oui') {
				$('#tt_avertissement').css({
					"visibility": "visible",
					"top": "450px",
					"animation-name": "avert_anim",
					"animation-duration": "1s",
					"animation-fill-mode": "forwards"
				});
			}
			}, function(){
			$('#tt_avertissement').css({
				"visibility": "hidden",
				"animation-name": "",
				"animation-duration": "",
				"animation-fill-mode": ""
			});
			if (FS.main.ModeMesure == 'Distance') {
				$(this).css("background-color", "#fbaf17");
			} else {
				$(this).css("background-color", "transparent");
			}
		});
		$('#btnMesureDistance').on('click', function(e) {
			if (FS.main.ModeMesure == 'Distance') {
				FS.main.map1.removeInteraction(FS.main.draw);
				FS.main.ModeMesure = ''
				btnMesureDistance.style.background = 'transparent';
				FS.main.mesure.clear();
				FS.main.map1.getOverlays().clear();
				FS.main.map2.getOverlays().clear();
			} else {
				FS.main.map1.removeInteraction(FS.main.draw);
				btnMesureDistance.style.background = '#fbaf17';
				btnMesureSurface.style.background = 'transparent';				
				FS.main.ModeMesure = 'Distance'
				FS.main.Mesure();
			}
		});

		$("#btnMesureSurface").hover(function(){
			$(this).css("background-color", "#46cfc0");
			if (FS.main.CompareCote == 'oui') {
				$('#tt_avertissement').css({
					"visibility": "visible",
					"top": "520px",
					"animation-name": "avert_anim",
					"animation-duration": "1s",
					"animation-fill-mode": "forwards"
				});
			}
			}, function(){
			$('#tt_avertissement').css({
				"visibility": "hidden",
				"animation-name": "",
				"animation-duration": "",
				"animation-fill-mode": ""
			});
			if (FS.main.ModeMesure == 'Surface') {
				$(this).css("background-color", "#fbaf17");
			} else {
				$(this).css("background-color", "transparent");
			}
		});
		$('#btnMesureSurface').on('click', function(e) {
			if (FS.main.ModeMesure == 'Surface') {
				FS.main.map1.removeInteraction(FS.main.draw);
				FS.main.ModeMesure = ''
				btnMesureSurface.style.background = 'transparent';
				FS.main.mesure.clear();
				FS.main.map1.getOverlays().clear();
				FS.main.map2.getOverlays().clear();
			} else {
				FS.main.map1.removeInteraction(FS.main.draw);
				btnMesureSurface.style.background = '#fbaf17';
				btnMesureDistance.style.background = 'transparent';				
				FS.main.ModeMesure = 'Surface'
				FS.main.Mesure();
			}		
		});
		
		$("#btnCoordonnees").on('click', function(e) {
			FS.main.Coordonnees();
		});		
		$("#btnCoordonnees").hover(function(){
			$(this).css("background-color", "#46cfc0");			
			}, function(){
			if (FS.main.ModeCoord == 'actif') {
				$(this).css("background-color", "#fbaf17");

			} else {
				$(this).css("background-color", "transparent");
			}
		});
		
		$('#btnTelecharger').on('click', function(e) {
			FS.main.Telecharger();	
		});
		

		$("#btnImprimer").hover(function(){
			}, function(){
			if (FS.main.Impression == 'on') {
				document.body.style.cursor = 'default';
			} 
		});
		$('#btnImprimer').on('click', function(e) {
			if (FS.main.Impression != 'on') {
				FS.main.Imprimer();	
			}
		});
	
	},
	
/**--------------------------------------------------------------
	Fonctions des outils
----------------------------------------------------------------*/
	
	Cote: function () {
		
		if (FS.main.CompareCote != 'oui') { // mise en place de l'interface de cette méthode
			btnCote.style.background = '#fbaf17';		
			$('#croix').css("visibility","visible");
			console.log($(document).width())
			var moitie = ($(document).width() - 62)/2
			console.log('cote');
			$( "#carte1" ).animate({width: moitie},800, function() {
				FS.main.map1.updateSize();
			});
			$( "#carte2" ).animate({width: moitie}, 800, function() {
				FS.main.map2.updateSize();
			});
		};		
		FS.main.CompareCote = 'oui';	
		
		if (FS.main.CompareSwitcher = 'oui') { // ôter l'interface de la méthode switcher
			$('#switcher').hide(800);
			$('#swipe').val(1);
			FS.main.CompareSwitcher = 'non'
			btnSwitcher.style.background = 'transparent';
			};
		if (FS.main.CompareSuperpose = 'oui') { // ôter l'interface de la méthode superposition
			$('#opaciteG').hide(800);
			$('#opaciteD').hide(800);
			FS.main.map1.getLayers().forEach(function(layerCourant){
				layerCourant.setOpacity(1);             
			});			
			FS.main.map2.getLayers().forEach(function(layerCourant){
				layerCourant.setOpacity(1);             
			});
			FS.main.CompareSuperpose = 'non'		
			btnSuperpose.style.background = 'transparent';
		};
		
		FS.main.ChoixImage();
		
		/* gestion du curseur de la carte opposée */
		function updateCursorA(e) {
			updateCursor(e, (window.innerWidth / 2)-31);
		}
		function updateCursorB(e) {
			updateCursor(e, -(window.innerWidth / 2)+31);
		}
		function updateCursor(e, offset){
			// the 16 is here to position to the center of the cursor icon in, not the top left of the cursor image		
			//console.log(e.clientY);
			if (e.clientY >=  window.innerHeight-16) {
				//console.log('toto');
				e.clientY = window.innerHeight-16;
			}			
			var cursor_top = e.clientY-16+'px';
			var cursor_left = offset + e.clientX-16+'px';
			cursor.style.left = cursor_left;
			cursor.style.top = cursor_top;
		}		
		$('#carte1').on('mousemove', function(e) {
			updateCursorA(e);
		});
		$('#carte2').on('mousemove', function(e) {
			updateCursorB(e);
		});
	},
	
	Superpose: function () {
		if (FS.main.CompareCote == 'oui') {	// ôter l'interface de la méthode côte à côte
			var ecran = $(document).width()-100;
			$( "#carte1" ).animate({width: ecran},200, function() {
				carte1.style.width = 'calc(100% - 62px)';	
				FS.main.map1.updateSize();
				
			});
			$( "#carte2" ).animate({width: '0px'}, 200, function() {
				FS.main.map2.updateSize();
			});
			$('#croix').css("visibility","hidden");		
			$('#carte1').unbind('mousemove');
			$('#carte2').unbind('mousemove');
			
			FS.main.CompareCote = 'non'
			btnCote.style.background = 'transparent';
		};	
				
		if (FS.main.CompareSuperpose != 'oui') {  // mettre en place l'interface de cette méthode			
			btnSuperpose.style.background = '#fbaf17';		
			$('#opaciteG').show(800);
			$('#opaciteD').show(800);			
			FS.main.CompareSuperpose = 'oui';	
		
			FS.main.ChoixImage();
			
			$('#opaciteGauche').on('input', function() {
				FS.main.ChoixOpacite();
			});	
			$('#opaciteDroite').on('input', function() {
				FS.main.ChoixOpacite();
			});					
		} else {
			if (FS.main.CompareSwitcher == 'oui') { // si cette méthode était déjà active, ôter l'interface de cette méthode et réinitialiser l'opacité	
				btnSuperpose.style.background = 'transparent';	
				$('#opaciteG').hide(800);
				$('#opaciteD').hide(800);
				FS.main.map1.getLayers().forEach(function(layerCourant){
					layerCourant.setOpacity(1);             
				});
				
				FS.main.map2.getLayers().forEach(function(layerCourant){
					layerCourant.setOpacity(1);             
				});				
				FS.main.CompareSuperpose = 'non';
				FS.main.ChoixImage();
			};
		};	
	},
	
	Switch: function () {
		if (FS.main.CompareCote == 'oui') {	  // ôter l'interface de la méthode côte à côte
			var ecran = $(document).width()-100;
			$( "#carte1" ).animate({width: ecran},200, function() {
				carte1.style.width = 'calc(100% - 62px)';	
				FS.main.map1.updateSize();
				
			});
			$( "#carte2" ).animate({width: '0px'}, 200, function() {
				FS.main.map2.updateSize();
			});
			$('#croix').css("visibility","hidden");		
			$('#carte1').unbind('mousemove');
			$('#carte2').unbind('mousemove');
			
			FS.main.CompareCote = 'non'
			btnCote.style.background = 'transparent';
		};

		if (FS.main.CompareSwitcher != 'oui') {  // mettre en place l'interface de cette méthode
			btnSwitcher.style.background = '#fbaf17';
			$('#switcher').show(800);
			FS.main.CompareSwitcher = 'oui';
			
			FS.main.ChoixImage();		
			
			$('#swipe').val(0.5);
			var swipe = $('#swipe').val();
				
			$('#swipe').on('input', function(e) { // gestion du curseur
				var choixImageGauche = $('#ImageGauche').val();		
				var ImageGauche = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
					return layer.get('name') == choixImageGauche;
				})[0];	
				ImageGauche.on('precompose', function(e) {
					var ctxG = e.context;
					var swipe = $('#swipe').val();
					if (swipe === undefined) {
						swipe = 1;
					}
					var width = ctxG.canvas.width * (swipe);
					ctxG.save();
					ctxG.beginPath();
					ctxG.rect(0,0,width,ctxG.canvas.height);
					ctxG.clip();			
				});			
				ImageGauche.on('postcompose', function(e) {
					var ctxG = e.context;
					ctxG.restore();
				});
				FS.main.map1.render();
			});							
		} else {
			if (FS.main.CompareSuperpose == 'oui') {   // si cette méthode était déjà active, ôter l'interface de cette méthode et réinitialiser le curseur	
				btnSwitcher.style.background = 'transparent';
				$('#switcher').hide(800);
				$('#swipe').val(1);
				FS.main.CompareSwitcher = 'non';
				FS.main.ChoixImage();
			};
		};
	},
	
	Coordonnees: function () {

		if (FS.main.ModeCoord != 'actif') {  // mettre en place l'interface de cet outil
			console.log('false');
			btnCoordonnees.style.background = '#fbaf17';
			$('#zoneCoordonnees').show(800);
			
			FS.main.map1.addControl(new ol.control.MousePosition({ // gestion de la position du curseur sur la carte de gauche en WGS84
				coordinateFormat: function(coord) {
					return ol.coordinate.toStringHDMS(coord,2).split('N')[1]+', '+ol.coordinate.toStringHDMS(coord,2).split('N')[0]+' N';
				},
				projection: 'EPSG:4326',
				className: 'custom-mouse-position',
				target : $('#coordGeo')[0],
				undefinedHTML: ''
			}));
			FS.main.map1.addControl(new ol.control.MousePosition({ // gestion de la position du curseur sur la carte de gauche en RGF93
				coordinateFormat: function (coord) {
					return ol.coordinate.format(coord, '{x} m, {y} m', 2);
				},
				projection: 'EPSG:2154',
				className: 'custom-mouse-position',
				target: $('#coordRGF')[0],
				undefinedHTML: ''
			}));
			FS.main.map2.addControl(new ol.control.MousePosition({ // gestion de la position du curseur sur la carte de droite en WGS84
				coordinateFormat: function(coord) {
					return ol.coordinate.toStringHDMS(coord,2).split('N')[1]+', '+ol.coordinate.toStringHDMS(coord,2).split('N')[0]+' N';
				},
				projection: 'EPSG:4326',
				className: 'custom-mouse-position',
				target : $('#coordGeo')[0],
				undefinedHTML: ''
			}));
			FS.main.map2.addControl(new ol.control.MousePosition({ // gestion de la position du curseur sur la carte de droite en RGF93
				coordinateFormat: function (coord) {
					return ol.coordinate.format(coord, '{x} m, {y} m', 2);
				},
				projection: 'EPSG:2154',
				className: 'custom-mouse-position',
				target: $('#coordRGF')[0],
				undefinedHTML: ''
			}));
			FS.main.ModeCoord = 'actif';
		} else {												// si cette méthode était déjà active, ôter l'interface de cette méthode
			btnCoordonnees.style.background = 'transparent';
			$('#zoneCoordonnees').hide(800);
			FS.main.map1.removeControl(FS.main.map1.getControls().getArray()[3]);
			FS.main.map1.removeControl(FS.main.map1.getControls().getArray()[3]);
			FS.main.map2.removeControl(FS.main.map1.getControls().getArray()[3]);
			FS.main.map2.removeControl(FS.main.map1.getControls().getArray()[3]);
			FS.main.ModeCoord = '';
		}
	},
	
	Telecharger: function () {
		FS.main.map1.once('postcompose', function(e) { // télécharge en PNG la carte de gauche
		var canvas = e.context.canvas;
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(canvas.msToBlob(), 'carte1.png');
		} else {
			canvas.toBlob(function(blob) {
			saveAs(blob, 'carte1.png');
			});
		}
		});
		FS.main.map1.renderSync();	
		
		if (FS.main.CompareCote == 'oui') {
			FS.main.map2.once('postcompose', function(e) { // télécharge en PNG la carte de droite
			var canvas = e.context.canvas;
			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(canvas.msToBlob(), 'carte2.png');
			} else {
				canvas.toBlob(function(blob) {
				window.open(blob);
				saveAs(blob, 'carte2.png');
				});
			}
			});
			FS.main.map2.renderSync();
		}
	},
	
	Imprimer: function () {
		
		// initialisation de l'IU
		document.body.style.cursor = 'progress';
		$("#imprimerPatientez").css("visibility","visible");
		FS.main.Impression = 'on';
	
		/**------------------------------------
		Mise en page du PDF
		-------------------------------------*/
		var pdf = new jsPDF('landscape', undefined, 'a4');
		var imgData = 'data:image/png;base64,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';
		pdf.addImage(imgData, 'PNG', 12, 12, 57, 11);
		pdf.setFont('helvetica');
		pdf.setFontSize(23);
		pdf.setTextColor(49, 69, 93);
		pdf.setFontType('bold');
		pdf.text(102, 19, 'Strasbourg au fil du temps...')
		pdf.setFontSize(10);
		pdf.setTextColor(0);
		pdf.text(12, 35, 'Image de gauche :');
		pdf.text(150, 35, 'Image de droite :');
		pdf.setFontType('normal');		
		pdf.text(44, 35, $( "#ImageGauche option:selected" ).text());
		pdf.text(179, 35, $( "#ImageDroite option:selected" ).text());
		pdf.text(121, 35, '(');
		pdf.setFontSize(9);
		var metaG = FS.main.Metadonnes($('#ImageGauche').val());
		var metaD = FS.main.Metadonnes($('#ImageDroite').val());
		pdf.textWithLink('metadonnees', 122, 35, { url: metaG });
		pdf.text(142, 35, ')');
		pdf.text(258, 35, '(');
		pdf.textWithLink('metadonnees', 259, 35, { url: metaD });
		pdf.text(279, 35, ')');		
		pdf.text(12, 198, 'Direction Urbanisme et territoires - service Geomatique et connaissance du territoire - ');
		pdf.textWithLink('www.sig-strasbourg.eu', 133, 198, { url: 'http://www.sig.strasbourg.eu' });
		pdf.text(167, 198, '- Contact :');
		pdf.textWithLink('geomatique@strasbourg.eu', 182, 198, { url: "mailto:geomatique@strasbourg.eu?&subject=Comparaison d'images historiques" });
		
		/**------------------------------------
		Définition des variables
		-------------------------------------*/
		var size1 = FS.main.map1.getSize();
		var extent1 = FS.main.map1.getView().calculateExtent(size1);
		var size2 = FS.main.map2.getSize();
		var extent2 = FS.main.map2.getView().calculateExtent(size2);
		
		let loading1 = 0;
		let loaded1 = 0;
		let loading2 = 0;
		let loaded2 = 0;
		var carte1 = 0;
		var carte2 = 0;
		
		console.log('avant '+size1);

		var width = 1594;
		if (FS.main.CompareCote == 'oui') {
			width = width/2;
		}
		var height = 880;

		var choixImageGauche = $('#ImageGauche').val();		
		var ImageGauche = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
			return layer.get('name') == choixImageGauche;
		})[0];
			
		var choixImageDroite = $('#ImageDroite').val();
		if (FS.main.CompareCote == 'oui' || FS.main.CompareSwitcher == 'oui') {
			choixImageDroite = choixImageDroite += '_BIS';
			var ImageDroite = jQuery.grep(FS.main.map2.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
		} else {
			var ImageDroite = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
		}
		
		var source1 = ImageGauche.getSource();
		var source2 = ImageDroite.getSource();
		
		//source1.set('transition', 0);
        //source2.set('transition', 0);
		
		
		/**------------------------------------
		enregistrement des cartes aux bonnes dimensions après chargement des dalles
		-------------------------------------*/
		var tileLoadStart1 = function() {
			//console.log('loading1')
			++loading1;
		};
		
		var tileLoadStart2 = function() {
			//console.log('loading2')
			++loading2;
		};

		var tileLoadEnd1 = function() {
		  ++loaded1;
		  if (loading1 === loaded1) {
			var canvas = this;
			window.setTimeout(function() {
			    loading1 = 0;
			    loaded1 = 0;
			    var data = canvas.toDataURL('image/png');
			    console.log('image1');
				if (FS.main.CompareCote != 'oui') {
					pdf.addImage(data, 'JPEG', 12, 42, 270, 149);
				} else {
					pdf.addImage(data, 'JPEG', 12, 42, 135, 149);
				}
				carte1 = 1;
				console.log('carte1 '+carte1);
			    GenerePDF();
			    source1.un('tileloadstart', tileLoadStart1);
			    source1.un('tileloadend', tileLoadEnd1, canvas);
			    source1.un('tileloaderror', tileLoadEnd1, canvas);
			}, 3000);
		  }
		};
		
		var tileLoadEnd2 = function() {
		  ++loaded2;
		  if (loading2 === loaded2) {
			var canvas = this;
			window.setTimeout(function() {
			    loading2 = 0;
			    loaded2 = 0;
			    var data = canvas.toDataURL('image/png');
			    //console.log(FS.main.CompareCote);
			  	if (FS.main.CompareCote == 'oui') {
					pdf.addImage(data, 'JPEG', 147, 42, 135, 149);
				}
				carte2 = 1;
				console.log('carte2 '+carte2);
				GenerePDF();
			    source2.un('tileloadstart', tileLoadStart2);
			    source2.un('tileloadend', tileLoadEnd2, canvas);
			    source2.un('tileloaderror', tileLoadEnd2, canvas);
			}, 3000);
		  }
		};
		
		
		if (FS.main.CompareCote == 'oui') {
			FS.main.map1.once('postcompose', function(event) {
				//console.log('loading1 started');
				source1.on('tileloadstart', tileLoadStart1);
				source1.on('tileloadend', tileLoadEnd1, event.context.canvas);
				source1.on('tileloaderror', tileLoadEnd1, event.context.canvas);
			});
			FS.main.map2.once('postcompose', function(event) {
				//console.log('loading2 started');
				source2.on('tileloadstart', tileLoadStart2);
				source2.on('tileloadend', tileLoadEnd2, event.context.canvas);
				source2.on('tileloaderror', tileLoadEnd2, event.context.canvas);
			});
		} else {
			FS.main.map1.once('postcompose', function(event) {
				//console.log('loading2 started');
				source1.on('tileloadstart', tileLoadStart1);
				source1.on('tileloadend', tileLoadEnd1, event.context.canvas);
				source1.on('tileloaderror', tileLoadEnd1, event.context.canvas);
				source2.on('tileloadstart', tileLoadStart2);
				source2.on('tileloadend', tileLoadEnd2, event.context.canvas);
				source2.on('tileloaderror', tileLoadEnd2, event.context.canvas);
			});
		}
	
		console.log('pendant '+width+'*'+height);
		FS.main.map1.setSize([width, height]);
		FS.main.map1.getView().fit(extent1, {nearest: true});
		FS.main.map1.renderSync();
		
		if (FS.main.CompareCote == 'oui') {
			FS.main.map2.setSize([width, height]);
			FS.main.map2.getView().fit(extent2, {nearest: true});
			FS.main.map2.renderSync();
		}
		
		source1.refresh();
		source2.refresh();
		
		function GenerePDF () { // génération du PDF
			
			//console.log('carte1 '+carte1+' - carte2 '+carte2);
			if (carte1==1 && carte2==1 && FS.main.Impression == 'on') {
				carte1=0;
				carte2=0;
				FS.main.Impression = 'off';
				window.setTimeout(function() {
				console.log('apres'+size1)
			    FS.main.map1.setSize(size1);
			    FS.main.map1.getView().fit(extent1, {nearest: true});
			    FS.main.map1.renderSync();
			    if (FS.main.CompareMeCote == 'oui') {
					FS.main.map2.setSize(size2);
					FS.main.map2.getView().fit(extent2, {nearest: true});
					FS.main.map2.renderSync();
				}
					pdf.save('Strasbourg au fil du temps.pdf');
					document.body.style.cursor = 'auto';
					$("#imprimerPatientez").css("visibility","hidden");					
		//source1.set('transition', 'default');
        //source2.set('transition', 'default')
					/*$("#ProgressG.element.style").css({
						"visibility": 'hidden',
						"width":"0",
					});
					$("#ProgressD").css({
						"visibility": 'hidden',
						"width":"0",
					});*/
			}, 3500);
			}
			
		};
		
		
		/**------------------------------------
		barre de progression du chargement des dalles
		-------------------------------------*/

		/* @param {Element} el The target element.
		* @constructor
		*/
		function ProgressG(el) {
			this.el = el;
			this.loadingG = 0;
			this.loadedG = 0;
        }
	    function ProgressD(el) {
			this.el = el;
			this.loadingD = 0;
			this.loadedD = 0;
        }


		/* Increment the count of loading tiles.   */
		ProgressG.prototype.addLoading = function() {
			if (this.loadingG === 0) {
				this.show();
			}
        ++this.loadingG;
        this.update();
        };
	    ProgressD.prototype.addLoading = function() {
        if (this.loadingD === 0) {
			this.show();
        }
        ++this.loadingD;
        this.update();
		};


		/* Increment the count of loaded tiles.   */
		ProgressG.prototype.addLoaded = function() {
			var this_ = this;
			setTimeout(function() {
				++this_.loadedG;
				this_.update();
			}, 100);
        };
	    ProgressD.prototype.addLoaded = function() {
			var this_ = this;
			setTimeout(function() {
				++this_.loadedD;
				this_.update();
			}, 100);
        };


		/* Update the progress bar.    */
		ProgressG.prototype.update = function() {			
			var width = (this.loadedG / this.loadingG * 100).toFixed(1) + '%';
			this.el.style.width = width;
			if (this.loadingG === this.loadedG) {
				this.loadingG = 0;
				this.loadedG = 0;
				var this_ = this;
				setTimeout(function() {
					this_.hide();
				}, 500);
			}
        };
		ProgressD.prototype.update = function() {
			var width = (this.loadedD / this.loadingD * 100).toFixed(1) + '%';
			this.el.style.width = width;
			if (this.loadingD === this.loadedD) {
				this.loadingD = 0;
				this.loadedD = 0;
				var this_ = this;
				setTimeout(function() {
					this_.hide();
				}, 500);
			}
        };

		/* Show the progress bar.   */
		ProgressG.prototype.show = function() {
			this.el.style.visibility = 'visible';
		};
		ProgressD.prototype.show = function() {
			this.el.style.visibility = 'visible';
		};

		/*  Hide the progress bar.  */
		ProgressG.prototype.hide = function() {
			if (this.loadingG === this.loadedG && this.loadingD === this.loadedD) {
				this.el.style.visibility = 'hidden';
				this.el.style.width = 0;
			}
		};
		ProgressD.prototype.hide = function() {
			if (this.loadingG === this.loadedG && this.loadingD === this.loadedD) {
				this.el.style.visibility = 'hidden';
				this.el.style.width = 0;
			}
		};

		var progressG = new ProgressG(document.getElementById('progressG'));
		var progressD = new ProgressD(document.getElementById('progressD'));

		source1.once('tileloadstart', function() {
			progressG.addLoading();
		});
		source2.once('tileloadstart', function() {
			progressD.addLoading();
		});
		source1.once('tileloadend', function() {
			progressG.addLoaded();
		});
		source2.once('tileloadend', function() {
			progressD.addLoaded();
		});
		source1.once('tileloaderror', function() {
			progressG.addLoaded();
		});
		source2.once('tileloaderror', function() {
			progressD.addLoaded();
		});
				
	},
	
	HauteurCarte: function () { // définit les hauteurs de carte en fonction des navigateurs
		
		// Opera 8.0+
		var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		// Firefox 1.0+
		var isFirefox = typeof InstallTrigger !== 'undefined';
		// Safari 3.0+ "[object HTMLElementConstructor]" 
		var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
		// Internet Explorer 6-11
		var isIE = /*@cc_on!@*/false || !!document.documentMode;
		// Edge 20+
		var isEdge = !isIE && !!window.StyleMedia;
		// Chrome 1-71
		var isChrome = !!window.chrome && !!window.chrome.webstore;
		
		if (isOpera) {
			return window.innerHeight-106;
		};
		if (isFirefox) {
			return window.innerHeight-106;
		};
		if (isChrome) {
			return window.innerHeight-106;
		};
		if (isEdge) {
			return window.innerHeight-106;
		};
		return window.innerHeight-106;						
	},
		
	chercheAdresse: function (e) {
		var adresse = $('#adresse').val();
		var url = 'http://adict.strasbourg.eu/addok/search?q=' + adresse;
		
		if(adresse.length>2) {
			$("#annul_adresse").show(0);
			$.getJSON(url, function(data) {
				$("#listeAdresses").html('');
				$("#listeAdresses").append("<div id='listeAdresses'>")
				for (var i = 0; i<data.features.length ; i++) {
					var f = data.features[i];
					var nomAdresse = data.features[i].properties.label;
					$("#listeAdresses").append("<div class='resultatAdresse' id='f"+i+"'>"+nomAdresse + "</div>");
					$(document).on('click',"#f"+i,{geometrie: data.features[i].geometry},FS.main.zoomAdresse);
				}
				$("#listeAdresses").append('</div>');
				if (data.features.length > 0) {
					$("#listeAdresses").show(400);
				} else {
					$("#listeAdresses").hide(400);
				}
			});
		}
		else {
			$("#listeAdresses").hide(400);
			$("#listeAdresses").html('');
			$("#annul_adresse").hide(0);
		}
	},
	
	zoomAdresse: function(e) { // zoom sur les coordonnées du point adresse identifié
		FS.main.vue.setCenter(ol.proj.fromLonLat([e.data.geometrie.coordinates[0],e.data.geometrie.coordinates[1]]));
		FS.main.vue.setZoom(18);
		$("#adresse").val('');
		$("#listeAdresses").hide(800);
		$("#listeAdresses").html('');
	},
	
	Combobox_hover: function (input) {
		$("#apercu").html('');
		var apercu = input.innerText;
		for (var i in FS.main.donnees) {
			if (apercu == FS.main.donnees[i][1]) {
				$("#apercu").html('<img src="img/'+FS.main.donnees[i][0]+'.jpg"/>');
				$("#apercu").show(0);	
			}			
		};
	},
	
	Combobox_endhover: function (input) {
		$("#apercu").hide(0)
	},
	
	Metadonnes: function (choixImage) { // retourne le bon lien de métadonnées en fonction du choix de couche	
		for(var i in FS.main.donnees) {
			if (FS.main.donnees[i][0] == choixImage) {
				return FS.main.donnees[i][4];
			}
		}
	},
	
	ChoixImage: function () { // gère le changement de couche dans les menus de sélection
		
		// rendre toutes les couches invisibles
		FS.main.map1.getLayers().forEach(function(l) {
				l.setVisible(false);
		});	
		FS.main.map2.getLayers().forEach(function(l) {
				l.setVisible(false);
		});
		FS.main.vectorLayer.setVisible(true);
		
		// Mise en avant des images choisies à gauche et droite & de la couche vectorielles de meseure		
		var choixImageDroite = $('#ImageDroite').val();
		if (FS.main.CompareCote == 'oui' || FS.main.CompareSwitcher == 'oui') {
			choixImageDroite = choixImageDroite += '_BIS';
			var ImageDroite = jQuery.grep(FS.main.map2.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
			ImageDroite.setZIndex( 1000 );
		} else {
			var ImageDroite = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
			ImageDroite.setZIndex( 1000 );
		}
		var choixImageGauche = $('#ImageGauche').val();		
		var ImageGauche = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
			return layer.get('name') == choixImageGauche;
		})[0];			
		ImageGauche.setZIndex( 1001 );
		FS.main.vectorLayer.setZIndex( 1020 );
		
		// rendre les couches sélectionnées visibles
		ImageGauche.setVisible(true);
		ImageDroite.setVisible(true);
	
		// Mise en place de l'image coupée par curseur si ce mode est actif
		if (FS.main.CompareSwitcher == 'oui') {								
			var swipe = $('#swipe').val();
			ImageGauche.on('precompose', function(e) {
				var ctxG = e.context;
				var swipe = $('#swipe').val();
				if (swipe === undefined) {
					swipe = 1;
				}
				var width = ctxG.canvas.width * (swipe);							
				ctxG.save();
				ctxG.beginPath();
				ctxG.rect(0,0,width,ctxG.canvas.height);
				ctxG.clip();			
			});				
			ImageGauche.on('postcompose', function(e) {
				var ctxG = e.context;
				ctxG.restore();
			});			
			FS.main.map1.render();			
		};
		
		// Changer l'opacité des couches si ce mode est actif
		if (FS.main.CompareSuperpose == 'oui') {
			FS.main.ChoixOpacite();					
		};
		
		// Affiche le bouton d'info uniquement s'il existe un lien de métadonnées
		for(var i in FS.main.donnees) {
			if (String(FS.main.donnees[i][4]).length > 1 && FS.main.donnees[i][0] == choixImageGauche) {
				$('#btnIG').show(400);
				break;
			} else if (String(FS.main.donnees[i][4]).length <= 1 && FS.main.donnees[i][0] == choixImageGauche) {
				$('#btnIG').hide(400);
			}
		};
		for(var i in FS.main.donnees) {
			var choixImageDroite = choixImageDroite.replace('_BIS','');
			if (String(FS.main.donnees[i][4]).length > 1 && FS.main.donnees[i][0] == choixImageDroite) {
				$('#btnID').show(400);
				break;
			} else if (String(FS.main.donnees[i][4]).length <= 1 && FS.main.donnees[i][0] == choixImageDroite){
				$('#btnID').hide(400);
			}
		};
		
		// Affiche le bouton de légende si activé dans le fichier JSON
		for(var i in FS.main.donnees) {
			if (FS.main.donnees[i][5] == '1' && FS.main.donnees[i][0] == choixImageGauche) {
				$('#btnLG').show(400);
				break;
			} else if (FS.main.donnees[i][5] != '1' && FS.main.donnees[i][0] == choixImageGauche) {
				$('#btnLG').hide(400);
			}
		};
		for(var i in FS.main.donnees) {
			var choixImageDroite = choixImageDroite.replace('_BIS','');
			if (FS.main.donnees[i][5] == '1' && FS.main.donnees[i][0] == choixImageDroite) {
				$('#btnLD').show(400);
				break;
			} else if (FS.main.donnees[i][5] != '1' && FS.main.donnees[i][0] == choixImageDroite){
				$('#btnLD').hide(400);
			}
		};

	},

	ChoixOpacite: function () { // gère le changement d'opacité (utiliser avec le mode superposition)
		
		var choixImageGauche = $('#ImageGauche').val();		
		var ImageGauche = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
			return layer.get('name') == choixImageGauche;
		})[0];	
		var choixImageDroite = $('#ImageDroite').val();
		if (FS.main.CompareSwitcher == 'oui') {
			choixImageDroite = choixImageDroite += '_BIS';
			var ImageDroite = jQuery.grep(FS.main.map2.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
			ImageDroite.setZIndex( 1000 );
		} else {
			var ImageDroite = jQuery.grep(FS.main.map1.getLayers().getArray(), function(layer) {
				return layer.get('name') == choixImageDroite;
			})[0];
			ImageDroite.setZIndex( 1000 );
		}
		var opaciteGauche = $('#opaciteGauche').val();
		var opaciteDroite = $('#opaciteDroite').val();
		ImageGauche.setOpacity(opaciteGauche);
		ImageDroite.setOpacity(opaciteDroite);
	},

	Mesure: function () {
		
		FS.main.map1.un('pointermove', pointerMoveHandler);
		FS.main.vectorLayer.setZIndex(1020);

		var helpTooltipElement;
		var helpTooltip;
		var measureTooltipElement;
		var measureTooltip;
		var continuePolygonMsg = 'Cliquez pour continuer &agrave; dessiner la surface';
		var continueLineMsg = 'Cliquez pour continuer &agrave; dessiner la ligne';
		
		// gestion du pointeur et des messages d'aide
		var pointerMoveHandler = function(evt) {
		if (evt.dragging) {
		  return;
		}
		var helpMsg = 'Cliquez pour commencer &agrave; dessiner';

		if (FS.main.sketch) {
		  var geom = (FS.main.sketch.getGeometry());
		  if (geom instanceof ol.geom.Polygon) {
			helpMsg = continuePolygonMsg;
		  } else if (geom instanceof ol.geom.LineString) {
			helpMsg = continueLineMsg;
		  }
		}

		helpTooltipElement.innerHTML = helpMsg;
		helpTooltip.setPosition(evt.coordinate);
		helpTooltipElement.classList.remove('hidden');
		};
		FS.main.map1.on('pointermove', pointerMoveHandler);
		
		FS.main.map1.getViewport().addEventListener('mouseout', function() {
		helpTooltipElement.classList.add('hidden');
		});

		// calcul de la longueur
		var formatLength = function(line) {
		var length = ol.Sphere.getLength(line);
		var output;
		if (length > 100) {
		  output = (Math.round(length / 1000 * 100) / 100) +
			  ' ' + 'km';
		} else {
		  output = (Math.round(length * 100) / 100) +
			  ' ' + 'm';
		}
		return output;
		};

		// calcul de l'aire
		var formatArea = function(polygon) {
		var area = ol.Sphere.getArea(polygon);
		var output;
		if (area > 10000) {
		  output = (Math.round(area / 1000000 * 100) / 100) +
			  ' ' + 'km<sup>2</sup>';
		} else {
		  output = (Math.round(area * 100) / 100) +
			  ' ' + 'm<sup>2</sup>';
		}
		return output;
		};

		// définition de l'outil de dessin & du style de dessin
		function addInteraction() {
		var type = (FS.main.ModeMesure == 'Surface' ? 'Polygon' : 'LineString');
		FS.main.draw = new ol.interaction.Draw({
		  source: FS.main.mesure,
		  type: type,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(70, 207, 192, 0.1)'
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(70, 207, 192, 0.9)',
              lineDash: [10, 10],
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 5,
              stroke: new ol.style.Stroke({
                color: 'rgba(70, 207, 192, 0.9)'
              }),
              fill: new ol.style.Fill({
                color: 'rgba(70, 207, 192, 0.2)'
              })
            })
          })
		});
		FS.main.map1.addInteraction(FS.main.draw);

		createMeasureTooltip();
		createHelpTooltip();

		// gestion du dessin
		var listener;
		FS.main.draw.on('drawstart',
			function(evt) {
			  // set sketch
			  FS.main.sketch = evt.feature;

			  var tooltipCoord = evt.coordinate;

			  listener = FS.main.sketch.getGeometry().on('change', function(evt) {
				var geom = evt.target;
				var output;
				if (geom instanceof ol.geom.Polygon) {
				  output = formatArea(geom);
				  tooltipCoord = geom.getInteriorPoint().getCoordinates();
				} else if (geom instanceof ol.geom.LineString) {
				  output = formatLength(geom);
				  tooltipCoord = geom.getLastCoordinate();
				}
				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			  });
			}, this);

		FS.main.draw.on('drawend',
			function() {
			  measureTooltipElement.className = 'tooltip tooltip-static';
			  measureTooltip.setOffset([0, -7]);
			  // unset sketch
			  FS.main.sketch = null;
			  // unset tooltip so that a new one can be created
			  measureTooltipElement = null;
			  createMeasureTooltip();
			  ol.Observable.unByKey(listener);
			}, this);
		}

		// infobulle d'aide
		function createHelpTooltip() {
		if (helpTooltipElement) {
		  helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'tooltip hidden';
		helpTooltip = new ol.Overlay({
		  element: helpTooltipElement,
		  offset: [15, 0],
		  positioning: 'center-left'
		});
		FS.main.map1.addOverlay(helpTooltip);
		}

		// infobulle de mesure
		function createMeasureTooltip() {
		if (measureTooltipElement) {
		  measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		}
		measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'tooltip tooltip-measure';
		measureTooltip = new ol.Overlay({
		  element: measureTooltipElement,
		  offset: [0, -15],
		  positioning: 'bottom-center'
		});
		FS.main.map1.addOverlay(measureTooltip);
		}

		addInteraction();	  	
	},
	

};

$(function() { //function permet de lancer le contenu lorsque la page est chargée
	// récupération des données dans le fichier donnees.json situé au même niveau que le fichier html
	$.getJSON("donnees.json", function(data) {
		FS.main.init(data);
	});
});