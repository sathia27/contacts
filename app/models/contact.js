var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var thumbnailPluginLib = require('mongoose-thumbnail');
var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var path = require("path");
var uploads_base = path.join(__dirname, "../../public/uploads");
var uploads = path.join(uploads_base, "u");

console.log(uploads);
console.log(uploads_base);

var ContactSchema = new Schema({
    first_name: {type: String, index: true},
    last_name: String,
    tags: Array,
    created_at: Date,
    email_address: Array,
    updated_at: Date
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


module.exports = mongoose.model('Contact', ContactSchema);
