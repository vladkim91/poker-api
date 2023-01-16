

exports.Query = {
    // calcWinner: (parent, args, context) => {
    //     console.log(args, parent)
    //     return args
    // },
    players: (parent, args, { db }) => {

        return db.players
    }
    // products: (parent, { filter }, { db }) => {
    //     let filteredProducts = db.products
    //     if (filter) {
    //         if (filter.onSale === true) {
    //             filteredProducts = filteredProducts.filter(product => {
    //                 return product.onSale
    //             })
    //         } else if (filter.onSale === false) {
    //             filteredProducts = filteredProducts.filter(product => {
    //                 return !product.onSale
    //             })
    //         }
    //         if (filter.averageRating) {

    //             filteredProducts = db.products.filter(product => {
    //                 const productReviews = db.reviews.filter(review => review.productId === product.id).map(review => review.rating)

    //                 let avgRating = productReviews.reduce((acc, cur) => acc += cur, 0) / productReviews.length
    //                 return avgRating >= filter.averageRating

    //             })

    //         }
    //     }
    //     return filteredProducts
    // }
    // ,
    // product: (parent, { id }, { db }) => {
    //     return db.products.find(product => product.id === id)
    // },
    // categories: (parent, args, { db }) => db.categories
    // ,
    // category: (parent, { id }, { db }) => {
    //     return db.categories.find(category => category.id === id)
    // }
}