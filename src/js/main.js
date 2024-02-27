//image_compare version 1.6

var FS = FS || {}; //utilise l'objet FS s'il existe ou (||) créé un nouvel objet {}
var capabilities = new Array();
var chargementCap = 0;
var wtoolbar = 62;
var htoolbar;



FS.main = {

  init: function (tabdata, langageData, paramData) {
    //console.log("init");
    /**--------------------------------------------------------------
	Défintion des données à afficher, des paramètres et mise en place 
----------------------------------------------------------------*/

    // récupération des variables générales contenant les données et les traductions et affectation aux variables internes
    FS.main.donnees = tabdata;
    FS.main.langage = langageData;
    FS.main.param = paramData;

    /** ZONE DE TRANSFERT */

    /**--------------------------------------------------------------
	Récupération des paramètres
----------------------------------------------------------------*/

    for (var i in FS.main.param) {
      if (FS.main.param[i][0] == "Xmin") {
        FS.main.Xmin = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Ymin") {
        FS.main.Ymin = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Xmax") {
        FS.main.Xmax = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Ymax") {
        FS.main.Ymax = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "VueLon") {
        FS.main.VueLon = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "VueLat") {
        FS.main.VueLat = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Zmin") {
        FS.main.Zmin = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Zmax") {
        FS.main.Zmax = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "Zini") {
        FS.main.Zini = parseFloat(FS.main.param[i][1]);
      }
      if (FS.main.param[i][0] == "HostPlatformURL") {
        FS.main.HostPlatformURL = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "HostPlatformName") {
        FS.main.HostPlatformName = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "LocalCoordSysEPSG") {
        FS.main.LocalCoordSysEPSG = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "LocalCoordSysDef") {
        FS.main.LocalCoordSysDef = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "AdressSearchURL") {
        FS.main.AdressSearchURL = FS.main.param[i][1];
      }
      if (
        FS.main.param[i][0] ==
        "WMS URL for getcapabilities used for attributions and metadata (table of 2 values)"
      ) {
        FS.main.WmsURL = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "startImage1") {
        FS.main.startImage1 = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "startImage2") {
        FS.main.startImage2 = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "baseMap") {
        FS.main.baseMapC = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "administrativeDivision") {
        FS.main.administrativeDivisionC = FS.main.param[i][1];
      }
      if (FS.main.param[i][0] == "toponym") {
        FS.main.toponymC = FS.main.param[i][1];
      }
    }

    /**--------------------------------------------------------------
	Récupération des styles depuis le fichier CSS
----------------------------------------------------------------*/
    FS.main.background_color = getCSSVariable("--background-color");
    FS.main.background_color_alpha = getCSSVariable("--background-color-alpha");
    FS.main.highlight_color_alpha1 = getCSSVariable("--highlight-color-alpha1");
    FS.main.highlight_color_alpha2 = getCSSVariable("--highlight-color-alpha2");
    FS.main.active_color = getCSSVariable("--active-color");
    FS.main.active_color_alpha = getCSSVariable("--active-color-alpha");
    FS.main.background_color = getCSSVariable("--background-color");
    FS.main.shadow_color = getCSSVariable("--shadow-color");
    FS.main.alert_color_alpha = getCSSVariable("--alert-color-alpha");

    /**--------------------------------------------------------------
	Récupération des données d'URL (si elles existent) afin de 
	paramétrer l'interface et mise en place des images
----------------------------------------------------------------*/
    var URLparams = new URL(document.location).searchParams;
    if (URLparams != undefined) {
      var I1 = URLparams.get("I1");
      if (I1 != null) {
        if (I1 > 0 && I1 < FS.main.donnees.length - 1) {
          FS.main.startImage1 = I1 - 1;
          console.log(I1);
        } else {
          for (var i in FS.main.donnees) {
            if (FS.main.donnees[i][0] == I1) {
              FS.main.startImage1 = i - 1;
            }
          }
        }
      }
      var I2 = URLparams.get("I2");
      if (I2 != null) {
        if (I2 > 0 && I2 < FS.main.donnees.length - 1) {
          FS.main.startImage2 = I2 - 1;
        } else {
          for (var i in FS.main.donnees) {
            if (FS.main.donnees[i][0] == I2) {
              FS.main.startImage2 = i - 1;
            }
          }
        }
      }
    }

    /**--------------------------------------------------------------
	Déclaration des couches (couches BIS utilisées pour la carte
	de droite en mode côte à côte et la carte de dessous en
	mode switcher
----------------------------------------------------------------*/

    var source = [];
    var couches = [];
    var nb_couches = FS.main.donnees.length - 1;

    for (var i = 0; i < nb_couches; i++) {
      if (FS.main.donnees[i + 1][1] == "XYZ") {
        source[i] = new ol.source.XYZ({
          url: FS.main.donnees[i + 1][2],
          //crossOrigin: 'anonymous'
          type: "XYZ",
        });
      } else {
        source[i] = new ol.source.TileWMS({
          url: FS.main.donnees[i + 1][1],
          params: {
            LAYERS: FS.main.donnees[i + 1][2],
            TILED: true,
          },
          crossOrigin: "anonymous",
        });
      }
      couches[i] = new ol.layer.Tile({
        source: source[i],
        opacity: 1,
        name: FS.main.donnees[i + 1][0],
        visible: false,
      });
    }

    for (var i = 0; i < nb_couches; i++) {
      couches[FS.main.donnees.length - 1 + i] = new ol.layer.Tile({
        source: source[i],
        opacity: 1,
        name: FS.main.donnees[i + 1][0] + "_BIS",
        visible: false,
      });
    }

    /**--------------------------------------------------------------
	Couche des mesures
---------------------------------------------------------------*/

    FS.main.mesure = new ol.source.Vector();
    FS.main.vectorLayer = new ol.layer.Vector({
      source: FS.main.mesure,
      name: "Mesure_vector",
      visible: true,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: FS.main.active_color_alpha,
        }),
        stroke: new ol.style.Stroke({
          color: FS.main.active_color,
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
          color: FS.main.active_color,
          }),
        }),
      }),
    });

    /**--------------------------------------------------------------
	Couches d'habillage
---------------------------------------------------------------*/

    FS.main.baseMap = new ol.layer.Tile({ 
    source: new ol.source.XYZ({ 
        url:'http://{1-4}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    })
  })  
  FS.main.administrativeDivisionSource = new ol.source.TileWMS({
    url: 'https://wxs.ign.fr/administratif/geoportail/r/wms',
    params: {
      LAYERS: 'LIMITES_ADMINISTRATIVES_EXPRESS.LATEST',
      TILED: true,
    },
    crossOrigin: "anonymous",
  });
  FS.main.administrativeDivision = new ol.layer.Tile({
    source: FS.main.administrativeDivisionSource,
    opacity: 1,
    name: "administrativeDivision",
    visible: true,
  });

  FS.main.toponym = new ol.layer.Tile({ 
    source: new ol.source.XYZ({ 
        url:'http://{1-4}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    })
  });


    /**-------------------------------------------------------------------
	Paramétrage de la vue et des cartes (gauche = map1, droite = map2) 
---------------------------------------------------------------------*/
    if (URLparams != undefined) {
      var X = URLparams.get("X");
      var Y = URLparams.get("Y");
      var Z = URLparams.get("Z");
    }
    if (X != null && Y != null && Z != null) {
      Xmerc = ol.proj.fromLonLat([parseFloat(X), parseFloat(Y)])[0];
      Ymerc = ol.proj.fromLonLat([parseFloat(X), parseFloat(Y)])[1];
      if (
        Xmerc >= FS.main.Xmin &&
        Xmerc <= FS.main.Xmax &&
        Ymerc >= FS.main.Ymin &&
        Ymerc <= FS.main.Ymax
      ) {
        centerX = parseFloat(X);
        centerY = parseFloat(Y);
      } else {
        centerX = FS.main.VueLon;
        centerY = FS.main.VueLat;
      }
      if (parseFloat(Z) >= FS.main.Zmin && parseFloat(Z) <= FS.main.Zmax) {
        Zinitial = parseFloat(Z);
      } else {
        Zinitial = FS.main.Zini;
      }
      FS.main.vue = new ol.View({
        // création de la vue, par défaut en Mercator
        center: ol.proj.fromLonLat([centerX, centerY]),
        zoom: Zinitial, // niveau de zoom
        extent: [FS.main.Xmin, FS.main.Ymin, FS.main.Xmax, FS.main.Ymax], // étendue maximale du centre de la carte
        minZoom: FS.main.Zmin,
        maxZoom: FS.main.Zmax,
        enableRotation: false,
      });
    } else {
      FS.main.vue = new ol.View({
        // création de la vue, par défaut en Mercator
        center: ol.proj.fromLonLat([FS.main.VueLon, FS.main.VueLat]), // transformation des coordonnées en degrés vers Mercator
        zoom: FS.main.Zini, // niveau de zoom
        extent: [FS.main.Xmin, FS.main.Ymin, FS.main.Xmax, FS.main.Ymax], // étendue maximale du centre de la carte
        minZoom: FS.main.Zmin,
        maxZoom: FS.main.Zmax,
        enableRotation: false,
      });
    }

    var scaleLine = new ol.control.ScaleLine();
    var zoomSlider = new ol.control.ZoomSlider();
    var zoomTE = document.createElement("span");
    zoomTE.innerHTML = '<img src="img/globe.png" width="18" height="18">';
    var zoomExtent = new ol.control.ZoomToExtent({
      extent: [FS.main.Xmin, FS.main.Ymin, FS.main.Xmax, FS.main.Ymax],
      label: zoomTE,
    });

    //var fullScreen = new ol.control.FullScreen();

    var layers1 = [];
    for (var i in couches) {
      layers1[i] = couches[i];
    }
    layers1[layers1.length] = FS.main.vectorLayer;
    layers1[layers1.length] = FS.main.baseMap;
    layers1[layers1.length] = FS.main.administrativeDivision;
    layers1[layers1.length] = FS.main.toponym;

    var layers2 = [];
    for (var i = 0; i < FS.main.donnees.length - 1; i++) {
      layers2[i] = couches[i + FS.main.donnees.length - 1];
    }
    layers2[layers2.length] = FS.main.vectorLayer;
    layers2[layers2.length] = FS.main.baseMap;
    layers2[layers2.length] = FS.main.administrativeDivision;
    layers2[layers2.length] = FS.main.toponym;

    FS.main.map1 = new ol.Map({
      target: "carte1", // cible de la carte
      layers: layers1,
      view: FS.main.vue,
      controls: [new ol.control.Zoom(), zoomExtent, scaleLine, zoomSlider],
    });

    FS.main.map2 = new ol.Map({
      target: "carte2", // cible de la carte
      layers: layers2,
      view: FS.main.vue,
      controls: [],
    });

    /**--------------------------------------------------------------
	Message d'alerte pour IE 
----------------------------------------------------------------*/

    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    if (isIE) {
      $("#ie_avertissement").css("visibility", "visible");

      $("body").keypress(function (e) {
        if (e.which == 27) {
          $("#ie_avertissement").css("visibility", "hidden");
        }
      });
    }

    /**----------------------------------------------------------------------
	Initialisation de la hauteur des cartes en fonction des navigateurs 
-----------------------------------------------------------------------*/

    var hauteur = HauteurCarte();
    $("#carte1").css("height", hauteur);
    $("#carte2").css("height", hauteur);
    $("#toolbar").css("height", hauteur);
    FS.main.map1.updateSize();
    var offset = $("#contenu").offset();
    $("#chercheAdresse").css("top", offset.top + 17);
    $("#listeAdresses").css("top", offset.top + 57);
    $("#annul_adresse").css("top", offset.top + 25);
    htoolbar = hauteur;

    /**--------------------------------------------------------------
	Fonction d'initialisation
----------------------------------------------------------------*/

    FS.main.Kiosque = 0;

    // Initialisation des langues
    if (URLparams != undefined) {
      var L = URLparams.get("L"); //Récupération de la langue dans l'URL
    }
    if (navigator.userLanguage)
      //Si InternetExplorer v. < 11
      var x = navigator.userLanguage;
    else var x = navigator.language;

    var langueDefaut;
    for (var i = 0; i < FS.main.langage.length; i++) {
      if (FS.main.langage[i][0] == "default")
        langueDefaut = FS.main.langage[i][1]; // Récupération de la langue par défaut
    }

    if (L != null) {
      FS.main.langue = L - 1;
    } else {
      for (var i = 0; i < FS.main.langage[0].length; i++) {
        if (x.includes(FS.main.langage[0][i])) {
          FS.main.langue = i;
          break;
        } else {
          FS.main.langue = langueDefaut; // Page par défaut si la langue n'est pas reconnue.
        }
      }
    }
    changeLangage(FS.main.langue, "init"); // lance aussi la fonction FS.main.ChangeImage('A'); qui initialise de la lectures des attributions et metadonnées

    initControls(); // Initialisation des contrôles
    initEvents(); // Initialisation des évènements de cartes et taille de fenêtre de navigateur

    // initialisation de l'interface avec les données du permalien si elles existent
    if (URLparams != undefined) {
      var S = URLparams.get("S");
      var O1 = URLparams.get("O1");
      var O2 = URLparams.get("O2");
      var C = URLparams.get("C");
      var K = URLparams.get("K");
    }

    if (C == 1) {
      Cote();
    } else if (S != null) {
      Switch(S);
      if (O1 != null && O2 != null) {
        $("#opaciteGauche").val(O1);
        $("#opaciteDroite").val(O2);
        Superpose();
      }
    } else if (O1 != null && O2 != null) {
      $("#opaciteGauche").val(O1);
      $("#opaciteDroite").val(O2);
      Superpose();
    } else {
      Switch(); // initialisation avec l'outil pour switcher
    }
    if (URLparams != undefined) {
      var Coord = URLparams.get("Coord");
    }
    if (Coord == 1) {
      Coordonnees();
    }

    if (K == 1) {
      // initialisation du mode kiosque
      FS.main.Kiosque = 1;
      htoolbar = 330;
      $(".kiosk").css("display", "none");
      $("#toolbar").css({
        height: htoolbar + "px",
        position: "absolute",
        right: "0px",
        top: "80px",
      });
      $("a:has(img)").each(function () {
        $(this).replaceWith($(this).children());
      });
      wtoolbar = 0;
      $("#carte1").css("width", "100%");
      FS.main.map1.updateSize();
      $(".switchCompare").css("width", "100%");
      $("#logoAttributionD").css("right", "10px");
      $("#texteAttributionD").css("right", "10px");
      $(".aide_toolbar").css("visibility", "hidden");
      $("#btnAide").css("display", "block");
      changeLangage(FS.main.langue); // met à jour les informations
    }
  },
};

/** FIN DE ZONE DE TRANSFERT */

$(function () {
  //function permet de lancer le contenu lorsque la page est chargée
  // récupération des données dans les fichiers donnees.json, langage.json et param.json situés au même niveau que le fichier html
  var StreamsData, languageData, parameterData;
  $.when(
    $.getJSON("donnees.json", function (data) {
      StreamsData = data;
    }),
    $.getJSON("langage.json", function (data) {
      languageData = data;
    }),
    $.getJSON("param.json", function (data) {
      parameterData = data;
    })
  ).then(
    function () {
      if (StreamsData && languageData && parameterData) {
        FS.main.init(StreamsData, languageData, parameterData);
      } else {
        alert("Erreur de chargement / loading error");
      }
    },
    function () {
      window.location.href =
        "https://remonterletemps.strasbourg.eu/erreur.html";
    }
  );
});
