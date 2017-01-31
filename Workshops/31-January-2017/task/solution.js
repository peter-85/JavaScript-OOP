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
        let products = [];
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
                throw new Error('klgjfd');
            },
            showCost: function() {
                let sum = 0;
                for (let i = 0; i < products.length; i += 1) {
                    sum += products[i].price;
                }
                return sum;
            },
            showProductTypes: function() {
                return produc.map(x => x.productType).sort().filter((x, index, arr) => x !== arr[index - 1]);
            }
        }
    }


    return {
        getProduct: getProduct,
        getShoppingCart: getShoppingCart
    };
}

module.exports = solve();