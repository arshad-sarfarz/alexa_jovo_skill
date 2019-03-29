'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const rp = require('request-promise');

const app = new App();

var PinCode;
var PhoneNumber;
const AuthURL = "https://arshadsarfarz.auth0.com/userinfo";
const APIURL = "";
const waitingSpeech = "I am waiting for your inputs";

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async LAUNCH() {
        console.log("Launch Alexa Skill");
        if (!this.$request.getAccessToken()){
            this.$alexaSkill.showAccountLinkingCard();
            this.tell("Please link your Account");
        } else {
            let token = this.$request.getAccessToken();
            let options = {
                method : 'GET',
                uri: AuthURL,
                headers: {authorization: 'Bearer ' + token}
            }
            console.log(options);
            await rp(options).then((body) => {
                let data = JSON.parse(body);
                let speech = "Hello " + data.name + "  How can i help you I can provide assistance on open enrollment and policy servicing";
                //CreateSimpleResponse(this, speech);
                CreateFormattedResponse(this, speech);
            });
        }
    },

    OEGetDoctors() {
        let speech = "The following doctors are in the network John Doe, Alice and Bob";
        CreateSimpleResponse(this, speech);
    },
    OEGetDeductible() {
        let speech = "Your Deductible is 10%";
        CreateSimpleResponse(this, speech);
    },
    OEGetOutOfPocket() {
        let speech = "Your Out of Pocket maximum is 15%";
        CreateSimpleResponse(this, speech);
    },
    PSGetAddress() {
        let speech = "Your Pincode is " +  PinCode;
        CreateSimpleResponse(this, speech);
    },
    PSGetContactNumber() {
        let speech = "Your Phone number is " +  PhoneNumber;
        CreateSimpleResponse(this, speech);
    },
    PSSaveAddress() {
        PinCode = this.$inputs.pincode.value;
        let speech = "your pincode " + PinCode + " has been successfully updated";
        CreateSimpleResponse(this, speech);
    },
    PSSaveContactNumber() {
        PhoneNumber = this.$inputs.phonenumber.value;
        let speech = "your Phone number " + PhoneNumber + " has been successfully updated";
        CreateSimpleResponse(this, speech);
    }
});

const CreateSimpleResponse = (instance, speech) => {
    instance.$alexaSkill.showSimpleCard("Insurance Query Reloaded", speech);
    instance.tell(speech);
}

const CreateFormattedResponse = (instance, speech) => {
    let listTemplate1 = instance.$alexaSkill.templateBuilder('ListTemplate1');

    listTemplate1.setTitle('Title')
      .setToken('token')
      .addItem(
        'token',
        {
          description: 'Policy Name: Critical Illness Insurance',
          url: 'https://via.placeholder.com/1200x1000',
        },
        'Pol No: 123456',
        'Pol Ex Date: 2019-12-31',
        'Pol Cash Val: 4000 USD'
      ).addItem(
        'token',
        null,
        'primary text',
        'secondary text',
        'tertiary text'
      );
    
    instance.$alexaSkill.showDisplayTemplate(listTemplate1);
    instance.tell(speech);
}


module.exports.app = app;
