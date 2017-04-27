var globalMethods = {
  hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  },
  hideMe(element){
    document.getElementById(element).style.display = 'none';
  }
}



var addressBook = {
  contacts: [],
  saveContact: function(contactName,contactMobile,contactEmail,isFavorite,familyMember){
    this.contacts.push({
      name: contactName,
      mobile: contactMobile,
      email: contactEmail,
      favorite: isFavorite,
      family: familyMember,
      selected: false,
    });
  },
  updateContact: function(position,contactName,contactMobile,contactEmail,isFavorite,familyMember){
    this.contacts[position].name = contactName;
    this.contacts[position].mobile = contactMobile;
    this.contacts[position].email = contactEmail;
    this.contacts[position].favorite = isFavorite;
    this.contacts[position].family = familyMember;
  },
  toggleSelected:function(position){
    var contact = this.contacts[position];
    contact.selected = !contact.selected;
  },
  deleteContact: function(position){
    this.contacts.splice(position,1);
  },
  deleteSelected : function(){
    var totalContact = this.contacts.length;
    var selectedContacts=[];
    // get posiiton of selected contacts
    this.contacts.forEach(function(contact,position){
      if (contact.selected === true){
        selectedContacts.push(position);
      }
    })
 
    selectedContacts.reverse(); 
    selectedContacts.forEach(function(item,index){
        addressBook.deleteContact(parseInt(item));
        //console.log(item)
      })  
 
     
  },
  toggleAll: function(){
    var totalContact = this.contacts.length;
    var selectedContacts=0;
    // get number of completed todos
   
    this.contacts.forEach(function(contact){
      if (contact.selected === true){
           selectedContacts++;    
      }
    })
    this.contacts.forEach(function(contact){
        //case 1 : if eveything is true, make everythign false
        if(selectedContacts === totalContact){  
          contact.selected = false;
        }
        //case 2 : otherwise, make everythign true 
        else{
          contact.selected = true;
        }
    });
  }
};

var handlers = {
  validationState : true,
  saveContact : function(viewId,position){
    var contactNameTextInput =  document.getElementById('contactNameTextInput');
    var contactMobileNumberInput =  document.getElementById('contactMobileNumberInput');
    var contactEmailInput =  document.getElementById('contactEmailInput');
    var isFavorite = document.getElementById('isFavorite');
    
    validationState = this.validateFormAddContact();
    
    if(validationState === true){
      if(isFavorite.checked === true){
        isFavorite = true;
      }else{
        isFavorite = false;
      }
      var familyMember = document.getElementById('inFamily');
      if(familyMember.checked === true){
        familyMember = true;
      }else{
        familyMember = false;
      }
       
      if(position === null || position === ''){
        
        addressBook.saveContact(contactNameTextInput.value,contactMobileNumberInput.value,contactEmailInput.value,isFavorite,familyMember);
        
      }else{
        
        addressBook.updateContact(position,contactNameTextInput.value,contactMobileNumberInput.value,contactEmailInput.value,isFavorite,familyMember);
        
        
      }
      
      /* clearing fields resetting form*/
      
      view.resetForm();
      view.displayContacts();
      
      if(position === null || position === ''){
        view.switchView(viewId,"add");
      }else{
        view.switchView(viewId,"edit");
      }
    }
    
    
  },
  addNewContact : function(viewId,position){
    view.switchView(viewId);
    var contactForm = document.getElementById(viewId);
    
    if(position !== undefined){
      contactForm.setAttribute('rel',position);
      view.populateForm(position);
      
    }else{
       contactForm.setAttribute('rel','');
       view.resetForm();
       
    }
  },
  viewContactList : function(viewId){
    
    view.switchView(viewId);
    view.displayContacts();
  },
  deleteContact : function(viewId, position){
    addressBook.deleteContact(position);
    if(viewId){
      view.switchView(viewId,"delete");
    }
    view.displayContacts();
  },
  displayContactsDetails : function(viewId,position){
    view.switchView(viewId);
    view.displayContactsDetails(position);
  },
  deleteSelected : function(){
    addressBook.deleteSelected();
    view.displayContacts();
  },
  toggleSelected : function(position){
    addressBook.toggleSelected(position);
    view.displayContacts();
  },
  toggleAll : function(){
    addressBook.toggleAll();
    view.displayContacts();
  },
  validateFormAddContact : function(){
    Form.errorMsg.length =0;
      validName = Form.checkLength(3,"contactNameTextInput","Contact Name");
      validNumber = Form.checkLength(10,"contactMobileNumberInput","Mobile");

      if(validNumber === true){
        validMobile = Form.checkMobile("contactMobileNumberInput","Mobile");
      }

      emailLength = Form.checkNotEmpty("contactEmailInput","Email");
      if(emailLength === true){
        validEmail = Form.checkEmail("contactEmailInput","Email");
      }else{
        validEmail = true;
      }
      
      if(validName === true && validNumber === true && validMobile === true && validEmail === true){
        
        Form.errorMsg.length =0;
        //view.showMessage('reset',);
        return true;
        
      }else{
        view.showMessage('error',Form.errorMsg);
        return false;
      }
      
  }
};



