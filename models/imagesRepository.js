const ImageFilesRepository = require("./imageFilesRepository.js");
const UsersRepository = require("./usersRepository.js");
const ImageModel = require("./image.js");
const utilities = require("../utilities");
const HttpContext = require("../httpContext").get();
const CollectionFilter = require("./collectionFilter.js");

module.exports = class ImagesRepository extends require("./repository") {
  constructor() {
    super(new ImageModel(), true /* cached */);
    this.setBindExtraDataMethod(this.bindImageURL);
    //const UsersRepository = require("./usersRepository.js");//Donne des erreurs sur Glitch si je le require en haut
    this.UsersRepository = new UsersRepository();
  }
  bindImageURL(image) {
    if (image) {
      let bindedImage = { ...image };
      let userId = bindedImage.UserId;
      let user =  this.UsersRepository.get(userId);

      if (image["GUID"] != "") {
        bindedImage["OriginalURL"] =
          HttpContext.host +
          ImageFilesRepository.getImageFileURL(image["GUID"]);
        bindedImage["ThumbnailURL"] =
          HttpContext.host +
          ImageFilesRepository.getThumbnailFileURL(image["GUID"]);
      } else {
        bindedImage["OriginalURL"] = "";
        bindedImage["ThumbnailURL"] = "";
      }

      //--Ajout des informations du user--
      bindedImage["Username"] = user.Name;
      bindedImage["AvatarURL"] = user.AvatarURL;
      //----------------------------------

      return bindedImage;
    }
    return null;
  }
  add(image) {
    if (this.model.valid(image)) {
      image["GUID"] = ImageFilesRepository.storeImageData(
        "",
        image["ImageData"]
      );
      delete image["ImageData"];
      return this.bindImageURL(super.add(image));
    }
    return null;
  }
  update(image) {
    if (this.model.valid(image)) {
      image["GUID"] = ImageFilesRepository.storeImageData(
        image["GUID"],
        image["ImageData"]
      );
      delete image["ImageData"];
      return super.update(image);
    }
    return false;
  }
  remove(id) {
    let foundImage = super.get(id);
    if (foundImage) {
      ImageFilesRepository.removeImageFile(foundImage["GUID"]);
      return super.remove(id);
    }
    return false;
  }

  getAll(params = null) {
    let objectsList = this.objects();
    if (this.bindExtraDataMethod != null) {
      objectsList = this.bindExtraData(objectsList);
    }
    if (params) {
      if("keywords" in params && !("keywordFields" in params )){//Keywords set, put not the fields; Set default (Title and description)
        params.keywords = params.keywords.replace(' ', ',');
        params.keywordFields = "Title,Description";
      }
      let collectionFilter = new CollectionFilter(
        objectsList,
        params,
        this.model
      );
      return collectionFilter.get();
    }
    return objectsList;
  }
};
