
var Contact = Backbone.Model.extend({
  idAttribute: "_id",
  urlRoot: "/api/contacts"
});

var ContactList = Backbone.Collection.extend({
  model: Contact,
  url: "/api/contacts"
});

var ContactListView = Backbone.View.extend({

  template: _.template($('#contactTemplate').html()),
  initialize: function() {
    this.model.bind('change', this.render, this);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});

var FormView = Backbone.View.extend({
  template: _.template($('#formTemplate').html()),
  events: {
    'submit form': 'saveContact'
  },
  
  initialize: function(){
    this.model.on("change", this.updateItem, this);
  },

  updateItem: function(){
    var view = new ContactListView({model: this.model});
    $("#contacts").append(view.render().el);
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  saveContact: function(){
    var file_obj = $("#pic")[0].files[0];
    var data = new FormData( $('form').get(0) );
    data.append('image', file_obj);
    var self = this;
    $.ajax({
      url: '/api/contacts',
      enctype: 'multipart/form-data',
      processData: false,
      cache: false,
      contentType: false,
      type: 'POST',
      data: data,
      success: function(data){
        var reader = new FileReader();
        reader.onload = function(e) {
          if(reader.result){
            data.photo = { thumb: { path: '/', temp: reader.result } };
          }
          self.model.set(data);
        };
        reader.readAsDataURL(file_obj);
      }
    });
    return false;
  }
});



var ContactView = Backbone.View.extend({

  template: _.template($('#contactViewTemplate').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});



var AppRouter = Backbone.Router.extend({
  routes: {
    "": "contactListItem",
    "contacts/:id": "contactDetail",
  },
  

  listItem: function(contact){
    var view = new ContactListView({model: contact});
    $("#contacts").append(view.render().el);
  },


  contactListItem: function(){
    $("#contacts").html("");
    var view = new FormView({ model: new Contact() });
    $("#contact_form").append(view.render().el);
    this.contactList = new ContactList({});
    this.contactList.on('add', this.listItem, this);
    this.contactList.fetch();
  },

  contactDetail: function(id){
    $("#contacts,#contact_form").html("");
    if(!this.contactList){
      this.contactList = new ContactList({});
      this.contactList.fetch();
    }
    this.contact = this.contactList.get(id);
    var view = new ContactView({model: this.contact});
    $("#contacts").append(view.render().el);
  }

});

var app = new AppRouter();
Backbone.history.start();

