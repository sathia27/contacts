var Contact = require('../models/contact');
exports.home = function(request, response){
  response.render("contacts/home");
};

exports.index = function(request, response){
  Contact.find({}, function(error, contacts){
    return response.send(contacts);
  });
};

exports.add = function(request, response){
  contact = new Contact(request.body);
  if(request.files && request.files.image) contact.set('photo.file', request.files.image[0]);
  contact.save(function(error, contact){
    if(error){
      response.send(400, 'Cannot save');
    } else{
      response.send(contact);
    }
  });
};

exports.update = function(request, response){
  Contact.update({_id: request.params.id}, {$set: request.body}, function(error, contact){
    if(error){
      console.log(error);
      response.send(400, 'Cannot update');
    } else{
      response.send(contact);
    }
  });
};

exports.remove = function(request, response){
  Contact.findById(request.params.id, function(error, contact){
    if(error || !contact){
      response.send(400, "Could not delete contact.");
    } else{
      contact.remove();
      return response.send("Contact " + request.params.id + " has been deleted.");
    }
  });
};
