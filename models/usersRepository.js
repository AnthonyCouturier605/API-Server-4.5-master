const ImageFilesRepository = require("./imageFilesRepository.js");
const ImagesRepository = require("./ImagesRepository.js");
const UserModel = require("./user.js");
const utilities = require("../utilities");
const HttpContext = require("../httpContext").get();

module.exports = class UsersRepository extends require("./repository") {
  constructor() {
    super(new UserModel(), true);
    this.setBindExtraDataMethod(this.bindAvatarURL);
    // this.ImagesRepository = new ImagesRepository();
  }
  bindAvatarURL(user) {
    if (user) {
      let bindedUser = { ...user };
      delete bindedUser.Password;
      if (bindedUser.VerifyCode !== "verified")
        bindedUser.VerifyCode = "unverified";
      if (user["AvatarGUID"] != "") {
        bindedUser["AvatarURL"] =
          HttpContext.host +
          ImageFilesRepository.getImageFileURL(user["AvatarGUID"]);
      } else {
        bindedUser["AvatarURL"] = "";
      }
      return bindedUser;
    }
    return null;
  }
  add(user) {
    user["Created"] = utilities.nowInSeconds();
    if (this.model.valid(user)) {
      user["AvatarGUID"] = ImageFilesRepository.storeImageData(
        "",
        user["ImageData"]
      );
      delete user["ImageData"];
      return this.bindAvatarURL(super.add(user));
    }
    return null;
  }
  update(user) {
    if (this.model.valid(user)) {
      let foundUser = super.get(user.Id);
      if (foundUser) {
        user["Created"] = foundUser["Created"];
        user["AvatarGUID"] = ImageFilesRepository.storeImageData(
          user["AvatarGUID"],
          user["ImageData"]
        );
        delete user["ImageData"];
        return super.update(user);
      }
    }
    return false;
  }
  remove(id) {
    let foundUser = super.get(id);
    if (foundUser) {
      let imagesRepos = new ImagesRepository();
      let images = imagesRepos.getAll();

      images.forEach((image) => {
        if (image.UserId == id) {
          imagesRepos.remove(image.Id);
        }
      });
      ImageFilesRepository.removeImageFile(foundUser["AvatarGUID"]);
      return super.remove(id);
    }
    return false;
  }
};
