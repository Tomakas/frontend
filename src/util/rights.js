
const rights = {
    hasRight: function (requiredRight) {
        const role = localStorage.getItem('role');
        if(role === 'admin') {
            //always
            return true;
        }
        if(role === 'none') {
            return false;
        }
        let rights = localStorage.getItem('rights');
        if(rights === null) {
            return false;
        }
        const rightArray = rights.split(",");
        return rightArray.includes(requiredRight);
    },

    getDefaultPage: function () {
        if(this.hasRight(this.codes.allSales)) {
            return "/overview";
        }
        if(this.hasRight(this.codes.allReceipts)) {
            return "/receipts";
        }
        if(this.hasRight(this.codes.stock)) {
            return "/stock";
        }
        if(this.hasRight(this.codes.salesItem)) {
            return "/items";
        }
        if(this.hasRight(this.codes.orders)) {
            return "/orders";
        }
        if(this.hasRight(this.codes.rightSalesItem)) {
            return "/items";
        }
        if(this.hasRight(this.codes.companySettings)) {
            return "/company";
        }
        //no access to office
        return null;
    },

    rightsToLocalStorage: function (rights) {
        localStorage.rights = rights.join(",");
    },

    codes : {
        cashRegisterSettings : 'cashRegisterSettings',
        companySettings : 'companySettings',
        salesItem : 'salesItem',
        deleteReceipt : 'deleteReceipt',
        createNegativeReceipt : 'createNegativeReceipt',
        updateBill : 'updateBill',
        addDiscount : 'addDiscount',
        shiftSales : 'shiftSales',
        allSales : 'allSales',
        exportSales : 'exportSales',
        allReceipts : 'allReceipts',
        orders : 'orders',
        stock : 'stock',
        createCustomer : 'createCustomer',
        updateCustomer : 'updateCustomer'
    }
}

export default rights;