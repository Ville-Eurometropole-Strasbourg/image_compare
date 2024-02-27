//image_compare version 1.6

//Fichier des fonctions

function getCSSVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName);
}

function attribution(nom) {
  var attributions = new Array();
  for (i in capabilities) {
    $(capabilities[i])
      .find("Layer")
      .each(function () {
        var name = $(this).children("Name").text();
        if (name.includes(nom)) {
          attributions[0] = null;
          attributions[1] = null;
          var title1 = $(this).children("Attribution").children("Title").text();
          if (title1.length > 2 || title1 != "undefined") {
            attributions[0] = title1;
          } else {
            attributions[0] = null;
          }
          var logo1 = $(this)
            .children("Attribution")
            .children("LogoURL")
            .children("OnlineResource")
            .attr("xlink:href");
          if (logo1.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            attributions[1] = logo1;
          } else {
            attributions[1] = null;
          }
        }
      });
  }
  return attributions;
}

function definirMetadonnees(nom) {
  for (i in capabilities) {
    $(capabilities[i])
      .find("Layer")
      .each(function () {
        var name = $(this).children("Name").text();
        if (name.includes(nom)) {
          metadonnees = null;
          $(this)
            .children("MetadataURL")
            .each(function () {
              if ($(this).attr("type") == "ISO19115:2003") {
                var meta1 = $(this)
                  .children("OnlineResource")
                  .attr("xlink:href");
                if (
                  meta1.match(
                    /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
                  ) != null
                ) {
                  metadonnees = meta1;
                  return false;
                } else {
                  metadonnees = null;
                  return false;
                }
              }
            });
        }
      });
  }
  return metadonnees;
}

