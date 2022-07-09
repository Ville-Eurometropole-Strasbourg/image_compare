//image_compare version 1.4

/**--------------------------------------------------------------
	Fonction d'initialisation des évènements
----------------------------------------------------------------*/
	

function initEvents() {
					
    FS.main.map1.on("singleclick", function (e) {
        $("#listeAdresses").hide(800);
        $("#listeAdresses").html('');
        $("#adresse").val('');
        $("#annul_adresse").hide(0);
    });
            
    $(window).resize(function () {	
        if (window.resizeMapUpdateTimer) {
            clearTimeout(window.resizeMapUpdateTimer)
        }
        window.resizeMapUpdateTimer= setTimeout(function () {
            var hauteur = HauteurCarte();
            $("#carte1").css("height", hauteur);
            $("#carte2").css("height", hauteur);
            $("#toolbar").css("height", htoolbar);
            FS.main.map1.updateSize();
            FS.main.map2.updateSize();
            var offset = $("#contenu").offset()
            $("#chercheAdresse").css('top', offset.top+17);
            $("#annul_adresse").css('top', offset.top+25);	
            $("#listeAdresses").css('top', offset.top+52);		
            
            if (FS.main.CompareCote == 1) {
                var largeur = LargeurCarte()/2;
                $("#carte1").css("width", largeur);
                $("#carte2").css("width", largeur);
                FS.main.map1.updateSize();
                FS.main.map2.updateSize();			
            }
        }, 10)
    })


    
}


