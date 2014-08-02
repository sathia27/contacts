
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
  
  // initialize: function(){
  //   this.model.on("change", this.updateItem, this);
  // },

  // updateItem: function(){
  //   var view = new ContactListView({model: this.model});
  //   $("#contacts").append(view.render().el);
  // },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  uploadAndSaveContact: function(){
    var self = this;
    var id = this.model.id;
    var url = null;
    var method = null;
    if(id){
      url = ('/api/contacts/' + id);
      method = "PUT";
    } else {
      url = '/api/contacts';
      method = "POST";
    }
    $.ajax({
      url: url,
      processData: false,
      cache: false,
      contentType: false,
      type: method,
      data: this.data,
      success: function(result){
        self.postSave(result);
      }
    });
  },

  postSave: function(result){
    console.log("Edit");
    app.navigate("", {trigger: true, replace: true});
  },

  saveContact: function(){
    this.file_obj = $("#pic")[0].files[0];
    this.data = new FormData( $('form').get(0) );
    if(this.file_obj){
      this.data.append('image', this.file_obj); 
    } else{
      this.data.append("no_image", true);
    }
    this.uploadAndSaveContact();
    return false;
  }
});



var ContactView = Backbone.View.extend({

  template: _.template($('#contactViewTemplate').html()),

  events: {
    'click .icon-delete': 'deleteContact',
  },

  deleteContact: function(){
    this.model.destroy();
    app.navigate("", {trigger: true, replace: true});
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
});



var AppRouter = Backbone.Router.extend({
  routes: {
    "": "contactListItem",
    "contacts/new": "contactNew",
    "contacts/:id/edit": "contactEdit",
    "contacts/:id": "contactDetail",
  },

  listItem: function(contact){
    var view = new ContactListView({model: contact});
    $("#contacts").append(view.render().el);
  },

  contactNew: function(){
    $("#contacts,#contact_form").html("");
    var view = new FormView({ model: new Contact({first_name: "", last_name: "", email_address_sting: ""}) });
    $("#contact_form").append(view.render().el);
  },
  
  contactEdit: function(id){
    $("#contacts,#contact_form").html("");
    this.contact = this.contactList.get(id);
    var view = new FormView({ model: this.contact });
    $("#contact_form").append(view.render().el);
  },

  contactListItem: function(){
    $("#contacts,#contact_form").html("");
    this.contactList = new ContactList({});
    this.contactList.on('add', this.listItem, this);
    this.contactList.fetch();
  },

  contactDetail: function(id){
    $("#contacts,#contact_form").html("");
    this.contact = this.contactList.get(id);
    var view = new ContactView({model: this.contact});
    $("#contacts").append(view.render().el);
  }

});

var app = new AppRouter();
Backbone.history.start();

