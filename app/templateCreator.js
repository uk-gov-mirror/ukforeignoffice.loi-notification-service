module.exports =  {

    emailConfirmationTemplate: function(token, url){
        var body='';

        body+=' <h1>Confirm your email address</h1> ' +
            '<p style="font-size: 14px">Thank you for registering for a legalisation online account. To confirm your email address and activate your account, click this link:</p>' +
            '<br/><p style="font-size: 14px; font-weight: bold;"><a href="'+url+'/activate/'+token+'">'+url+'/activate/'+token+'</a></p>' +
            '<br/><p style="font-size: 14px;">If clicking the link doesn\'t work, copy it into your browser\'s address bar.</p>' +
            '<p style="font-size: 14px;">This link will expire in 24 hours.</p>';

        return body;
    },

    submissionConfirmationTemplate:  function(reference, addressBody, url, customerRef){
        var body='<style>p {font-size: 14px}</style>';

        if(customerRef !== "undefined" && customerRef !== null && customerRef !== ""){

            body+=' <h1>Application confirmation</h1> ' +
                '<p style="font-size: 14px">You\'ve successfully submitted your legalisation application. Your application reference number is ' + reference + '. Your own reference for this application is ' + customerRef + '.</p>' +
                '<br/><p style="font-size: 14px; font-weight: bold;">What to do next</p>' +
                addressBody[0] +
                '<table style="table-layout: fixed;width: 95%;"><tbody><tr><td> ' +  addressBody[1]+ '</td>' +
                '<td>' +
                '<img src="'+url+'/qr-code-converter/'+reference+'" style="margin: 0 auto;display: block;">' +
                '</td> </tr> </tbody></table>';
            
        }else {

            body+=' <h1>Application confirmation</h1> ' +
                '<p style="font-size: 14px">You\'ve successfully submitted your legalisation application. Your application reference number is ' + reference + '.</p>' +
                '<br/><p style="font-size: 14px; font-weight: bold;">What to do next</p>' +
                addressBody[0] +
                '<table style="table-layout: fixed;width: 95%;"><tbody><tr><td> ' +  addressBody[1]+ '</td>' +
                '<td>' +
                '<img src="'+url+'/qr-code-converter/'+reference+'" style="margin: 0 auto;display: block;">' +
                '</td> </tr> </tbody></table>';

        }


        return body;
    },

    resetPasswordTemplate: function(token,url){
        var body='';

        body+=' <h1>Reset your password</h1> ' +
            '<p style="font-size: 14px">You\'re receiving this email because you requested a link to change the password for your legalisation online account.</p>' +
            '<p style="font-size: 14px">To change your password click on this link then follow the instructions:</p>' +
            '<br/><p style="font-size: 14px; font-weight: bold;"><a href="' + url + '/reset/' + token + '">' + url + '/reset/' + token + '</a></p>' +
            '<br/><p style="font-size: 14px">If clicking the link doesn\'t work, copy it into your browser\'s address bar. The link will be valid for 1 hour.</p>' +
            '<p style="font-size: 14px">If you did not request this, please ignore this email and your password will remain unchanged.</p>';

        return body;
    },


    passwordUpdatedTemplate: function(){
        var body='';

        body+=' <h1>Password updated</h1> ' +
            '<p style="font-size: 14px">You\'ve successfully updated the password for your legalisation online account.</p>' +
            '<p style="font-size: 14px">Remember to use your new password next time you sign in.</p>';

        return body;
    },

    accountLockedTemplate:  function(name, email,url ){
        var body='';

        body+=' <h1>Account locked</h1> ' +
            '<p style="font-size: 14px">Your legalisation online account has been locked because the password was entered incorrectly too many times.</p>' +
            '<p style="font-size: 14px">To unlock your account you need to reset your password. To do this click on the following link then follow the instructions:</p>' +
            '<br/><p style="font-size: 14px; font-weight: bold;"><a href="' + url + '/forgot?locked=true">' + url + '/forgot</a></p>' +
            '<br/><p style="font-size: 14px">If clicking the link doesn\'t work, copy it into your browser\'s address bar.</p>';

        return body;
    },

    failedDocumentTemplate: function (failed_certs_string){
        var body = '';
        var failed_certs = JSON.parse(failed_certs_string);

        var docLabel = (failed_certs.length > 1) ? 'documents' : 'document';

        body+=' <h1>Get your ' + docLabel + ' certified</h1>' +
            '<p style="font-size: 14px">You asked us to send this information to you while checking whether your documents can be legalised.</p>' +
            '<p style="font-size: 14px">Before submitting your application you need to get the following ' + docLabel + ' certified:</p>' +
            '<ul style="font-size: 14px">';

        var failedCertList = '';
        for(var i=0; i<failed_certs.length; i++) {
            failedCertList += '<li style="font-size: 14px">' + failed_certs[i].doc_title + '</li>';
        }

        body+= failedCertList +
            '</ul>' +
            '<br/><p style="font-size: 14px; font-weight: bold;">Certifying documents</p>' +
            '<br/><p style="font-size: 14px">Certain documents must be certified in the UK by a solicitor or \'notary public\' before they can be legalised.</p>' +
            '<p style="font-size: 14px">When the solicitor or notary public signs the document, they must:</p>' +
            '<ul style="font-size: 14px">' +
                '<li style="font-size: 14px">state the action they have taken eg witnessed, certified a copy, confirmed as original</li>' +
                '<li style="font-size: 14px">use their personal signature, not a company signature</li>' +
                '<li style="font-size: 14px">include the date of certification</li>' +
                '<li style="font-size: 14px">include their name and company address</li>' +
            '</ul>' +
            '<p style="font-size: 14px">If they add a notarial certificate, it must be attached to the document. The certificate must also contain a specific reference to the document they have certified.</p>' +
            '<p style="font-size: 14px">If a notary public from England, Wales or Northern Ireland signs a document for legalisation, they must also stamp or emboss the document with their notarial seal.</p>' +
            '<p style="font-size: 14px">You can find:</p>'  +
            '<ul style="font-size: 14px">' +
                '<li style="font-size: 14px; font-weight: bold;">solicitors in England and Wales at <a href="http://www.lawsociety.org.uk/">http://www.lawsociety.org.uk/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">notaries public in England and Wales at <a href="http://www.facultyoffice.org.uk/notary/find-a-notary/">http://www.facultyoffice.org.uk/notary/find-a-notary/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">solicitors and notaries public in Scotland at <a href="http://www.lawscot.org.uk/">http://www.lawscot.org.uk/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">solicitors and notaries public in Northern Ireland at <a href="http://www.lawsoc-ni.org/">http://www.lawsoc-ni.org/</a></li>'  +
            '</ul>'  +

            '<p style="font-size: 14px">You may be able to get your document certified at a British embassy. Check if this service is offered in the country you’re in at <a style="font-weight: bold;" href="https://www.gov.uk/government/world/embassies">https://www.gov.uk/government/world/embassies</a>.</p>'  +

            '<br/><p style="font-size: 14px; font-weight: bold;">What happens next?</p>' +
            '<br/><p style="font-size: 14px">Once you have certified all your documents, go back to <a style="font-weight: bold;" href="http://www.gov.uk/get-document-legalised">http://www.gov.uk/get-document-legalised</a> and resubmit your application to get them legalised.</p>';

        return body;
    }
};
