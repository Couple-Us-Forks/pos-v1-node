const datbase = require('../main/datbase.js')
module.exports ={formatTags:formatTags,mergeBarcodes:mergeBarcodes,getCartItems:getCartItems 
,getSubTotalItems:getSubTotalItems,getTotal:getTotal,getDiscountItems:getDiscountItems,
getDiscountTotal:getDiscountTotal,getSaveMoney:getSaveMoney,print:print}
var tags = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
    ];

function printReceipt() {
    var allItems = loadAllItems();
    var promotions = loadPromotions();
    var barcodes = formatTags(tags);
    var mergedItems = mergeBarcodes(barcodes);
    var cartItems = getCartItems(mergedItems, allItems);
    var subTotalItems = getSubTotalItems(cartItems);
    var total = getTotal(subTotalItems);
    var discountItems = getDiscountItems(subTotalItems, promotions);
    var discountTotal = getDiscountTotal(discountItems);
    var save = getSaveMoney(total, discountTotal);
    print(subTotalItems, discountTotal, save);
}

function formatTags(tags){
    return tags.map((tag) => {
        var splitTag = tag.split("-");
        return {barcode: splitTag[0], amount: parseFloat(splitTag[1] || 1)};
    })
}

function mergeBarcodes(barcodes){
    var mergedItems= [];
    for(var barcode of barcodes){
        var exsitItem = mergedItems.find((item) => {
            return item.barcode === barcode.barcode;
        });
        if(exsitItem){
            exsitItem.amount += barcode.amount;
        }else{
            mergedItems.push({barcode: barcode.barcode, amount: barcode.amount});
        }
    }
    return mergedItems;
}

function getCartItems(mergedItems, allItems){
    var cartItems = [];
    for(var mergedItem of mergedItems){
        var exsitItem = allItems.find((item) => {
            return item.barcode === mergedItem.barcode;
        });
        cartItems.push(Object.assign({}, exsitItem, {amount: mergedItem.amount}));
    }
    return cartItems;
}

function getSubTotalItems(cartItems){
    var subTotalItems = [];
    for(var item of cartItems){
        var subTotal = item.amount * item.price;
        subTotalItems.push(Object.assign({}, item, {subTotal: subTotal}));
    }
    return subTotalItems;
}

function getTotal(subTotalItems){
    var total = 0;
    for(var item of subTotalItems){
        total += item.subTotal;
    }
    return total;
}

function getDiscountItems(subTotalItems, promotions){
    for(var item of subTotalItems){
        var exsitItem = promotions.find((element) => {
            return element.barcodes.find((barcode) => {
                return barcode === item.barcode;
            });
        });
        if(exsitItem && exsitItem.type === 'BUY_TWO_GET_ONE_FREE'){
            item.discountSubTotal = item.subTotal - parseInt(item.amount / 3) * item.price;    //此处改变优惠商品的小计，为打折后的价格，返还原来的数组
        }else{
            item.discountSubTotal = item.subTotal;
        }

    }
    return subTotalItems;
}

function getDiscountTotal(discountItems){
    var discountTotal = 0;
    for(var item of discountItems){
        discountTotal += item.discountSubTotal;
    }
    return discountTotal;
}

function getSaveMoney(total, discountTotal){
    var save = total - discountTotal;
    return save;
}
function print(subTotalItems, discountTotal, save){
    var receipt = '***<没钱赚商店>购物清单***\n';
    for(var item of subTotalItems){
        receipt += "名称：" + item.name + "，数量：" + item.amount + "，单价：" + item.price + "(元)" + "，小计：" + item.discountSubTotal
            + "(元)\n"
    }

    receipt +=  ("----------------------------\n" +'挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' + "总计：" + discountTotal.toFixed(2) + "(元)\n"
    + "节省：" + save.toFixed(2)+ "(元)\n" + '**********************');
    return receipt;
}
