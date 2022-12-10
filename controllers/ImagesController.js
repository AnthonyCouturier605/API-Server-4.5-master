const ImagesRepository = require("../models/imagesRepository");
const TokenManager = require("../tokenManager");
module.exports = class ImagesController extends require("./Controller") {
  constructor(HttpContext) {
    super(HttpContext,new ImagesRepository(),false,true);
  }

  post(data) {
    if (this.writeAuthorization()) {
        if (this.repository != null) {
          let user = this.repository.UsersRepository.get(data.UserId);
          if(user.VerifyCode == "verified"){
            data = this.repository.add(data);
            if (data) {
                if (data.conflict)
                    this.HttpContext.response.conflict();
                else
                    this.HttpContext.response.created(data);
            } else
                this.HttpContext.response.unprocessable();
          }else{
            this.HttpContext.response.unverifiedUser();
          }
        } else
            this.HttpContext.response.notImplemented();
    } else
        this.HttpContext.response.unAuthorized();
}

  put(data) {
    if (this.writeAuthorization()) {
      let token = TokenManager.getTokenFromRequest(this.HttpContext.req);

      if(token && data && token.UserId == data.UserId){
          if (this.repository != null) {
            let user = this.repository.UsersRepository.get(data.UserId);
            if(user.VerifyCode == "verified"){
              let updateResult = this.repository.update(data);
              if (updateResult == this.repository.updateResult.ok)
                  this.HttpContext.response.ok();
              else
                  if (updateResult == this.repository.updateResult.conflict)
                      this.HttpContext.response.conflict();
                  else
                      if (updateResult == this.repository.updateResult.notfound)
                          this.HttpContext.response.notFound();
                      else // this.repository.updateResult.invalid
                          this.HttpContext.response.unprocessable();
            }else{
              this.HttpContext.response.unverifiedUser();
            }
          } else
            this.HttpContext.response.notImplemented();
      }
      else{
        this.HttpContext.response.unAuthorized();
      }
    } else
        this.HttpContext.response.unAuthorized();
}
remove(id) {
    if (this.writeAuthorization()) {
        if (this.repository != null) {

          let image = this.repository.get(id);
          if(image){
            let token = TokenManager.getTokenFromRequest(this.HttpContext.req);
            let user = this.repository.UsersRepository.get(token.UserId);
            if(token && token.UserId == image.UserId){
              if(user.VerifyCode == "verified"){
                if (this.repository.remove(id))
                this.HttpContext.response.accepted();
                 else
                this.HttpContext.response.notFound();
              }else{
                this.HttpContext.response.unverifiedUser();
              }
            }
            else{
              this.HttpContext.response.unAuthorized();
            }
          }
          else{
            this.HttpContext.response.notFound();
          }
        } else
            this.HttpContext.response.notImplemented();
    } else
        this.HttpContext.response.unAuthorized();
}
};

