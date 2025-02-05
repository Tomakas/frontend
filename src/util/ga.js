const ga = {
    sendUserId: function() {
        const userId = localStorage.userId;
        if(userId) {
            window.gtag('config', 'G-D0FGY7GNKV', {
                'user_id': userId
            });
        }
    },

    sendOfficeLogin: function() {
        window.gtag('event', 'login_office');
    },

    sendPaymentInfo: function() {
        window.gtag('event', 'pay_web');
    },

    sendLastPaymentInfo: function(amount,currency,id,date,payItemId) {
        //do not send old payments. Duplicity for new payments should be filtered by google (with id).
        const paymentDate = new Date(date);
        const now = new Date();
        const maxTime14 = 14 * 24 * 60 * 60 * 1000;
        if(now.getTime() - paymentDate.getTime() <= maxTime14){
            window.gtag('event', 'purchase', {
                transaction_id: id,
                value: amount,
                currency: currency,
                items: [
                    {
                        item_id: payItemId,
                        item_name: payItemId
                    }
                ]
            });
        }
    }
}

export default ga;