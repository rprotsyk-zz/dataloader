import * as mongoose from 'mongoose';
//Program Identifier|Data Source|Card Number|Member ID|First Name|Last Name|Date of Birth|Address 1|Address 2|City|State|Zip code|Telephone number|Email Address|CONSENT|Mobile Phone
//50777445|WEB 3RD PARTY|342121211|43233|LOAD|TEST 0|04/29/2000|3100 S Ashley Drive||Chandler|AZ|85286||test0@humancaresystems.com|Y|1234567912
export const PatientSchema = new mongoose.Schema({
    programIdentifier: Number,
    dataSource: String,
    cardNumber: Number,
    memberId: Number,
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zipCode: Number,
    telephone: String,
    email: String,
    consent: String,
    mobile: Number,
    fileId: String
});
