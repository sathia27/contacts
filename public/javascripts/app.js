
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

  updateItem: function(model){
    var view = new ContactListView({model: model || this.model});
    $("#contacts").append(view.render().el);
  },

  render: function() {
    this.$el.html(this.template);
    return this;
  },

  saveContact: function(){
    var file_obj = $("#pic")[0].files[0];
    // this.model.set({
    //   first_name: $("#first_name").val(),
    //   last_name: $("#last_name").val(),
    //   image: file_obj
    // });
    // this.model.save();
    // return false;
    var data = new FormData( $('form').get(0) );
    var self = this;
    $.ajax('/api/contacts', {
      type:'POST',
      data: data,
      contentType: false,
      success: function(data){ 
        self.model.set(data);
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

