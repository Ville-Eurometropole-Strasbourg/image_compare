# image_compare
Comparaison d'image avec openlayers 4
Comparison of images with openlayers 4

-------------
What's new ?
-------------
V 1.2 : add the possibility to display a WMS legend (this legend is created server side). A 6th column is addeed to json file to specify if the legend must be displayed for this specific layer.


---------------------------
Composition of the project:
---------------------------

The project is composed of:
- a main HTML file for the interface
- a javascript file with the code
- a css file
- a json file containing the list of data streams

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
- 1st column: internal name of the layer (also used for the overviews of data streams)
- 2nd column: title that will be displayed to the users
- 3rd column: URL of the stream*
- 4th column: name of the layer in the stream*
- 5th column: URL to metadata of the layer
- 6th column: "1" if the WMS legend must be displayed (with any other value, the legend won't be displayed)

The last two lines of json files specifies the number of data streams that will be displayed in the left and right images. 

The overviews of the raster layers have to be stored in the 'img' folder.

* the mechanism is different for XYZ data streams : 3rd column is equal to 'XYZ' and 4th column contains the URL

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

JS functions : Cote, Superpose, Switch, 

Search
------

Allow the user to search for an adress in Strasbourg metropole.
The JS code use a Strasbourg specific search engine (Adict) based on a URL request. This search engine is based on the addok project (https://github.com/addok/addok)
In France tha API on this website can also be used: https://adresse.data.gouv.fr/api (same search engine code)
--> This tool need to be set on another search engine to work outise Strasbourg metropole area.

JS functions : chercheAdresse & zoomAdresse

Measuring
---------

Allow the user to perform distance and area measurements
The text messages are in French and has to be changed if necessary. The units of distance and area can also be changed.

JS function : Mesure

Coordinate
----------
Show the cursor current coordinates in geographic units and maps units.
--> The projection system used can be changed in the JS. The name of the projection has to be changed in the html file.

JS function: Coordonnees

Download
--------
Download the current map as a png file

JS function: Telecharger

Print
-----
Print the current map as a pdf file
The layout of the page can be changed in the JS code.
--> this tool is currently bugged: the pdf is sometimes generated before all the data is available leaving blanks in the page.

JS function: Imprimer