var Form = {
  errorClass : 'ugly',
  errorMsg : [],
  
  checkNotEmpty : function(fieldObj,fieldName){
    fieldObj = document.getElementById(fieldObj);
     if(fieldObj.value.length > 0){
       return true;
     }else{
       return false;
     }
  },
  checkLength : function(size,fieldObj,fieldName){
    fieldObj = document.getElementById(fieldObj);
     if(fieldObj.value.length < size){
       fieldObj.className = this.errorClass;
       this.errorMsg.push(fieldName + " should be atleast " + size + " long");
       return false;
     }else{
        fieldObj.className = '';
       return true;
     }
  },
  checkMobile : function(fieldObj,fieldName){
    fieldObj = document.getElementById(fieldObj);
    var regEx = /^([0-9]+[\.]?[0-9]?[0-9]?|[0-9]+)$/g;
    typeNumber = regEx.test(fieldObj.value);
    if(typeNumber){
      fieldObj.className = '';
      return true;
    }else{
      this.errorMsg.push(fieldName + " should be numberic");
      fieldObj.className = this.errorClass;
      return false;
    }
  },
  checkEmail : function(fieldObj,fieldName){
    fieldObj = document.getElementById(fieldObj);
    var regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    typeEmail = regEx.test(fieldObj.value);
    if(typeEmail){
      fieldObj.className = '';
     // view.showMessage('reset');
      return true;
    }else{
     // msg = fieldName + " should be numberic";
      this.errorMsg.push(fieldName + " should be valid email address eg. something@something.com");
      fieldObj.className = this.errorClass;
    //  view.showMessage('error',this.errorMsg);
      return false;
    }
  }
}
var view = {
  switchView : function(viewId,msg){
    
    var allSections = document.querySelectorAll("section");
    for (var i = allSections.length; i--;) {
      allSections[i].style.display='none';
    }
    viewId = document.getElementById(viewId);
    viewId.style.display='block';
   
    if(msg !== undefined){
      
      switch (msg){
        case 'add' : 
        //msgBlock.innerHTML ="Record added successfully";
        this.showMessage('success','Record added successfully');
        break;
        case "delete":
        this.showMessage('success','Record deleted successfully');  
        
        break;
        case "edit":
      
        this.showMessage('success','Record updated successfully');
        break;
        default:
        
      }
      setTimeout(function() { globalMethods.hideMe("msgBlock"); }, 5000);
      
    }else{
      this.showMessage('reset');
    }
  },
  showMessage : function(state,errorMsg){
    msgBlock = document.getElementById("msgBlock");
    msgBlock.innerHTML = "";
    msgBlock.style.display='block';
    msgBlock.className = '';
    
    if(state === 'reset'){
        msgBlock.className = 'msgBlock';
        msgBlock.style.display='none';
        msgBlock.innerHTML = '';
    }
    else if(state === 'success'){
      msgBlock.className = 'msgBlock success';
      msgBlock.innerHTML = errorMsg;
    }else if(state === 'error'){
      errorList = document.createElement('ul');
      errorList.className = 'errorList';
      
      errorMsg.forEach(function(msg){
          var errorItem = document.createElement('li');
          errorItem.textContent = msg;
          errorList.appendChild(errorItem);
      });
      
      msgBlock.className = 'msgBlock error';
      msgBlock.appendChild(errorList);
    }

    
  },
  resetForm : function(){
    document.getElementById('contactNameTextInput').value = '';
    document.getElementById('contactMobileNumberInput').value = '';
    document.getElementById('contactEmailInput').value = '';
    document.getElementById('isFavorite').checked = false;
    document.getElementById('inFamily').checked = false;
  },
  populateForm: function(position){
    
    document.getElementById('contactNameTextInput').value = addressBook.contacts[position].name;
    document.getElementById('contactMobileNumberInput').value = addressBook.contacts[position].mobile;
    document.getElementById('contactEmailInput').value = addressBook.contacts[position].email;
    
    if(addressBook.contacts[position].favorite === true){
      
      document.getElementById('isFavorite').checked = true;
    }
    
    if(addressBook.contacts[position].family === true){
      
      document.getElementById('inFamily').checked = true;
    }
    
  },
  displayContacts: function(){
    var contactList = document.getElementById('list');
    var emptyList = document.getElementById('emptyList');
    var numberOfContacts = addressBook.contacts.length;
    var actionBar = document.getElementById('actionBar');
    
    if(numberOfContacts === 0){
      emptyList.style.display='block';
      emptyList.textContent = "No Contacts in your list";
      contactList.innerHTML = '';
      contactList.style.display='none';
      actionBar.style.display='none';
    }else{
        emptyList.style.display='none';
        contactList.style.display='block';
        actionBar.style.display='block';
        contactList.innerHTML = '';
        addressBook.contacts.forEach(function(contact,position){
          var contactItem = document.createElement('li');
          contactItem.className = 'item';
          var contactItemName = document.createElement('strong');
          var contactLink = document.createElement('a');
          contactLink.className = 'showDetails switchers';
          contactLink.rel = 'viewContactDetails';
          var contactItemMobile = document.createElement('span');
          var contactSelection = contact.selected;
          contactItemName.textContent = contact.name;
          contactItemMobile.textContent = contact.mobile;
    
          contactLink.appendChild(contactItemName);
          contactLink.appendChild(contactItemMobile);
          contactItem.appendChild(contactLink);
          contactItem.id = position;
          
          if(contactSelection === true){
            contactItem.className += ' selected';
          }else{
            contactItem.className = 'item';
          }
          
          contactItem.insertBefore(this.createCheckBox(position,contactSelection),contactItem.firstChild);
          contactItem.insertBefore(this.createEditLink(),contactItem.firstChild);
          contactItem.insertBefore(this.createDeleteLink(),contactItem.firstChild);
          contactList.appendChild(contactItem);
        },this);
    }  
  },
  displayContactsDetails : function(position){
    
    
    var contactInformation = document.getElementById('contactInformation');
    contactInformation.rel = '';
    contactInformation.innerHTML = '';
    var obj = addressBook.contacts[position];
    for (var prop in obj) {
        // skip loop if the property is from prototype
        if(!obj.hasOwnProperty(prop)) continue;
        // console.log(prop + " = " + obj[prop]);
        
        var contactData = document.createElement('p');
        var contactDataLabel = document.createElement('strong');
        var contactDataValue = document.createElement('span');
          
        contactDataLabel.textContent = prop;
        contactDataValue.textContent = obj[prop];
        contactData.appendChild(contactDataLabel);
        contactData.appendChild(contactDataValue);

        contactInformation.appendChild(contactData);
        contactInformation.setAttribute('rel',position);
    };
  },
  createCheckBox : function(position,contactSelection){
    var selectCheckBox = document.createElement('input');
    selectCheckBox.type = "checkbox";
    selectCheckBox.name = "selectBox";
    selectCheckBox.value = position;
    selectCheckBox.id = position;
    selectCheckBox.className += 'selectBox';
    if(contactSelection === true){
      selectCheckBox.checked = true;
    }else{
      selectCheckBox.checked = false;
    }
    return selectCheckBox;
  },
  createEditLink : function(position){
    var editLink = document.createElement('a');
    editLink.textContent = "Edit";
    editLink.rel = 'addEditContactForm';
    editLink.className += 'actionBtn editContact';
    return editLink;
  },
  createDeleteLink : function(position){
    var deleteLink = document.createElement('a');
    deleteLink.textContent = "Delete";
    deleteLink.rel = 'contactList';
    deleteLink.className += 'actionBtn deleteContact';
    return deleteLink;
  },
  setupEventListeners : function(){
      var contactList = document.querySelector('ul');
   
      contactList.addEventListener('click',function(event){
        var elementClicked = event.target;
        
        if(elementClicked.className === 'selectBox'){
          
          if(elementClicked.checked === true){
            elementClicked.parentNode.className += ' selected';
          }else{
            elementClicked.parentNode.className = 'item';
          }
          handlers.toggleSelected(parseInt(elementClicked.parentNode.id));
        }
        
        /* if ((elementClicked.tagName.toLowerCase() === 'strong') || (elementClicked.tagName.toLowerCase() === 'span')){
          console.log(elementClicked);
          if(globalMethods.hasClass(elementClicked,'selected')){
            
            elementClicked.className = 'item';
            elementClicked.querySelector('input').checked = false;
            
          }else{
            console.log('add selected');
            elementClicked.className += ' selected';
            elementClicked.querySelector('input').checked = true;
          }
          
        }
         */
         
        if ((elementClicked.tagName.toLowerCase() === 'strong') || (elementClicked.tagName.toLowerCase() === 'span')){
           
            handlers.displayContactsDetails(elementClicked.parentNode.rel,parseInt(elementClicked.parentNode.parentNode.id));
        }
         
        
        if(globalMethods.hasClass(elementClicked,'deleteContact')){
          handlers.deleteContact(elementClicked.rel,parseInt(elementClicked.parentNode.id));
        }
        if(globalMethods.hasClass(elementClicked,'editContact')){
          handlers.addNewContact(elementClicked.rel,parseInt(elementClicked.parentNode.id));
        }
        
      });
    
  }
};
view.displayContacts();
view.setupEventListeners();