function changeLangage(langue, init) {
  // Mise en place des textes en fonction de la langue choisie

  FS.main.langue = langue;

  for (var i = 1; i < FS.main.donnees.length; i++) {
    if (FS.main.donnees[i][0] != "internal name") {
      if (init == "init") {
        $("#ImageGauche").append(
          $("<option>", {
            value: FS.main.donnees[i][0],
            text: FS.main.donnees[i][5 + langue],
          })
        );
        $("#ImageDroite").append(
          $("<option>", {
            value: FS.main.donnees[i][0],
            text: FS.main.donnees[i][5 + langue],
          })
        );
      } else {
        $("#ImageGauche option")[i - 1].text = FS.main.donnees[i][5 + langue];
        $("#ImageDroite option")[i - 1].text = FS.main.donnees[i][5 + langue];
      }
    }
    $(".custom-combobox-input").each(function () {
      nblangue = FS.main.langage[0].length;
      for (j = 5; j < 5 + nblangue; j++) {
        if (FS.main.donnees[i][j] == $(this).val()) {
          $(this).val(FS.main.donnees[i][5 + FS.main.langue]);
        }
      }
    });
  }

  if (init == "init") {
    $("#ImageGauche option")[FS.main.startImage1].selected = true;
    $("#ImageDroite option")[FS.main.startImage2].selected = true;
  }

  $("#label_titre").html(FS.main.langage[1][langue]);
  $("#contact_text").html(
    FS.main.langage[33][langue].replace(":", "").toUpperCase()
  );
  $("#comparer").html(FS.main.langage[2][langue]);
  $(".opaciteTexte").html(FS.main.langage[3][langue]);
  $("#avec").html(FS.main.langage[4][langue]);
  $("#adresse").attr("placeholder", FS.main.langage[5][langue]);
  $("#adresse").attr("alt", FS.main.langage[6][langue]);
  $("#baseMapLabel").html(FS.main.langage[45][langue]);
  $("#administrativeDivisionLabel").html(FS.main.langage[46][langue]);
  $("#toponymLabel").html(FS.main.langage[47][langue]);
  $("#labelGeo").html(FS.main.langage[7][langue]);
  $("#labelRGF").html(FS.main.langage[8][langue]);
  $("#imprimerPatientez").html(
    FS.main.langage[9][langue] +
      '<div class="progessBar" id="progressG"></div><div class="progessBar" id="progressD"></div>'
  );
  $("#tt_avertissement").html(FS.main.langage[10][langue]);
  $("#ie_avertissement").html(
    FS.main.langage[11][langue] +
      ' <a target="_blank" href="https://www.mozilla.org/fr/firefox/new/">Firefox</a>, <a target="_blank" href="https://www.google.fr/chrome/">Chrome</a>, <a target="_blank" href="https://www.microsoft.com/fr-fr/windows/microsoft-edge">Edge</a> ' +
      FS.main.langage[12][langue] +
      ' <a target="_blank" href="https://www.opera.com/fr">Opera</a>.<br /><br />' +
      FS.main.langage[13][langue]
  );
  $("#tt_Maison").html(FS.main.langage[14][langue]);
  $("#tt_Cartes").html(FS.main.langage[15][langue]);
  $("#tt_Cote").html(FS.main.langage[16][langue]);
  $("#tt_Superpose").html(FS.main.langage[17][langue]);
  $("#tt_Switcher").html(FS.main.langage[18][langue]);
  $("#tt_Distance").html(FS.main.langage[19][langue]);
  $("#tt_Surface").html(FS.main.langage[20][langue]);
  $("#tt_Coordonnees").html(FS.main.langage[21][langue]);
  $("#tt_PNG").html(FS.main.langage[22][langue]);
  $("#tt_Imprimer").html(FS.main.langage[23][langue]);
  if (FS.main.Kiosque == 0) {
    $("#plateforme").html(
      FS.main.langage[24][langue] +
        ' <a target="_blank" href="' +
        FS.main.HostPlatformURL +
        '">' +
        FS.main.HostPlatformName +
        "</a> " +
        FS.main.langage[25][langue]
    );
  } else {
    $("#plateforme").html(
      FS.main.langage[24][langue] +
        " " +
        FS.main.HostPlatformName +
        " " +
        FS.main.langage[25][langue]
    );
  }
  $("#tt_Permalien").html(FS.main.langage[38][FS.main.langue]);
  $("#titrePermalien").html(FS.main.langage[39][FS.main.langue]);
  $("#textePermalien").html(FS.main.langage[40][FS.main.langue]);
  $("#copierP").html(FS.main.langage[41][FS.main.langue]);
  $("#emailP").html(
    '<a target="_blank" href="mailto:?subject=' +
      encodeURIComponent(FS.main.langage[44][FS.main.langue]).replace(
        /'/g,
        "%27"
      ) +
      "&body=... " +
      encodeURIComponent(FS.main.langage[39][FS.main.langue]).replace(
        /'/g,
        "%27"
      ) +
      " : " +
      encodeURIComponent(FS.main.permalien).replace(/'/g, "%27") +
      '">' +
      FS.main.langage[42][FS.main.langue] +
      "</a>"
  );
  $("#annulerP").html(FS.main.langage[43][FS.main.langue]);
  $("#aide_kiosque").html(
    "1. " +
      FS.main.langage[16][langue] +
      "<br /><br />2. " +
      FS.main.langage[17][langue] +
      "<br /><br />3. " +
      FS.main.langage[18][langue] +
      "<br /><br />4. " +
      FS.main.langage[19][langue] +
      "<br /><br />5. " +
      FS.main.langage[20][langue]
  );

  for (let i = 0; i < FS.main.langage[0].length; i++) {
    // initialisation de l'apparence des boutons de langue
    var j = i + 1;
    var btn_langue = "#L" + j;
    $(btn_langue).css("background-color", "#FFFFFF");
    $(btn_langue).css("color", "#7e7e7e");

    $(btn_langue).hover(
      function () {
        $(this).css("background-color", "#7e7e7e");
        $(this).css("cursor", "pointer");
        $(this).css("color", "#FFFFFF");
      },
      function () {
        $(this).css("background-color", "#FFFFFF");
        $(this).css("color", "#7e7e7e");
      }
    );
  }

  langue = langue + 1; // modification de l'apparence du bouton de langue courante
  var btn_langue = "#L" + langue;
  $(btn_langue).css("background-color", FS.main.background_color);
  $(btn_langue).css("color", "#FFFFFF");
  $(btn_langue).hover(
    function () {
      $(this).css("background-color", FS.main.background_color);
      $(this).css("color", "#FFFFFF");
    },
    function () {
      $(this).css("background-color", FS.main.background_color);
      $(this).css("color", "#FFFFFF");
    }
  );

  ChangeImage("A");
}

function Cote() {
  // mise en place du mode côte à côte

  if (FS.main.CompareCote != 1) {
    // mise en place de l'interface de cette méthode
    btnCote.style.background = FS.main.active_color;
    $("#croix").css("visibility", "visible");
    var moitie = ($(document).width() - wtoolbar) / 2;
    $("#carte1").animate({ width: moitie }, 800, function () {
      FS.main.map1.updateSize();
    });
    $("#carte2").animate({ width: moitie }, 800, function () {
      FS.main.map2.updateSize();
    });
  }
  FS.main.CompareCote = 1;

  if (FS.main.CompareSwitcher == 1) {
    // ôter l'interface de la méthode switcher
    $("#switcher").hide(800);
    $("#swipe").val(1);
    FS.main.CompareSwitcher = 0;
    btnSwitcher.style.background = "transparent";
  }
  if (FS.main.CompareSuperpose == 1) {
    // ôter l'interface de la méthode superposition
    $("#opaciteG").hide(800);
    $("#opaciteD").hide(800);
    FS.main.map1.getLayers().forEach(function (layerCourant) {
      layerCourant.setOpacity(1);
    });
    FS.main.map2.getLayers().forEach(function (layerCourant) {
      layerCourant.setOpacity(1);
    });
    FS.main.CompareSuperpose = 0;
    btnSuperpose.style.background = "transparent";
  }

  ChoixImage();

  /* gestion du curseur de la carte opposée */
  function updateCursorA(e) {
    updateCursor(e, window.innerWidth / 2 - 31);
  }
  function updateCursorB(e) {
    updateCursor(e, -(window.innerWidth / 2) + 31);
  }
  function updateCursor(e, offset) {
    // the 16 is here to position to the center of the cursor icon in, not the top left of the cursor image
    if (e.clientY >= window.innerHeight - 16) {
      e.clientY = window.innerHeight - 16;
    }
    var cursor_top = e.clientY - 16 + "px";
    var cursor_left = offset + e.clientX - 16 + "px";
    cursor.style.left = cursor_left;
    cursor.style.top = cursor_top;
  }
  $("#carte1").on("mousemove", function (e) {
    updateCursorA(e);
  });
  $("#carte2").on("mousemove", function (e) {
    updateCursorB(e);
  });
}

function Superpose() {
  // mise en place du mode de superposition des images

  if (FS.main.CompareCote == 1) {
    // ôter l'interface de la méthode côte à côte
    var ecran = LargeurCarte() - 100;
    $("#carte1").animate({ width: ecran }, 800, function () {
      carte1.style.width = "calc(100% - " + wtoolbar + "px)";
      FS.main.map1.updateSize();
    });
    $("#carte2").animate({ width: "0px" }, 800, function () {
      FS.main.map2.updateSize();
    });
    $("#croix").css("visibility", "hidden");
    $("#carte1").unbind("mousemove");
    $("#carte2").unbind("mousemove");

    FS.main.CompareCote = 0;
    btnCote.style.background = "transparent";
  }

  if (FS.main.CompareSuperpose != 1) {
    // mettre en place l'interface de cette méthode
    btnSuperpose.style.background = FS.main.active_color;
    $("#opaciteG").show(800);
    $("#opaciteD").show(800);
    FS.main.CompareSuperpose = 1;

    ChoixImage();

    $("#opaciteGauche").on("input", function () {
      ChoixOpacite();
    });
    $("#opaciteDroite").on("input", function () {
      ChoixOpacite();
    });
  } else {
    if (FS.main.CompareSwitcher == 1) {
      // si cette méthode était déjà active, ôter l'interface de cette méthode et réinitialiser l'opacité
      btnSuperpose.style.background = "transparent";
      $("#opaciteG").hide(800);
      $("#opaciteD").hide(800);
      FS.main.map1.getLayers().forEach(function (layerCourant) {
        layerCourant.setOpacity(1);
      });

      FS.main.map2.getLayers().forEach(function (layerCourant) {
        layerCourant.setOpacity(1);
      });
      FS.main.CompareSuperpose = 0;
      ChoixImage();
    }
  }
}

function Switch(swipeURL) {
  // mise en place du mode avec réglette

  if (FS.main.CompareCote == 1) {
    // ôter l'interface de la méthode côte à côte
    var ecran = LargeurCarte() - 100;
    $("#carte1").animate({ width: ecran }, 800, function () {
      carte1.style.width = "calc(100% - " + wtoolbar + "px)";
      FS.main.map1.updateSize();
    });
    $("#carte2").animate({ width: "0px" }, 800, function () {
      FS.main.map2.updateSize();
    });
    $("#croix").css("visibility", "hidden");
    $("#carte1").unbind("mousemove");
    $("#carte2").unbind("mousemove");

    FS.main.CompareCote = 0;
    btnCote.style.background = "transparent";
  }

  if (FS.main.CompareSwitcher != 1) {
    // mettre en place l'interface de cette méthode
    btnSwitcher.style.background = FS.main.active_color;
    $("#switcher").show(800);
    FS.main.CompareSwitcher = 1;
    ChoixImage();

    if (swipeURL != null) {
      $("#swipe").val(swipeURL);
    } else {
      $("#swipe").val(0.5);
    }

    $("#swipe").on("input", function (e) {
      // gestion du curseur
      var choixImageGauche = $("#ImageGauche").val();
      var ImageGauche = jQuery.grep(
        FS.main.map1.getLayers().getArray(),
        function (layer) {
          return layer.get("name") == choixImageGauche;
        }
      )[0];
      ImageGauche.on("precompose", function (e) {
        var ctxG = e.context;
        var swipe = $("#swipe").val();
        if (swipe === undefined) {
          swipe = 1;
        }
        var width = ctxG.canvas.width * swipe;
        ctxG.save();
        ctxG.beginPath();
        ctxG.rect(0, 0, width, ctxG.canvas.height);
        ctxG.clip();
      });
      ImageGauche.on("postcompose", function (e) {
        var ctxG = e.context;
        ctxG.restore();
      });
      FS.main.map1.render();
    });
  } else {
    if (FS.main.CompareSuperpose == 1) {
      // si cette méthode était déjà active, ôter l'interface de cette méthode et réinitialiser le curseur
      btnSwitcher.style.background = "transparent";
      $("#switcher").hide(800);
      $("#swipe").val(1);
      FS.main.CompareSwitcher = 0;
      ChoixImage();
    }
  }
}

function Coordonnees() {
  if (FS.main.ModeCoord != 1) {
    // mettre en place l'interface de cet outil
    btnCoordonnees.style.background = FS.main.active_color;
    $("#zoneCoordonnees").show(800);

    proj4.defs("EPSG:" + FS.main.LocalCoordSysEPSG, FS.main.LocalCoordSysDef);
    ol.proj.setProj4(proj4);
    const RGF93 = ol.proj.get("EPSG:2154");

    FS.main.map1.addControl(
      new ol.control.MousePosition({
        // gestion de la position du curseur sur la carte de gauche en WGS84
        coordinateFormat: function (coord) {
          return (
            ol.coordinate.toStringHDMS(coord, 2).split("N")[1] +
            ", " +
            ol.coordinate.toStringHDMS(coord, 2).split("N")[0] +
            " N"
          );
        },
        projection: "EPSG:4326",
        className: "custom-mouse-position",
        target: $("#coordGeo")[0],
        undefinedHTML: "",
      })
    );
    FS.main.map1.addControl(
      new ol.control.MousePosition({
        // gestion de la position du curseur sur la carte de gauche en RGF93
        coordinateFormat: function (coord) {
          return ol.coordinate.format(coord, "{x} m, {y} m", 2);
        },
        projection: RGF93,
        className: "custom-mouse-position",
        target: $("#coordRGF")[0],
        undefinedHTML: "",
      })
    );
    FS.main.map2.addControl(
      new ol.control.MousePosition({
        // gestion de la position du curseur sur la carte de droite en WGS84
        coordinateFormat: function (coord) {
          return (
            ol.coordinate.toStringHDMS(coord, 2).split("N")[1] +
            ", " +
            ol.coordinate.toStringHDMS(coord, 2).split("N")[0] +
            " N"
          );
        },
        projection: "EPSG:4326",
        className: "custom-mouse-position",
        target: $("#coordGeo")[0],
        undefinedHTML: "",
      })
    );
    FS.main.map2.addControl(
      new ol.control.MousePosition({
        // gestion de la position du curseur sur la carte de droite en RGF93
        coordinateFormat: function (coord) {
          return ol.coordinate.format(coord, "{x} m, {y} m", 2);
        },
        projection: RGF93,
        className: "custom-mouse-position",
        target: $("#coordRGF")[0],
        undefinedHTML: "",
      })
    );
    FS.main.ModeCoord = 1;
  } else {
    // si cette méthode était déjà active, ôter l'interface de cette méthode
    btnCoordonnees.style.background = "transparent";
    $("#zoneCoordonnees").hide(800);
    FS.main.map1.removeControl(FS.main.map1.getControls().getArray()[3]);
    FS.main.map1.removeControl(FS.main.map1.getControls().getArray()[3]);
    FS.main.map2.removeControl(FS.main.map1.getControls().getArray()[3]);
    FS.main.map2.removeControl(FS.main.map1.getControls().getArray()[3]);
    FS.main.ModeCoord = 0;
  }
}

function Habillage() {
  if (FS.main.ModeHabillage != 1) {
    // mettre en place l'interface de cet outil
    $("#habillage").show(800);
    FS.main.ModeHabillage = 1;
  } else {
    // si cette méthode était déjà active, ôter l'interface de cette méthode
    btnHabillage.style.background = "transparent";
    $("#habillage").hide(800);
    FS.main.ModeHabillage = 0;
  }
}

function Permaliens() {
  if (FS.main.ModePermalien != 1 && FS.main.Impression != 1) {
    // mettre en place l'interface de cet outil
    btnPermalien.style.background = FS.main.active_color;
    $("#panneauPermalien").show(400);

    var L = FS.main.langue + 1;
    var I1 = FS.main.donnees[$("#ImageGauche").prop("selectedIndex") + 1][0];
    var I2 = FS.main.donnees[$("#ImageDroite").prop("selectedIndex") + 1][0];
    var center = ol.coordinate.format(
      ol.proj.transform(
        FS.main.map1.getView().getCenter(),
        "EPSG:3857",
        "EPSG:4326"
      ),
      "&X={x}&Y={y}",
      5
    );
    var Z = FS.main.map1.getView().getZoom();

    permalien =
      decodeURIComponent(location.host) +
      decodeURIComponent(location.pathname) +
      "?L=" +
      L +
      "&I1=" +
      I1 +
      "&I2=" +
      I2 +
      center +
      "&Z=" +
      Z;

    var C = FS.main.CompareCote;
    var S = FS.main.CompareSwitcher;
    var O = FS.main.CompareSuperpose;
    if (C == 1) {
      permalien = permalien + "&C=1";
    } else {
      if (S == 1) {
        permalien = permalien + "&S=" + $("#swipe").val();
      }
      if (O == 1) {
        permalien =
          permalien +
          "&O1=" +
          $("#opaciteGauche").val() +
          "&O2=" +
          $("#opaciteDroite").val();
      }
    }
    var Coord = FS.main.ModeCoord;
    if (Coord == 1) {
      permalien = permalien + "&Coord=1";
    }

    $("#URLPermalien").html(permalien);
    FS.main.permalien = permalien;
    $("#emailP").html(
      '<a target="_blank" href="mailto:?subject=' +
        encodeURIComponent(FS.main.langage[44][FS.main.langue]).replace(
          /'/g,
          "%27"
        ) +
        "&body=... " +
        encodeURIComponent(FS.main.langage[39][FS.main.langue]).replace(
          /'/g,
          "%27"
        ) +
        " : " +
        encodeURIComponent(FS.main.permalien).replace(/'/g, "%27") +
        '">' +
        FS.main.langage[42][FS.main.langue] +
        "</a>"
    );
    FS.main.ModePermalien = 1;
  } else {
    // si cette méthode était déjà active, ôter l'interface de cette méthode
    $("#panneauPermalien").hide(400);
    btnPermalien.style.background = FS.main.background_color;
    FS.main.ModePermalien = 0;
  }
}

function Telecharger() {
  var choixImageGauche = $("#ImageGauche").val();
  for (var i in FS.main.donnees) {
    if (FS.main.donnees[i][0] == choixImageGauche) {
      attribG = FS.main.donnees[i][4][0];
      logoGURL = FS.main.donnees[i][4][1];
      break;
    } else {
      attribG = null;
      logoGURL = null;
    }
  }
  var choixImageDroite = $("#ImageDroite").val();
  var choixImageDroite = $("#ImageDroite").val().replace("_BIS", "");
  for (var i in FS.main.donnees) {
    if (FS.main.donnees[i][0] == choixImageDroite) {
      attribD = FS.main.donnees[i][4][0];
      logoDURL = FS.main.donnees[i][4][1];
      break;
    } else {
      attribD = null;
      logoDURL = null;
    }
  }

  FS.main.map1.once("postcompose", function (e) {
    // télécharge en PNG la carte de gauche
    var canvas = e.context.canvas;
    var context = canvas.getContext("2d");
    var sizeWidth = context.canvas.clientWidth;
    var sizeHeight = context.canvas.clientHeight;

    fetch(logoGURL, { mode: 'no-cors' })
    .then((response) => response.blob())
    .then((blob) => {
      const imageUrlG = URL.createObjectURL(blob);
      var imageG = new Image();
      imageG.src = imageUrlG;
      
      fetch(logoDURL, { mode: 'no-cors' })
      .then((responseD) => responseD.blob())
      .then((blobD) => {
        const imageUrlD = URL.createObjectURL(blobD);
        var imageD = new Image();
        imageD.src = imageUrlD;
        
        if (logoGURL != null && logoGURL != 0) {
          
          imageG.setAttribute("crossOrigin", "Anonymous"); //getting images from external domain
          imageG.src = logoGURL;
          imageG.onload = function () {
            if (logoDURL != null && logoDURL != 0 && FS.main.CompareCote != 1) {
              
              imageD.setAttribute("crossOrigin", "Anonymous"); //getting images from external domain
  
                imageD.src = logoDURL;
                imageD.onload = function () {
                  context.drawImage(
                    imageG,
                    0,
                    sizeHeight - 66,
                    (imageG.width * 50) / imageG.height,
                    50
                  );
                  context.drawImage(
                    imageD,
                    sizeWidth / 2,
                    sizeHeight - 66,
                    (imageD.width * 50) / imageD.height,
                    50
                  );
                  definePNG(
                    canvas,
                    context,
                    attribG,
                    attribD,
                    sizeWidth,
                    sizeHeight,
                    "gauche"
                  );
                };
            } else {
              context.drawImage(
                imageG,
                0,
                sizeHeight - 66,
                (imageG.width * 50) / imageG.height,
                50
              );
              definePNG(
                canvas,
                context,
                attribG,
                attribD,
                sizeWidth,
                sizeHeight,
                "gauche"
              );
            }
          };
        } else {
          if (logoDURL != null && logoDURL != 0 && FS.main.CompareCote != 1) {
            var imageD = new Image();
            imageD.setAttribute("crossOrigin", "Anonymous"); //getting images from external domain
            imageD.src = logoDURL;
            imageD.onload = function () {
              context.drawImage(
                imageD,
                sizeWidth / 2,
                sizeHeight - 66,
                (imageD.width * 50) / imageD.height,
                50
              );
              definePNG(
                canvas,
                context,
                attribG,
                attribD,
                sizeWidth,
                sizeHeight,
                "gauche"
              );
            };
          } else {
            definePNG(
              canvas,
              context,
              attribG,
              attribD,
              sizeWidth,
              sizeHeight,
              "gauche"
            );
          }
        }


      })
      .catch(error => {
        if (error.name === 'TypeError' && error.message.includes('Network')) {
          console.error('A network error occurred. This could be a CORS issue or a dropped connection. Error:', error);
        } else {
          console.error('An unknown error occurred:', error);
        }
      });

    })
    .catch(error => {
      if (error.name === 'TypeError' && error.message.includes('Network')) {
        console.error('A network error occurred. This could be a CORS issue or a dropped connection. Error:', error);
      } else {
        console.error('An unknown error occurred:', error);
      }
    });


  
    }); 
    
  FS.main.map1.renderSync();

  if (FS.main.CompareCote == 1) {
    FS.main.map2.once("postcompose", function (e) {
      // télécharge en PNG la carte de droite
      var canvas = e.context.canvas;
      var context = canvas.getContext("2d");
      var sizeWidth = context.canvas.clientWidth;
      var sizeHeight = context.canvas.clientHeight;

      window.resizeMapUpdateTimer = setTimeout(function () {
        if (logoDURL != null && logoDURL != 0) {
          var imageD = new Image();
          imageD.setAttribute("crossOrigin", "Anonymous"); //getting images from external domain
          imageD.src = logoDURL;
          imageD.onload = function () {
            context.drawImage(
              imageD,
              0,
              sizeHeight - 66,
              (imageD.width * 50) / imageD.height,
              50
            );
            definePNG(
              canvas,
              context,
              attribD,
              attribD,
              sizeWidth,
              sizeHeight,
              "droite"
            );
          };
        } else {
          definePNG(
            canvas,
            context,
            attribD,
            attribD,
            sizeWidth,
            sizeHeight,
            "droite"
          );
        }
      }, 50);
    });
    FS.main.map2.renderSync();
  }

  function definePNG(
    canvas,
    context,
    attribG,
    attribD,
    sizeWidth,
    sizeHeight,
    carte
  ) {
    context.font = "10pt Calibri";
    context.fillStyle = "#ffffff";
    if (attribG != null && attribG != 0) {
      var widthG = context.measureText(attribG).width;
      context.fillRect(0, sizeHeight - 16, widthG + 6, 16);
      context.fillStyle = FS.main.background_color;
      context.fillText(attribG, 2, sizeHeight - 4);
    }
    context.fillStyle = "#ffffff";
    if (attribD != null && attribG != 0 && FS.main.CompareCote != 1) {
      var widthD = context.measureText(attribD).width;
      context.fillRect(sizeWidth / 2, sizeHeight - 16, widthD + 6, 16);
      context.fillStyle = FS.main.background_color;
      context.fillText(attribD, sizeWidth / 2 + 2, sizeHeight - 4);
    }
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(
        canvas.msToBlob(),
        FS.main.langage[27][FS.main.langue]
      );
    } else {
      console.log(carte);
      canvas.toBlob(function (blob) {
        if (carte == "gauche") {
          saveAs(blob, FS.main.langage[27][FS.main.langue]);
        } else if (carte == "droite") saveAs(blob, FS.main.langage[28][FS.main.langue]);
      });
    }
    FS.main.map1.renderSync();
    if (FS.main.CompareCote == 1) {
      FS.main.map2.renderSync();
    }
  }
}

function Imprimer() {
  // initialisation de l'IU
  document.body.style.cursor = "progress";
  $("#imprimerPatientez").css("visibility", "visible");
  FS.main.Impression = 1;

  /**------------------------------------
	Mise en page du PDF
	-------------------------------------*/
  var pdf = new jsPDF("landscape", undefined, "a4");
  var imgData =
    "data:image/png;base64,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";
  pdf.addImage(imgData, "PNG", 12, 8, 57, 11);
  pdf.setFont("helvetica");
  pdf.setFontSize(23);
  pdf.setTextColor(49, 69, 93);
  pdf.setFontType("bold");
  pdf.text(102, 16, FS.main.langage[1][FS.main.langue]);
  pdf.setFontSize(10);
  pdf.setTextColor(0);
  pdf.text(12, 24, FS.main.langage[29][FS.main.langue]);
  pdf.text(150, 24, FS.main.langage[30][FS.main.langue]);
  pdf.setFontType("normal");
  pdf.text(44, 24, $("#ImageGauche option:selected").text());
  pdf.text(179, 24, $("#ImageDroite option:selected").text());
  pdf.setFontSize(9);
  var metaG = Metadonnees($("#ImageGauche").val());
  var metaD = Metadonnees($("#ImageDroite").val());
  pdf.setTextColor(70, 207, 192);
  pdf.setDrawColor(70, 207, 192);
  if (metaG != null && metaG != 0) {
    pdf.textWithLink(FS.main.langage[31][FS.main.langue], 125, 28, {
      url: metaG,
    });
    pdf.line(
      125,
      29,
      125 + FS.main.langage[31][FS.main.langue].length * 1.6,
      29
    );
  }
  if (metaD != null && metaD != 0) {
    pdf.textWithLink(FS.main.langage[31][FS.main.langue], 267, 28, {
      url: metaD,
    });
    pdf.line(
      267,
      29,
      267 + FS.main.langage[31][FS.main.langue].length * 1.6,
      29
    );
  }
  pdf.setTextColor(0);

  var choixImageGauche = $("#ImageGauche").val();
  for (var i in FS.main.donnees) {
    if (FS.main.donnees[i][0] == choixImageGauche) {
      attribG = FS.main.donnees[i][4][0];
      logoGURL = FS.main.donnees[i][4][1];
      break;
    } else {
      attribG = null;
      logoGURL = null;
    }
  }
  var choixImageDroite = $("#ImageDroite").val();
  var choixImageDroite = $("#ImageDroite").val().replace("_BIS", "");
  for (var i in FS.main.donnees) {
    if (FS.main.donnees[i][0] == choixImageDroite) {
      attribD = FS.main.donnees[i][4][0];
      logoDURL = FS.main.donnees[i][4][1];
      break;
    } else {
      attribD = null;
      logoDURL = null;
    }
  }

  pdf.setFontSize(8);
  if (attribG != null && attribG != 0) {
    pdf.text(12, 28, attribG);
  }
  if (attribD != null && attribD != 0) {
    pdf.text(150, 28, attribD);
  }
  if (logoGURL != null && logoGURL != 0) {
    let logoG = null;
    getDataUri(logoGURL, function (dataUri) {
      logoG = dataUri;
      pdf.addImage(logoG, "image/jpeg", 12, 30, (imgW * 10) / imgH, 10);
    });
  }
  if (logoDURL != null && logoDURL != 0) {
    let logoD = null;
    getDataUri(logoDURL, function (dataUri) {
      logoD = dataUri;
      pdf.addImage(logoD, "image/jpeg", 150, 30, (imgW * 10) / imgH, 10);
    });
  }
  function getDataUri(url, cb) {
    var image = new Image();
    image.setAttribute("crossOrigin", "Anonymous"); //getting images from external domain

    image.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      imgW = canvas.width;
      imgH = canvas.height;

      //next three lines for white background in case png has a transparent background
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; /// set white fill style
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.getContext("2d").drawImage(this, 0, 0);
      cb(canvas.toDataURL("image/jpeg"));
    };
    image.src = url;
  }

  pdf.setFontSize(9);
  pdf.text(12, 198, FS.main.langage[32][FS.main.langue]);
  pdf.setTextColor(70, 207, 192);
  pdf.textWithLink("www.sig-strasbourg.eu", 170, 198, {
    url: "http://www.sig.strasbourg.eu",
  });
  pdf.line(170, 199, 203, 199);
  pdf.setTextColor(0);
  pdf.text(225, 198, FS.main.langage[33][FS.main.langue]);
  pdf.setTextColor(70, 207, 192);
  pdf.textWithLink("geomatique@strasbourg.eu", 240, 198, {
    url: "mailto:geomatique@strasbourg.eu?&subject=Comparaison d'images historiques",
  });
  pdf.line(240, 199, 279, 199);

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

  var width = 1594;
  if (FS.main.CompareCote == 1) {
    width = width / 2;
  }
  var height = 880;

  var choixImageGauche = $("#ImageGauche").val();
  var ImageGauche = jQuery.grep(
    FS.main.map1.getLayers().getArray(),
    function (layer) {
      return layer.get("name") == choixImageGauche;
    }
  )[0];

  var choixImageDroite = $("#ImageDroite").val();
  if (FS.main.CompareCote == 1 || FS.main.CompareSwitcher == 1) {
    choixImageDroite = choixImageDroite += "_BIS";
    var ImageDroite = jQuery.grep(
      FS.main.map2.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
  } else {
    var ImageDroite = jQuery.grep(
      FS.main.map1.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
  }

  var source1 = ImageGauche.getSource();
  var source2 = ImageDroite.getSource();

  /**------------------------------------
	enregistrement des cartes aux bonnes dimensions après chargement des dalles
	-------------------------------------*/
  var tileLoadStart1 = function () {
    ++loading1;
  };

  var tileLoadStart2 = function () {
    ++loading2;
  };

  var tileLoadEnd1 = function () {
    ++loaded1;
    if (loading1 === loaded1) {
      var canvas = this;
      window.setTimeout(function () {
        loading1 = 0;
        loaded1 = 0;
        var data = canvas.toDataURL("image/png");
        if (FS.main.CompareCote != 1) {
          pdf.addImage(data, "JPEG", 12, 42, 270, 149);
        } else {
          pdf.addImage(data, "JPEG", 12, 42, 135, 149);
        }
        carte1 = 1;
        GenerePDF();
        source1.un("tileloadstart", tileLoadStart1);
        source1.un("tileloadend", tileLoadEnd1, canvas);
        source1.un("tileloaderror", tileLoadEnd1, canvas);
      }, 3000);
    }
  };

  var tileLoadEnd2 = function () {
    ++loaded2;
    if (loading2 === loaded2) {
      var canvas = this;
      window.setTimeout(function () {
        loading2 = 0;
        loaded2 = 0;
        var data = canvas.toDataURL("image/png");
        if (FS.main.CompareCote == 1) {
          pdf.addImage(data, "JPEG", 147, 42, 135, 149);
        }
        carte2 = 1;
        GenerePDF();
        source2.un("tileloadstart", tileLoadStart2);
        source2.un("tileloadend", tileLoadEnd2, canvas);
        source2.un("tileloaderror", tileLoadEnd2, canvas);
      }, 3000);
    }
  };

  if (FS.main.CompareCote == 1) {
    FS.main.map1.once("postcompose", function (event) {
      source1.on("tileloadstart", tileLoadStart1);
      source1.on("tileloadend", tileLoadEnd1, event.context.canvas);
      source1.on("tileloaderror", tileLoadEnd1, event.context.canvas);
    });
    FS.main.map2.once("postcompose", function (event) {
      source2.on("tileloadstart", tileLoadStart2);
      source2.on("tileloadend", tileLoadEnd2, event.context.canvas);
      source2.on("tileloaderror", tileLoadEnd2, event.context.canvas);
    });
  } else {
    FS.main.map1.once("postcompose", function (event) {
      source1.on("tileloadstart", tileLoadStart1);
      source1.on("tileloadend", tileLoadEnd1, event.context.canvas);
      source1.on("tileloaderror", tileLoadEnd1, event.context.canvas);
      source2.on("tileloadstart", tileLoadStart2);
      source2.on("tileloadend", tileLoadEnd2, event.context.canvas);
      source2.on("tileloaderror", tileLoadEnd2, event.context.canvas);
    });
  }

  FS.main.map1.setSize([width, height]);
  FS.main.map1.getView().fit(extent1, { nearest: true });
  FS.main.map1.renderSync();

  if (FS.main.CompareCote == 1) {
    FS.main.map2.setSize([width, height]);
    FS.main.map2.getView().fit(extent2, { nearest: true });
    FS.main.map2.renderSync();
  }

  source1.refresh();
  source2.refresh();

  function GenerePDF() {
    // génération du PDF

    if (carte1 == 1 && carte2 == 1 && FS.main.Impression == 1) {
      carte1 = 0;
      carte2 = 0;
      FS.main.Impression = 0;
      window.setTimeout(function () {
        FS.main.map1.setSize(size1);
        FS.main.map1.getView().fit(extent1, { nearest: true });
        FS.main.map1.renderSync();
        if (FS.main.CompareCote == 1) {
          FS.main.map2.setSize(size2);
          FS.main.map2.getView().fit(extent2, { nearest: true });
          FS.main.map2.renderSync();
        }
        pdf.save(
          FS.main.langage[1][FS.main.langue].replace(/\.+/, "") + ".pdf"
        );
        document.body.style.cursor = "auto";
        $("#imprimerPatientez").css("visibility", "hidden");
      }, 3500);
    }
  }

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
  ProgressG.prototype.addLoading = function () {
    if (this.loadingG === 0) {
      this.show();
    }
    ++this.loadingG;
    this.update();
  };
  ProgressD.prototype.addLoading = function () {
    if (this.loadingD === 0) {
      this.show();
    }
    ++this.loadingD;
    this.update();
  };

  /* Increment the count of loaded tiles.   */
  ProgressG.prototype.addLoaded = function () {
    var this_ = this;
    setTimeout(function () {
      ++this_.loadedG;
      this_.update();
    }, 100);
  };
  ProgressD.prototype.addLoaded = function () {
    var this_ = this;
    setTimeout(function () {
      ++this_.loadedD;
      this_.update();
    }, 100);
  };

  /* Update the progress bar.    */
  ProgressG.prototype.update = function () {
    var width = ((this.loadedG / this.loadingG) * 100).toFixed(1) + "%";
    this.el.style.width = width;
    if (this.loadingG === this.loadedG) {
      this.loadingG = 0;
      this.loadedG = 0;
      var this_ = this;
      setTimeout(function () {
        this_.hide();
      }, 500);
    }
  };
  ProgressD.prototype.update = function () {
    var width = ((this.loadedD / this.loadingD) * 100).toFixed(1) + "%";
    this.el.style.width = width;
    if (this.loadingD === this.loadedD) {
      this.loadingD = 0;
      this.loadedD = 0;
      var this_ = this;
      setTimeout(function () {
        this_.hide();
      }, 500);
    }
  };

  /* Show the progress bar.   */
  ProgressG.prototype.show = function () {
    this.el.style.visibility = "visible";
  };
  ProgressD.prototype.show = function () {
    this.el.style.visibility = "visible";
  };

  /*  Hide the progress bar.  */
  ProgressG.prototype.hide = function () {
    if (this.loadingG === this.loadedG && this.loadingD === this.loadedD) {
      this.el.style.visibility = "hidden";
      this.el.style.width = 0;
    }
  };
  ProgressD.prototype.hide = function () {
    if (this.loadingG === this.loadedG && this.loadingD === this.loadedD) {
      this.el.style.visibility = "hidden";
      this.el.style.width = 0;
    }
  };

  var progressG = new ProgressG(document.getElementById("progressG"));
  var progressD = new ProgressD(document.getElementById("progressD"));

  source1.once("tileloadstart", function () {
    progressG.addLoading();
  });
  source2.once("tileloadstart", function () {
    progressD.addLoading();
  });
  source1.once("tileloadend", function () {
    progressG.addLoaded();
  });
  source2.once("tileloadend", function () {
    progressD.addLoaded();
  });
  source1.once("tileloaderror", function () {
    progressG.addLoaded();
  });
  source2.once("tileloaderror", function () {
    progressD.addLoaded();
  });
}

function HauteurCarte() {
  // définit les hauteurs de carte en fonction des navigateurs

  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";
  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );
  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;
  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;
  // Chrome 1-71
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  if (isOpera) {
    return window.innerHeight - 106;
  }
  if (isFirefox) {
    return window.innerHeight - 106;
  }
  if (isChrome) {
    return window.innerHeight - 106;
  }
  if (isEdge) {
    return window.innerHeight - 106;
  }
  return window.innerHeight - 106;
}

function LargeurCarte() {
  // définit les hauteurs de carte en fonction des navigateurs

  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== "undefined";
  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === "[object SafariRemoteNotification]";
    })(
      !window["safari"] ||
        (typeof safari !== "undefined" && safari.pushNotification)
    );
  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;
  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;
  // Chrome 1-71
  var isChrome = !!window.chrome && !!window.chrome.webstore;

  if (isOpera) {
    return window.innerWidth - wtoolbar;
  }
  if (isFirefox) {
    return window.innerWidth - wtoolbar;
  }
  if (isChrome) {
    return window.innerWidth - wtoolbar;
  }
  if (isEdge) {
    return window.innerWidth - wtoolbar;
  }
  return window.innerWidth - wtoolbar;
}

