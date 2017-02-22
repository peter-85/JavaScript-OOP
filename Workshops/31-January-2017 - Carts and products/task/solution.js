function solve() {
    function getProduct(productType, name, price) {

        let product = {
            productType: productType,
            name: name,
            price: price
        }

        return product;
    }

    function getShoppingCart() {
        let products = []; // Masiva se syzdava samo 1 pyt
        return {
            products: products,
            add: function(product) {
                products.push(product);
                return this; // This is chaining
            },
            remove: function(product) {
                if (!products.length) {
                    throw new Error('Empty cart products');
                }
                for (let i = 0; i < products.length; i += 1) {
                    if (product.productType === products[i].productType &&
                        product.name === products[i].name &&
                        product.price === products[i].price) {
                        products.splice(i, 1);
                        return this; // Polzvame return vmesto break za da izlezem ot funkciqta, break izliza ot cikyla
                    }
                }
                throw new Error('There is no such a product');
            },
            showCost: function() {
                let sum = 0;
                for (let i = 0; i < products.length; i += 1) {
                    sum += products[i].price;
                }
                return sum;
            },
            showProductTypes: function() {
                //return products.map(x => x.productType).sort().filter((x, index, arr) => x !== arr[index - 1]);
                // Polzvame filter s 3 argumenta, zastoto mi trqbvat indeksa i masiva
                var uniqueTypes = {};
                products.forEach(p => uniqueTypes[p.productType] = true);
                return Object.keys(uniqueTypes).sort();
            },
            getInfo: function() {
                /*
                var uniqueNames = [];
                uniqueNames = products.map(x => x.name)
                    .sort()
                    .filter((x, index, arr) => x !== arr[index - 1])
                    .map(name => {
                        const withThisName = products.filter(p => p.name === name);
                        return {
                            name: name,
                            quantity: withThisName.length,
                            totalPrice: withThisName.reduce((cost, product) => cost + product.price, 0)
                        };
                    });

                return {
                    products: uniqueNames,
                    totalPrice: this.showCost()
                };*/
                var groupedByNames = {};
                products.forEach(p => {
                    if (groupedByNames.hasOwnProperty(p.name)) {
                        groupedByNames[p.name].quantity += 1;
                        groupedByNames[p.name].totalPrice += p.price;
                    } else {
                        groupedByNames[p.name] = {
                            name: p.name,
                            quantity: 1,
                            totalPrice: p.price
                        };
                    }
                });
                const groups = Object.keys(groupedByNames)
                    .sort()
                    .map(p => {
                        return {
                            name: groupedByNames[p].name,
                            quantity: groupedByNames[p].quantity,
                            totalPrice: groupedByNames[p].totalPrice
                        }
                    })

                return {
                    //products: Object.values(groupedByNames).sort(p => p.name),
                    products: groups,
                    totalPrice: this.showCost()
                };
            }
        };
    }

    return {
        getProduct: getProduct,
        getShoppingCart: getShoppingCart
    };
}

module.exports = solve();

const { getProduct, getShoppingCart } = solve();

let cart = getShoppingCart();

let pr1 = getProduct("Sweets", "Shokolad Milka", 2);
cart.add(pr1);
console.log(cart.showCost());
// prints `2`

let pr2 = getProduct("Groceries", "Salad", 0.5);
cart.add(pr2);
cart.add(pr2);
console.log(cart.showCost());
// prints `3`

console.log(cart.showProductTypes());
// prints [ 'Groceries', 'Sweets' ]

console.log(cart.getInfo());