/**--------------------------------------------------------------
Fonction d'initialisation des contrôles
----------------------------------------------------------------*/
function initControls() {

    for(let i = 0; i< FS.main.langage[0].length ; i++) {
        var j=i+1
        var btn_langue ="#L"+j
        $(btn_langue).html(FS.main.langage[0][i].toUpperCase());
        $(btn_langue).bind('click', function(e) {
            changeLangage(i);
        });
    };


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
                    Combobox_hover(this);
                });

            });
        },
        
        _endhoverOption: function() {
            var input = this.input;
            input.autocomplete( "widget" ).each(function() {
                $(this).on('mouseleave', "li", function(){
                    Combobox_endhover(this);
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
                .attr("disabled", "disabled") // modifié
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
                .attr( "title", value + " "+FS.main.langage[37][FS.main.langue] )
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
        chercheAdresse();
    });		
    $('#annul_adresse').on('click', function(e) {
        $("#listeAdresses").hide(400);
        $("#listeAdresses").html('');
        $("#adresse").val('');
        $("#annul_adresse").hide(0);
    });

    $( "#ImageGauche" ).combobox({
        select: function (event, ui) {
            ChoixImage();		
            ChangeImage	('G')	
        }
    });

    $( "#ImageDroite" ).combobox({
        select: function (event, ui) {
            ChoixImage();
            ChangeImage	('D')		
        }
    });
            
    $('#btnIG').on('click', function(e) {
        var lien = Metadonnees($('#ImageGauche').val());
        window.open(lien);		
    });
    $('#btnLG').on('click', function(e) {
        var nom_couche_WMS;
        var URL_couche_WMS;
        var titre_couche_WMS;
        for(var i in FS.main.donnees) {
            if (FS.main.donnees[i][0] == $('#ImageGauche').val()) {
                nom_couche_WMS= FS.main.donnees[i][2];
                URL_couche_WMS= FS.main.donnees[i][1];
                titre_couche_WMS= FS.main.donnees[i][5+FS.main.langue];
            } 
        };
        Limg = URL_couche_WMS+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+nom_couche_WMS+"&LEGEND_OPTIONS=fontColor:0x505050;fontAntiAliasing:true";
        var hauteur = HauteurCarte()-150;
        var LegendWindow = window.open("", "_blank", "width=500,height="+hauteur+",menubar=0,status=0,titlebar=0,toolbar=0");
        LegendWindow.document.write("<html><head><title>"+FS.main.langage[26][FS.main.langue]+"</title></head><span style='font-family:arial;color:"+background_color+";font-size:160%;'>"+FS.main.langage[26][FS.main.langue]+"</span><p style='font-family:arial;color:#505050;'>"+titre_couche_WMS+"</p><img src="+Limg+">");	
    });

    $('#btnLD').on('click', function(e) {
        var nom_couche_WMS;
        var URL_couche_WMS;
        var titre_couche_WMS;
        for(var i in FS.main.donnees) {
            if (FS.main.donnees[i][0] == $('#ImageDroite').val()) {
                nom_couche_WMS= FS.main.donnees[i][2];
                URL_couche_WMS= FS.main.donnees[i][1];
                titre_couche_WMS= FS.main.donnees[i][5+FS.main.langue];
            } 
        };

        Dimg = URL_couche_WMS+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER="+nom_couche_WMS+"&LEGEND_OPTIONS=fontColor:0x505050;fontAntiAliasing:true";
        var hauteur = HauteurCarte()-150;
        var LegendWindow = window.open("", "_blank", "width=500,height="+hauteur+",menubar=0,status=0,titlebar=0,toolbar=0");
        LegendWindow.document.write("<html><head><title>"+FS.main.langage[26][FS.main.langue]+"</title></head><span style='font-family:arial;color:"+background_color+";font-size:160%;'>"+FS.main.langage[26][FS.main.langue]+"</span><p style='font-family:arial;color:#505050;'>"+titre_couche_WMS+"</p><img src="+Dimg+">");	
    });									   
    
    $('#btnID').on('click', function(e) {
        var lien = Metadonnees($('#ImageDroite').val());
        window.open(lien);		
    });
    
    $("#imgbtnAide").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        }, function(){
        if (FS.main.AideKiosque == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    $('#imgbtnAide').on('click', function(e) {
        $(this).css("box-shadow", "none");
        if (FS.main.AideKiosque == 1) {
            FS.main.AideKiosque = 0
            imgbtnAide.style.background = 'transparent';
            $("#aide_kiosque").css("visibility", "hidden");
        } else {
            imgbtnAide.style.background = active_color;
            $("#aide_kiosque").css("visibility", "visible");			
            FS.main.AideKiosque = 1
        }
    });

    $('#btnCote').on('click', function(e) {
        Cote();
        $(this).css("box-shadow", "none");				
    });		
    $("#btnCote").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        }, function(){
        if (FS.main.CompareCote == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    
    $('#btnSuperpose').on('click', function(e) {
        Superpose();
        $(this).css("box-shadow", "none");			
    });		
    $("#btnSuperpose").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        }, function(){
        if (FS.main.CompareSuperpose == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    
    $('#btnSwitcher').on('click', function(e) {
        Switch();
        $(this).css("box-shadow", "none");			
    });			
    $("#btnSwitcher").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        }, function(){
        if (FS.main.CompareSwitcher == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    
    $("#btnMesureDistance").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        if (FS.main.CompareCote == 1) {
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
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    $('#btnMesureDistance').on('click', function(e) {
        $(this).css("box-shadow", "none");
        if (FS.main.ModeMesure == 'Distance') {
            FS.main.map1.removeInteraction(FS.main.draw);
            FS.main.ModeMesure = ''
            btnMesureDistance.style.background = 'transparent';
            FS.main.mesure.clear();
            FS.main.map1.getOverlays().clear();
            FS.main.map2.getOverlays().clear();
        } else {
            FS.main.map1.removeInteraction(FS.main.draw);
            btnMesureDistance.style.background = active_color;
            btnMesureSurface.style.background = 'transparent';				
            FS.main.ModeMesure = 'Distance'
            Mesure();
        }
    });

    $("#btnMesureSurface").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });
        if (FS.main.CompareCote == 1) {
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
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    $('#btnMesureSurface').on('click', function(e) {
        $(this).css("box-shadow", "none");
        if (FS.main.ModeMesure == 'Surface') {
            FS.main.map1.removeInteraction(FS.main.draw);
            FS.main.ModeMesure = ''
            btnMesureSurface.style.background = 'transparent';
            FS.main.mesure.clear();
            FS.main.map1.getOverlays().clear();
            FS.main.map2.getOverlays().clear();
        } else {
            FS.main.map1.removeInteraction(FS.main.draw);
            btnMesureSurface.style.background = active_color;
            btnMesureDistance.style.background = 'transparent';				
            FS.main.ModeMesure = 'Surface'
            Mesure();
        }		
    });
    
    $("#btnCoordonnees").on('click', function(e) {
        Coordonnees();
        $(this).css("box-shadow", "none");
    });		
    $("#btnCoordonnees").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });		
        }, function(){
        if (FS.main.ModeCoord == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    
    $('#btnTelecharger').on('click', function(e) {
        if (chargementCap == 1) {
            Telecharger();	
        }
    });
    
    $("#btnImprimer").hover(function(){
        }, function(){
        if (FS.main.Impression == 1 && chargementCap == 1) {
            document.body.style.cursor = 'default';
        } 
    });
    $('#btnImprimer').on('click', function(e) {
        if (FS.main.Impression != 1 && chargementCap == 1) {
            Imprimer();	
        }
    });

    $("#btnPermalien").on('click', function(e) {
        Permaliens();
        $(this).css("box-shadow", "none");
    });		
    $("#btnPermalien").hover(function(){
        $(this).css({
            "background-color": highlight_color,
            "box-shadow":"2px 2px 10px var(--highlight-color-alpha), -2px -2px 10px var(--highlight-color-alpha)"
        });				
        }, function(){
        if (FS.main.ModePermalien == 1) {
            $(this).css({
                "background-color": active_color,
                "box-shadow": "none"
            });
        } else {
            $(this).css({
                "background-color": "transparent",
                "box-shadow": "none"
            });
        }
    });
    $("#copierP").on('click', function(e) {
        $("#clipboard").val(FS.main.permalien)
        $("#clipboard").css("visibility", "visible");
        var copyText = document.getElementById("clipboard")
        copyText.select();
        document.execCommand("copy");
        $("#clipboard").css("visibility", "hidden");
        $('#panneauPermalien').hide(400);
        btnPermalien.style.background = background_color;
        FS.main.ModePermalien = 0;
    });
    $("#emailP").on('click', function(e) {
        $('#panneauPermalien').hide(400);
        btnPermalien.style.background = background_color;
        FS.main.ModePermalien = 0;	
    });
    $("#annulerP").on('click', function(e) {
        $('#panneauPermalien').hide(400);
        btnPermalien.style.background = background_color;
        FS.main.ModePermalien = 0;	
    });
    
}