var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var thumbnailPluginLib = require('mongoose-thumbnail');
var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var path = require("path");
var uploads_base = path.join(__dirname, "../../public/uploads");
var uploads = path.join(uploads_base, "u");


var ContactSchema = new Schema({
    first_name: {type: String, index: true},
    last_name: String,
    tags: Array,
    created_at: Date,
    email_address: Array,
    updated_at: Date
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ContactSchema.plugin(thumbnailPlugin, {
                        name: "photo",
                        format: "png",
                        size: 80,
                        inline: false,
                        save: true,
                        upload_to: uploads,
                        relative_to: uploads_base
                    });

ContactSchema.path('first_name').required(true, 'First name cannot be blank');

ContactSchema.virtual('first_letter').get(function(){
  return this.first_name[0].toUpperCase();
});
ContactSchema.virtual('email_address_sting').get(function(){
  return this.email_address.join("\n");
});



module.exports = mongoose.model('Contact', ContactSchema);
