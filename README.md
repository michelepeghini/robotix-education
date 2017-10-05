# Robotix Education

This is the entire codebase for [Robotix Education](https://robotix.com.au), an educational / e-commerce website that I have developed. 
The purpose of this repository is to showcase my coding skills. 
I did this website pro bono to gain some experience and I am maintaining it and adding new features upon client request.
All code in this repository has been written by me without the use of any templates. 

## Getting started

This is an edited copy of the live website with omitted API keys and changed passwords. 
It is not meant for deployment, this repository is missing all images, downloadable file assets and the database provided is structure only. 
As mentioned earlier, it is meant to showcase my coding skills and not to provide a usable product.

**Stack:**
  * Angular 1.4
  * JSON
  * PHP 5
  * MySQL

**APIs:**
  * YouTube API
  * PayPal API

## Website's description

The website offers streaming of videos via YouTube and kits of electronic components and programmable microcontrollers to purchase via PayPal.
By purchasing a kit users can build and program the electronic circuits described in the videos, each video can have assets such as a PDF manual and a code file to download.

## Webside's Features

Following is a list of pictures highlighting the major parts of the website, with a description of relative features

### User section

* **Homepage:** 
  * *Get started* button links to videos page
  * the elements at the bottom provide links to website's sections, same as nav links but with a blurb explanation for first time users

![User Homepage](/screenshots/user-home.jpg "User Homepage")

---

* **Videos page:** 
  * the carousel at the top provides a quick link to the latest videos uploaded
  * the playlist section is a drop-down menu with a quick link to all playlists
  * the video section provides a list of all videos with filtering options: by playlist, by title search and by kit
  * the *Manual* and *Code* icons at the bottom of each video element are either *green* or *grey* to indicate if there are files available for download

![User Videos page](/screenshots/user-videos.jpg "User Videos page")

---

* **Single Video page:** 
  * Only logged in users can access Single video pages and download files
  * *Description* tab is a short video description
  * *Files* tab provides links to files download
  * *Playlists* tab provides links to playlists the video is in
  * *Kits* tab provides links to kits necessary to build the circuit

![User single Video page](/screenshots/user-video.jpg "User single Video page")

---

* **Kit page:** 
  * *PayPal* image will redirect the user to Robotix page on PayPal with the relative kit added to the cart
  * *Components* tab shows all electronic components present in the kit
  * *What you can build* tab shows all videos that be consumed with that kit

![User single Kit page](/screenshots/user-kit.jpg "User single Kit page")

---

* **Software Download page:**
  * provides downloads of software required to run the microcontroller boards 

![User Software download page](/screenshots/user-software.jpg "User Software download page")

---

* **Log In modal window:**
  * can switch between *Log In* and *Sign Up*.
  * appears automatically on Single Video page if user not logged in, if closed when that Route is active the user is redirected to homepage, this is to force users to register in order to download *Manual* and *Code* files.

![Login modal](/screenshots/user-login.jpg "Login modal")

---

### Admin section

This is the Admin section of the website, it consists of a Content Management System that I developed individually. Effectively this is an entirely separate website, it only acts on same DB and shares some back-end scripts with its user-facing counterpart.

* **You Tube API:**
  * Admin can enter a `palylist_id` from his You Tube channel and have all Playlist and relative Videos data loaded.
  * Titles and descriptions can be edited.
  * `X` button removes a video from playlist before DB storage.
  * `SAVE` button saves all videos and playlist to DB.
  * `Title` and `Description` are stored in DB to allow differentiation of content between You Tube channel and website.

![You Tube API](/screenshots/admin-youtube.jpg "You Tube API")

---

* **CMS for Videos:**
  * **This section allows additional editing of individual video data**
  * `Manual` and `Code`: allows file upload, *green* icon indicates a file is present, current file can be deleted with `X` button 
  * `Playlists`: shows all available playlists and allows Admin to add/remove video from any playlist. *Green* playlist indicates video is in that playlist.
  * `Kits`: shows all available kits and allows Admin to add/remove video association with any kit. *Green* kit indicates video is in that kit.
  
![CMS for Videos](/screenshots/admin-videos.jpg "CMS for Videos")

---

* **CMS for Playlists:**
  * `New Playlist`: allows creation of a new custom playlist, not present on You Tube.
  * `List of Plsylists`: by selecting a playlist Admin can change `Name`, `Description` and `Videos` contained in it.

![CMS for Playlists](/screenshots/admin-playlist.jpg "CMS for Playlists")

---

* **CMS for Kits:** 
  * `New Kit`: allows creation of new kit, with `Name`, `Description` and `Price` only. A kit must be stored to DB and get an ID before specifying any additional attributes, due to dependencies in DB's associative tables.
  * `Image`: Allows image upload, `red` border indicates that a new file has been selected for upload and that the old one will be overwritten. The `X` near the file icon clears the new file upload.
  * `Components`: allows to select which electronic components are part of the kit and in what quantity. New components can be created in the *Components* tab, not shown here.
  
![CMS for Kits](/screenshots/admin-kit.jpg "")

---

* **CMS for Homepage Element:**
  * Allows editing and creation of Elements of the Homepage, linking to other pages of the website. CMS interface is similar to previous parts, with the exception of `Link`.
  * `Link`: Determines what Route (i.e. website's subsection) the element will link to.  

![CMS for Homepage Element](/screenshots/admin-element.jpg "CMS for Homepage Element")

## Libraries

* Angular 1.4.2
* Angular Routes 1.4.2
* ngFileUpload by [danialfarid](https://github.com/danialfarid/ng-file-upload)
* jQuery 3.1.1
* Bootstrap 3.3.7 JS
* Bootstrap 3.3.7 CSS

## Licence 

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/)
![Creative Commons License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png "Creative Commons License")


Codebase for my first live website. E-commerce / educational website with products to purchase and YouTube videos with files to download. Has an admin section with a custom made CMS. https://robotix.com.au