function chercheAdresse() {
  var adresse = $("#adresse").val();
  var url = FS.main.AdressSearchURL + adresse;

  if (adresse.length > 2) {
    $("#annul_adresse").show(0);
    $.getJSON(url, function (data) {
      $("#listeAdresses").html("");
      $("#listeAdresses").append("<div id='listeAdresses'>");
      for (var i = 0; i < data.features.length; i++) {
        //var f = data.features[i];
        var nomAdresse = data.features[i].properties.label;
        $("#listeAdresses").append(
          "<div class='resultatAdresse' id='f" +
            i +
            "'>" +
            nomAdresse +
            "</div>"
        );
        $(document).on(
          "click",
          "#f" + i,
          { geometrie: data.features[i].geometry },
          zoomAdresse
        );
      }
      $("#listeAdresses").append("</div>");
      if (data.features.length > 0) {
        $("#listeAdresses").show(400);
      } else {
        $("#listeAdresses").hide(400);
      }
    });
  } else {
    $("#listeAdresses").hide(400);
    $("#listeAdresses").html("");
    $("#annul_adresse").hide(0);
  }
}

function zoomAdresse(e) {
  // zoom sur les coordonnées du point adresse identifié
  FS.main.vue.setCenter(
    ol.proj.fromLonLat([
      e.data.geometrie.coordinates[0],
      e.data.geometrie.coordinates[1],
    ])
  );
  FS.main.vue.setZoom(18);
  $("#adresse").val("");
  $("#listeAdresses").hide(800);
  $("#listeAdresses").html("");
  $("#annul_adresse").hide(0);
}

