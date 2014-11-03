var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {type:String, unique:true, required:true, minLength:5, maxLength:36},
  password: {type:String, required:true, minLength:5, maxLength:36},
  email:{type:String},
  score:{type:Number, default:0},
  registerAt:{type:Date, default:Date.now},
  lastLogin:{type:Date, default:Date.now},
  lockUntil:{type:Date}
});
UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});
UserSchema.virtual('getLockUntil').get(function() {
  return this.lockUntil.toString();
});

//用户模型的静态方�?
//使用用户�?+密码，手机号+密码，UUID等各种方式进行登录�?
UserSchema.statics.auth=function(auth, password, cb){
  this.findOne({username:auth}, function (err, user){
    if(err)
      return cb(err);
    console.log(auth);
    if(!user){
      return cb(null, null, '用户名无�?');
    }

    if(user.isLocked){
      return cb(null, null, this.getLockUntil);
    }

    if(password != user.password){
      return cb(null, null, '密码错�??');
    }

    user.lastLogin = Date.now();
    user.markModified('lastLogin');
    user.save();
    return cb(null, user);
  });
};

module.exports = mongoose.model("User", UserSchema);
