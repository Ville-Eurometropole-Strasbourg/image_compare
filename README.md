# image_compare
Comparaison d'image avec openlayers 4
Comparison of images with openlayers 4


The project is composed of :
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

There are no specific constraints to install this project.

Just copy all the files (keeping the folder structure) in your directory.

You then have then to modify the json as follows:
- 1st column: internal name of the layer (also used for the overviews of data streams)
- 2nd column: title that will be displayed to the users
- 3rd column: URL of the stream*
- 4th column: name of the layer in the stream*
- 5th column: URL to metadata of the layer

The last two lines of json files specifies the number of data streams that will be displayed in the left and right images. 

The overviews of the raster layers have to be stored in the 'img' folder.

* the mechanism is different for XYZ data streams : 3rd column is equal to 'XYZ' and 4th column contains the URL

Some parts of the code are based on the openlayers examples (https://openlayers.org/en/latest/examples) which are really helpful.