function Combobox_hover(input) {
  if (FS.main.Kiosque == 0) {
    $("#apercu").html("");
    var apercu = input.innerText;
    for (var i in FS.main.donnees) {
      if (apercu == FS.main.donnees[i][5 + FS.main.langue]) {
        $("#apercu").html('<img src="img/' + FS.main.donnees[i][0] + '.jpg"/>');
        $("#apercu").show(0);
      }
    }
  }
}

function Combobox_endhover(input) {
  $("#apercu").hide(0);
}

function Metadonnees(choixImage) {
  // retourne le bon lien de métadonnées en fonction du choix de couche
  for (var i in FS.main.donnees) {
    if (FS.main.donnees[i][0] == choixImage) {
      return FS.main.donnees[i][FS.main.donnees[i].length - 1];
    }
  }
}

function ChoixImage() {
  // gère le changement de couche dans les menus de sélection

  // rendre toutes les couches invisibles
  FS.main.map1.getLayers().forEach(function (l) {
    l.setVisible(false);
  });
  FS.main.map2.getLayers().forEach(function (l) {
    l.setVisible(false);
  });

  // gestion de le couche de mesure et des couches d'habillage
  FS.main.vectorLayer.setVisible(true);
  if ($("#baseMap").is(':checked') == true) {FS.main.baseMap.setVisible(true)} else {FS.main.baseMap.setVisible(false)};
  if ($("#administrativeDivision").is(':checked') == true) {FS.main.administrativeDivision.setVisible(true)} else {FS.main.administrativeDivision.setVisible(false)};
  if ($("#toponym").is(':checked') == true) {FS.main.toponym.setVisible(true)} else {FS.main.toponym.setVisible(false)};
  $("#texteAttributionH").css("visibility", "hidden");
  if ($("#baseMap").is(':checked') == true || $("#toponym").is(':checked') == true) {
    $("#texteAttributionH").html('<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO');
    $("#texteAttributionH").css("visibility", "visible");
  } ;
  if ($("#administrativeDivision").is(':checked') == true) {
    $("#texteAttributionH").css("visibility", "visible");
    if ($("#baseMap").is(':checked') == true || $("#toponym").is(':checked') == true) {$("#texteAttributionH").html('<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO / <a href="https://www.ign.fr/" target="_blank">IGN</a>')}
    else {$("#texteAttributionH").html('<a href="https://www.ign.fr/" target="_blank">IGN</a>')} ;
  };


  // mise en avant des images choisies à gauche et droite & de la couche vectorielles de meseure
  var choixImageDroite = $("#ImageDroite").val();
  if (FS.main.CompareCote == 1 || FS.main.CompareSwitcher == 1) {
    choixImageDroite = choixImageDroite + "_BIS";
    var ImageDroite = jQuery.grep(
      FS.main.map2.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
    ImageDroite.setZIndex(1000);
  } else {
    var ImageDroite = jQuery.grep(
      FS.main.map1.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
    ImageDroite.setZIndex(1000);
  }
  var choixImageGauche = $("#ImageGauche").val();
  var ImageGauche = jQuery.grep(
    FS.main.map1.getLayers().getArray(),
    function (layer) {
      return layer.get("name") == choixImageGauche;
    }
  )[0];
  ImageGauche.setZIndex(1001);
  var typeSource = ImageGauche.getSource().getUrls()[0].includes("{z}/{x}/{y}");
  if (FS.main.CompareCote == 1 && !typeSource) {
    ImageGauche.getSource().updateParams({
      BGCOLOR: "0xFFFFFF",
      TRANSPARENT: false,
    });
  } else if (!typeSource) {
    ImageGauche.getSource().updateParams({
      BGCOLOR: "0xFFFFFF",
      TRANSPARENT: true,
    });
  }

  FS.main.vectorLayer.setZIndex(1100);
  FS.main.baseMap.setZIndex(999);
  FS.main.administrativeDivision.setZIndex(1050);
  FS.main.toponym.setZIndex(1051);


  // rendre les couches sélectionnées visibles
  ImageGauche.setVisible(true);
  ImageDroite.setVisible(true);

  // Mise en place de l'image coupée par curseur si ce mode est actif
  if (FS.main.CompareSwitcher == 1) {
    var swipe = $("#swipe").val();
    ImageGauche.on("precompose", function (e) {
      var ctxG = e.context;
      var swipe = $("#swipe").val();
      if (swipe === undefined) {
        swipe = 1;
      }
      var width = ctxG.canvas.width * swipe;
      ctxG.save();
      ctxG.beginPath();
      ctxG.rect(0, 0, width, ctxG.canvas.height);
      ctxG.clip();
    });
    ImageGauche.on("postcompose", function (e) {
      var ctxG = e.context;
      ctxG.restore();
    });
    FS.main.map1.render();
  }

  // Changer l'opacité des couches si ce mode est actif
  if (FS.main.CompareSuperpose == 1) {
    ChoixOpacite();
  }
}

function ChangeImage(cote) {
  var choixImageDroite = $("#ImageDroite").val();
  var choixImageDroite = $("#ImageDroite").val().replace("_BIS", "");
  var choixImageGauche = $("#ImageGauche").val();

  // Affiche le bouton de légende si activé dans le fichier JSON
  for (var i in FS.main.donnees) {
    if (
      FS.main.donnees[i][3] == 1 &&
      FS.main.donnees[i][0] == choixImageGauche
    ) {
      if (FS.main.Kiosque == 0) {
        $("#btnLG").show(400);
      }
      break;
    } else if (
      FS.main.donnees[i][3] != 1 &&
      FS.main.donnees[i][0] == choixImageGauche
    ) {
      $("#btnLG").hide(400);
    }
  }
  for (var i in FS.main.donnees) {
    var choixImageDroite = choixImageDroite.replace("_BIS", "");
    if (
      FS.main.donnees[i][3] == 1 &&
      FS.main.donnees[i][0] == choixImageDroite
    ) {
      if (FS.main.Kiosque == 0) {
        $("#btnLD").show(400);
      }
      break;
    } else if (
      FS.main.donnees[i][3] != 1 &&
      FS.main.donnees[i][0] == choixImageDroite
    ) {
      $("#btnLD").hide(400);
    }
  }

  if (chargementCap != 1) {
    // chargement des capabilities
    $.when(
      $.ajax({
        type: "GET",
        url:
          FS.main.WmsURL[0] +
          "/wms?service=wms&version=1.3.0&request=GetCapabilities",
        cache: false,
        dataType: "xml",
        success: function (xml) {
          capabilities[0] = xml;
        },
      }),
      $.ajax({
        type: "GET",
        url:
          FS.main.WmsURL[1] +
          "/wms?service=wms&version=1.3.0&request=GetCapabilities",
        cache: false,
        dataType: "xml",
        success: function (xml) {
          capabilities[1] = xml;
        },
      })
    ).then(function () {
      // affichage des attributions et métadonnées
      chargementCap = 1;
      // Gestion des attributions
      if (cote != "D") {
        lireCapabilities("attributions", choixImageGauche, "G", 4);
      }
      if (cote != "G") {
        lireCapabilities("attributions", choixImageDroite, "D", 4);
      }
      // Gestion des métadonnées
      if (cote != "D") {
        lireCapabilities(
          "metadonnees",
          choixImageGauche,
          "G",
          FS.main.donnees[1].length - 1
        );
      }
      if (cote != "G") {
        lireCapabilities(
          "metadonnees",
          choixImageDroite,
          "D",
          FS.main.donnees[1].length - 1
        );
      }
    });
  } else {
    // affichage des attributions et métadonnées dans le cas de capabilities déjà chargées
    // Gestion des attributions
    if (cote != "D") {
      lireCapabilities("attributions", choixImageGauche, "G", 4);
    }
    if (cote != "G") {
      lireCapabilities("attributions", choixImageDroite, "D", 4);
    }
    // Gestion des métadonnées
    if (cote != "D") {
      lireCapabilities(
        "metadonnees",
        choixImageGauche,
        "G",
        FS.main.donnees[1].length - 1
      );
    }
    if (cote != "G") {
      lireCapabilities(
        "metadonnees",
        choixImageDroite,
        "D",
        FS.main.donnees[1].length - 1
      );
    }
  }
}

function lireCapabilities(type, choixImage, cote, colonne) {
  if (type == "attributions") {
    var capabSpec = new Array();
    for (var i in FS.main.donnees) {
      if (
        FS.main.donnees[i][colonne] != 0 &&
        FS.main.donnees[i][0] == choixImage
      ) {
        if (FS.main.donnees[i][colonne] == "wms") {
          capabSpec = attribution(FS.main.donnees[i][2]);
          FS.main.donnees[i][colonne] = capabSpec;
          afficheAttribution(capabSpec, cote, i);
          break;
        } else if (FS.main.donnees[i][colonne] != 0) {
          capabSpec = FS.main.donnees[i][colonne];
          afficheAttribution(capabSpec, cote, i);
          break;
        }
      } else if (
        FS.main.donnees[i][colonne] == 0 &&
        FS.main.donnees[i][0] == choixImage
      ) {
        if (type == "attributions") {
          $("#texteAttribution" + cote).hide(400);
          $("#logoAttribution" + cote).fadeOut(400);
        } else {
          $("#btnI" + cote).hide(400);
        }
      }
    }
  }
  if (type == "metadonnees") {
    for (var i in FS.main.donnees) {
      if (
        FS.main.donnees[i][colonne] != 0 &&
        FS.main.donnees[i][0] == choixImage
      ) {
        if (FS.main.donnees[i][colonne] == "wms") {
          capabSpec = definirMetadonnees(FS.main.donnees[i][2]);
          FS.main.donnees[i][colonne] = capabSpec;
          afficheMetadonnees(capabSpec, cote, i);
          break;
        } else if (FS.main.donnees[i][colonne] != 0) {
          capabSpec = FS.main.donnees[i][colonne];
          afficheMetadonnees(capabSpec, cote, i);
          break;
        }
      } else if (
        FS.main.donnees[i][colonne] == 0 &&
        FS.main.donnees[i][0] == choixImage
      ) {
        if (type == "attributions") {
          $("#texteAttribution" + cote).hide(400);
          $("#logoAttribution" + cote).fadeOut(400);
        } else {
          $("#btnI" + cote).hide(400);
        }
      }
    }
  }
}

function afficheAttribution(attributions, cote, couche) {
  if (attributions[0] !== null) {
    $("#texteAttribution" + cote).html(
      FS.main.donnees[couche][5 + FS.main.langue] + " : " + attributions[0]
    );
    $("#texteAttribution" + cote).show(400);
  } else {
    $("#texteAttribution" + cote).hide(400);
  }
  if (attributions[1] !== null) {
    $("#logoAttribution" + cote).html(
      '<img src="' + attributions[1] + '" draggable="false" height="50"/>'
    ); //modifié
    $("#logoAttribution" + cote).fadeOut(0, function () {
      $("#logoAttribution" + cote).fadeIn(800);
    });
  } else {
    $("#logoAttribution" + cote).fadeOut(400);
  }
}

function afficheMetadonnees(metadonnees, cote) {
  if (metadonnees !== null && metadonnees !== 0) {
    if (FS.main.Kiosque == 0) {
      $("#btnI" + cote).show(400);
    }
  } else {
    $("#btnI" + cote).hide(400);
  }
}

function ChoixOpacite() {
  // gère le changement d'opacité (utiliser avec le mode superposition)

  var choixImageGauche = $("#ImageGauche").val();
  var ImageGauche = jQuery.grep(
    FS.main.map1.getLayers().getArray(),
    function (layer) {
      return layer.get("name") == choixImageGauche;
    }
  )[0];
  var choixImageDroite = $("#ImageDroite").val();
  if (FS.main.CompareSwitcher == 1) {
    choixImageDroite = choixImageDroite += "_BIS";
    var ImageDroite = jQuery.grep(
      FS.main.map2.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
    ImageDroite.setZIndex(1000);
  } else {
    var ImageDroite = jQuery.grep(
      FS.main.map1.getLayers().getArray(),
      function (layer) {
        return layer.get("name") == choixImageDroite;
      }
    )[0];
    ImageDroite.setZIndex(1000);
  }
  var opaciteGauche = $("#opaciteGauche").val();
  var opaciteDroite = $("#opaciteDroite").val();
  ImageGauche.setOpacity(opaciteGauche);
  ImageDroite.setOpacity(opaciteDroite);
}

function Mesure() {
  FS.main.map1.un("pointermove", pointerMoveHandler);
  FS.main.vectorLayer.setZIndex(1020);

  var helpTooltipElement;
  var helpTooltip;
  var measureTooltipElement;
  var measureTooltip;
  var continuePolygonMsg = FS.main.langage[34][FS.main.langue];
  var continueLineMsg = FS.main.langage[35][FS.main.langue];

  // gestion du pointeur et des messages d'aide
  var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    var helpMsg = FS.main.langage[36][FS.main.langue];

    if (FS.main.sketch) {
      var geom = FS.main.sketch.getGeometry();
      if (geom instanceof ol.geom.Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof ol.geom.LineString) {
        helpMsg = continueLineMsg;
      }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);
    helpTooltipElement.classList.remove("hidden");
  };
  FS.main.map1.on("pointermove", pointerMoveHandler);

  FS.main.map1.getViewport().addEventListener("mouseout", function () {
    helpTooltipElement.classList.add("hidden");
  });

  // calcul de la longueur
  var formatLength = function (line) {
    var length = ol.Sphere.getLength(line);
    var output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + " " + "km";
    } else {
      output = Math.round(length * 100) / 100 + " " + "m";
    }
    return output;
  };

  // calcul de l'aire
  var formatArea = function (polygon) {
    var area = ol.Sphere.getArea(polygon);
    var output;
    if (area > 10000) {
      output =
        Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
    } else {
      output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
    }
    return output;
  };

  // définition de l'outil de dessin & du style de dessin
  function addInteraction() {
    var type = FS.main.ModeMesure == "Surface" ? "Polygon" : "LineString";
    FS.main.draw = new ol.interaction.Draw({
      source: FS.main.mesure,
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: FS.main.highlight_color_alpha2,
        }),
        stroke: new ol.style.Stroke({
          color: FS.main.highlight_color_alpha1,
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: FS.main.highlight_color_alpha1,
          }),
          fill: new ol.style.Fill({
            color: FS.main.highlight_color_alpha2,
          }),
        }),
      }),
    });
    FS.main.map1.addInteraction(FS.main.draw);

    createMeasureTooltip();
    createHelpTooltip();

    // gestion du dessin
    var listener;
    FS.main.draw.on(
      "drawstart",
      function (evt) {
        // set sketch
        FS.main.sketch = evt.feature;

        var tooltipCoord = evt.coordinate;

        listener = FS.main.sketch.getGeometry().on("change", function (evt) {
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
      },
      this
    );

    FS.main.draw.on(
      "drawend",
      function () {
        measureTooltipElement.className = "tooltip tooltip-static";
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        FS.main.sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
      },
      this
    );
  }

  // infobulle d'aide
  function createHelpTooltip() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement("div");
    helpTooltipElement.className = "tooltip hidden";
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: "center-left",
    });
    FS.main.map1.addOverlay(helpTooltip);
  }

  // infobulle de mesure
  function createMeasureTooltip() {
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement("div");
    measureTooltipElement.className = "tooltip tooltip-measure";
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: "bottom-center",
    });
    FS.main.map1.addOverlay(measureTooltip);
  }

  addInteraction();
}
