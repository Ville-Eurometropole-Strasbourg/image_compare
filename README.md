# image_compare
Comparaison d'image avec openlayers 4
Comparison of images with openlayers 4

-------------
What's new ?
-------------
V 1.2: add the possibility to display a WMS legend (this legend is created server side). A 6th column is addeed to json file to specify if the legend must be displayed for this specific layer.

V 1.3: add multilingual support, display of attributions text and logo, possibility to retrieve attributions and metadata directly from WMS stream, new permalink tool

V 1.4: added a kiosk mode as URL parameter (K=1), the main js file is now separated in 3 files : fonctions.js with all functions, IHM.js deals with interface (interactions personne-machine or IPM), the remaining code is still in main.js

V1.5: main parameters are now in a specific JSON file (param.json) and not in the javascript code. Start images and metadata URL are now in this parameter file (they were previously in donnees.json). Coordinates used in URL and permalink are now in geographic system and in decimal degrees (and not in Mercator coodinates anymore). Colors of the different elements are now only defined in the CSS file and no more in the main.js. Start images can be defined either by their order in the donnees.json file or by the internal name of the layer (used now in permalinks). Add a zoom to extent button (button with globe). Bug corrections.

---------------------------
Composition of the project:
---------------------------

The project is composed of:
- a main HTML file for the interface
- a javascript file with the code
- a css file
- a json file containing the list of data streams
- a json file containing the translations

This project use the following libraries:
- jquery (files are included in the project)
- openlayers 4 (openalyers 4.4.1 is included in the project)
- jquery ui
- Filesaver
- jspdf

------------
Installation
------------

There are no specific constraints to install this project.

Just copy all the files (keeping the folder structure) in your directory.

You then have then to modify the json as follows:
- 1st column: internal name of the layer (also used for the overviews of data streams), no spaces or exotic characters
- 2nd column: URL of the stream*
- 3th column: name of the layer in the stream*
- 4th column, legend: "1" if the WMS legend must be displayed (with any other value, the legend won't be displayed)
- 5th column, attributions: 0 = none, wms = WMS stream attribution or a table of 2 values [text, logo URL]
- 6th column and the following: title that will be displayed to the users in the first language (repeat the column for other languages)
- last column, metadata: 0 = none, wms = WMS stream metadata link or a string containaing containaing the URL of the metadata

The two lines near the end of json files (startImage1 & startImage2 )specifies the ndex of data streams that will be displayed in the left and right images.

The last line is a table of 2 values, each value is the URL of  WMS stream that will allows a getcapabilities request used for attributions and metadata.

The overviews of the raster layers have to be stored in the 'img' folder with the same name as column 1.

* the mechanism is different for XYZ data streams : 2nd column is equal to 'XYZ' and 3th column contains the URL

Some parts of the code are based on the openlayers examples (https://openlayers.org/en/latest/examples) which are really helpful.

---------------------------------------------
List of tools available to users and settings
---------------------------------------------

Main tools
----------
The main tools are the camparison tools between two images. The list of the images is built from the json file.
Three comparison mode are available:
- side by side (with two cursors coordinated on each image)
- surimposed maps with transparence
- map divided in two part with a slider

The two last modes can be used simulteneously.

JS functions : Cote (side by side), Superpose (surimposed map), Switch 

Search
------

Allow the user to search for an adress in Strasbourg metropole.
The JS code use a Strasbourg specific search engine (Adict) based on a URL request. This search engine is based on the addok project (https://github.com/addok/addok)
In France the API on this website can also be used: https://adresse.data.gouv.fr/api (same search engine code).
--> This tool need to be set on another search engine to work outside Strasbourg metropole area.

JS functions : chercheAdresse & zoomAdresse

Measuring
---------

Allow the user to perform distance and area measurements.
The text messages are in French and has to be changed if necessary. The units of distance and area can also be changed.
--> You have to change the coordinate sytem used (french coordinate system) to the official one of your country.

JS function : Mesure

Coordinate
----------
Show the cursor current coordinates in geographic units and maps units.
--> The projection system used can be changed in the JS. The name of the projection has to be changed in the langage JSON file.

JS function: Coordonnees

Download
--------
Download the current map as a png file.

JS function: Telecharger

Print
-----
Print the current map as a pdf file.
The layout of the page can be changed in the JS code.
--> this tool is currently bugged: the pdf is sometimes generated before all the data is available leaving blanks in the page.

JS function: Imprimer

Permalink
---------
Generate a permalink URL with the actual configuration of the page. This link can copied to the clipboard or sent by email.
L=current language, I1=left image id, I2=right image id, X=longitude, Y=latitude, Z=current zoom, C= 1 if side by side mode is activated, S=switcher value in this mode, O=1 if opacity mode is activated, O1= opacity of the left image, O2=opacit of the right image, Coord=1 if coordinate mode is activated

JS function : Permalien
