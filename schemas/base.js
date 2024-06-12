
const catalogMessage = {
    message:{
        catalog: {
            descriptor: {
                name: "Catalog for English courses"
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
