const main = require('../main/main.js');
const datbase =require('../main/datbase.js');
var formatTags = main.formatTags;
var mergeBarcodes = main.mergeBarcodes;
var getCartItems = main.getCartItems;
var getSubTotalItems =main.getSubTotalItems;
var getTotal =main.getTotal;
var getDiscountItems =main.getDiscountItems;
var getDiscountTotal =main.getDiscountTotal;
var getSaveMoney =main.getSaveMoney;
var print=main.print;
var loadAllItems = datbase.loadAllItems;
var loadPromotions = datbase.loadPromotions;
describe("formatTags", function(){
        it("should get a barcodes", function(){
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

            var answer = formatTags(tags);
            var result = [
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000003", amount: 2},
                {barcode: "ITEM000005", amount: 1},
                {barcode: "ITEM000005", amount: 1},
                {barcode: "ITEM000005", amount: 1},
            ];

            expect(answer).toEqual(result);
        });
    });

    describe("mergeBarcodes", function(){
        it("should get items with merged amount", function(){
            var input = [
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000001", amount: 1},
                {barcode: "ITEM000003", amount: 2},
                {barcode: "ITEM000005", amount: 1},
                {barcode: "ITEM000005", amount: 1},
                {barcode: "ITEM000005", amount: 1}];
            var output = mergeBarcodes(input);
            var result = [
                {barcode: "ITEM000001", amount: 5},
                {barcode: "ITEM000003", amount: 2},
                {barcode: "ITEM000005", amount: 3},
            ];
            expect(output).toEqual(result);
});
});

    describe("getCartItems", function(){
        it("should return items with information", function(){
            var input = [
                {barcode: "ITEM000001", amount: 5},
                {barcode: "ITEM000003", amount: 2},
                {barcode: "ITEM000005", amount: 3},
            ];
            var output = getCartItems(input,loadAllItems());
            var result = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3
                }
        ];
            expect(output).toEqual(result);
        });
    });

    describe("getSubTotalItems", function(){
        it("should return items with subtotal", function(){
            var input = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3
                }
            ];
            var output = getSubTotalItems(input);
            var result = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5
                }
            ];
            expect(output).toEqual(result);
        });
    });
    describe("getTotal", function(){
        it("should print not discounted total", function(){
            var input = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5
                }
            ];
            var output = getTotal(input);
            expect(output).toEqual(58.5);
        })
    });

    describe("getDiscountItems", function(){
        it("should print items with discounted subtotal", function(){
            var input = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5
                }
            ];
            var output = getDiscountItems(input, loadPromotions());
            var result = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15,
                    discountSubTotal: 12
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00,
                    discountSubTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5,
                    discountSubTotal: 9
                }
            ];
            expect(output).toEqual(result);
        })
    });

    describe("getdiscountTotal", function(){
        it("should get discounted total", function(){
            var input = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15,
                    discountSubTotal: 12
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00,
                    discountSubTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5,
                    discountSubTotal: 9
                }
            ];;
            var output = getDiscountTotal(input);
            var result = 51.00;
            expect(output).toEqual(result);
        })
    });

    describe("getSaveMoney", function(){
        it("should print savemoney", function(){
            var input = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15,
                    discountSubTotal: 12
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00,
                    discountSubTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5,
                    discountSubTotal: 9
                }
            ];
            var output = getSaveMoney(getTotal(input), getDiscountTotal(input));
            expect(output).toEqual(7.5);
        })
    });

    describe("printReceipt", function(){
        it("should print receipts", function(){
            var inputOne = [
                {
                    barcode: 'ITEM000001',
                    name: '雪碧',
                    unit: '瓶',
                    price: 3.00,
                    amount: 5,
                    subTotal: 15,
                    discountSubTotal: 12
                },
                {
                    barcode: 'ITEM000003',
                    name: '荔枝',
                    unit: '斤',
                    price: 15.00,
                    amount: 2,
                    subTotal: 30.00,
                    discountSubTotal: 30.00
                },
                {
                    barcode: 'ITEM000005',
                    name: '方便面',
                    unit: '袋',
                    price: 4.50,
                    amount: 3,
                    subTotal: 13.5,
                    discountSubTotal: 9
                }
            ];
            var inputTwo = getDiscountTotal(inputOne);
            var inputThree = getSaveMoney(getTotal(inputOne), getDiscountTotal(inputOne));
            var output = print(inputOne, inputTwo, inputThree);
            var result =  '***<没钱赚商店>购物清单***' +"\n" +
            "名称:雪碧, 数量:5, 单价:3(元), 小计:12(元)" + "\n" +
            "名称:荔枝, 数量:2, 单价:15(元), 小计:30(元)" + "\n" +
            "名称:方便面, 数量:3, 单价:4.5(元), 小计:9(元)" + "\n" +
            "----------------------------" + "\n" +
            '挥泪赠送商品：\n' +
            '名称：雪碧，数量：1瓶\n' +
            '名称：方便面，数量：1袋\n' +
            '----------------------\n' +
            "总计:51.00(元)" + "\n" +
            "节省:7.50(元)" + "\n" +
            '**********************';
            expect(output).toEqual(result);
        });
    });