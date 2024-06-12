
const catalogMessage = {
    message:{
        catalog: {
            descriptor: {
                name: "Catalog"
            },
            providers: []
        }
    }
}

const orderMessage = {
    message: {
        order: {
            provider: {}
        }
    }
}
module.exports = { catalogMessage, orderMessage };
