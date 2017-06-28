var xssFilters = require('xss-filters');

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
        customerRef=xssFilters.inHTMLData(customerRef);
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
    accountExpiringTemplate:  function(url, accountExpiryDate, dayAndMonth){
        var body='';

        body+=' <h1>Sign in if you want to keep your account</h1> ' +
        '<p style="font-size: 14px">As you have not signed in to your legalisation online account for a year it will be deleted on ' + accountExpiryDate + '.</p>' +
        '<br/><p style="font-size: 14px">If you want to keep your account click this link and sign in before ' + dayAndMonth + ':</p>' +
        '<p style="font-size: 14px"><a style="font-weight: bold;" href="' + url + '/sign-in">' + url + '/sign-in</a></p>' +
        '<br/><p style="font-size: 14px">If clicking the link doesn\'t work, copy it into your browser\'s address bar. If you\'ve forgotten your password follow the same link above and click the "Forgotten your password?" link on the page.</p>' +
        '<br/><p style="font-size: 14px">If you do not want to keep your account no further action is needed.</p>';
        return body;
    },
    accountExpiredTemplate:  function(url){
        var body='';

        body+=' <h1>Account deleted</h1> ' +
        '<p style="font-size: 14px">As you have not signed in to your legalisation online account for over a year your account has now been deleted.</p>' +
        '<br/><p style="font-size: 14px">You can register for a new account at any time by clicking this link: </p>' +
        '<p style="font-size: 14px"><a style="font-weight: bold;" href="' + url + '/register">' + url + '/register</a></p>' +
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
            '<li style="font-size: 14px">have a valid practising certificate</li>' +
            '<li style="font-size: 14px">sign the document in the UK</li>' +
            '<li style="font-size: 14px">state the action they have taken eg witnessed, certified a copy, confirmed as original</li>' +
                '<li style="font-size: 14px">use their personal signature, not a company signature</li>' +
                '<li style="font-size: 14px">include the date of certification</li>' +
                '<li style="font-size: 14px">include their name and company address</li>' +
            '</ul>' +
            '<p style="font-size: 14px"><b>The solicitor or notary public’s signature must be an original, hand-written signature. We can\'t accept a photocopy or scan of a signature.</b></p>'+

        '<p style="font-size: 14px">If they add a notarial certificate, it must be attached to the document. The certificate must also contain a specific reference to the document they have certified.</p>' +
            '<p style="font-size: 14px">If a notary public from England, Wales or Northern Ireland signs a document for legalisation, they must also stamp or emboss the document with their notarial seal.</p>' +
            '<p style="font-size: 14px">You can find:</p>'  +
            '<ul style="font-size: 14px">' +
                '<li style="font-size: 14px; font-weight: bold;">solicitors in England and Wales at <a href="http://www.lawsociety.org.uk/">http://www.lawsociety.org.uk/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">notaries public in England and Wales at <a href="http://www.facultyoffice.org.uk/notary/find-a-notary/">http://www.facultyoffice.org.uk/notary/find-a-notary/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">solicitors and notaries public in Scotland at <a href="http://www.lawscot.org.uk/">http://www.lawscot.org.uk/</a></li>'  +
                '<li style="font-size: 14px; font-weight: bold;">solicitors and notaries public in Northern Ireland at <a href="http://www.lawsoc-ni.org/">http://www.lawsoc-ni.org/</a></li>'  +
            '</ul>'  +
            '<br/><p style="font-size: 14px; font-weight: bold;">What happens next?</p>' +
            '<br/><p style="font-size: 14px">Once you have certified all your documents, go back to <a style="font-weight: bold;" href="http://www.gov.uk/get-document-legalised">http://www.gov.uk/get-document-legalised</a> and resubmit your application to get them legalised.</p>';

        return body;
    }
};
