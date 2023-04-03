const typeDefs = `
type Customer {
    id: ID!
    name: String
    email: String
    phoneNumber: String
    addresses: [Address]
    wishlist: [Product]
    password: String
    photo: String
    cart: [Order]!
    createdAt: String
}

type Address {
    constituency: String
    county: String
    country: String
    default: Boolean  
}

type LowLevel {
    id: ID!
    label: String
    midLevel : MidLevel
}

type MidLevel {
    id: ID!
    label: String
    topLevel: TopLevel  
}

type TopLevel {
    id: ID!
    label: String
}

type LLM {
    id: ID
    label: String    
}

type MLM {
    id: ID
    label: String
    lowLevels: [LLM]!
}

type Category {
    id: ID
    topLevel: String
    midLevels: [MLM]!    
}

type Order {
    id: ID!
    product: Product
    quantity: Int
    price: Int  
    variantIndex: Int
    placementDate: String
    packagedDate: String
    shippedDate: String
    disbursementDate: String
    createdAt: String
}

type Post {
    id: ID!
    caption: String
    images: [String]
    seller: Seller
    createdAt: String
}

type Product {
    id: ID!
    name: String
    ratings: [Int]
    reviews: [Review]
    soldQuantity: Int
    price: Int
    priceBefore: Int
    flashEnd: String
    tags: [String]
    seller: Seller
    category: LowLevel
    description: String
    single: Boolean
    variant: [Variant]
    sizes: [String]
    fromAbroad: Boolean
    images: [String]
    soldOut: Boolean
    removed: Boolean
}

type Review {
    customer: Customer
    text: String
    timestamp: String
}

type Variant {
    image: String
    label: String
    removed: Boolean
    quantity: Int
}

type Seller {
    id: ID!
    name: String
    image: String
    description: String
    email: String
    password: String
    phoneNumber: String
    location: Location
    carousels: [String]
    createdAt: String
}

type Location {
    constituency: String
    county: String
    country: String
    description: String
}

type Transaction {
    id: ID
    payment: Payment
    orders: [String]
}

type Payment {
    transactionCode: String
    paymentMode: String
    amount: Int
    timestamp: String
}


type Query { 
    getSellers : [Seller]!
    getCategories: [Category]!
}

type Mutation {
  createSeller(
        name: String
        image: String
        description: String
        email: String
        password: String
        phoneNumber: String       
        carousels: [String]          
    ): Seller

    createProduct(
        name: String!
        price: Int!
        priceBefore: Int
        tags: [String]
        seller: ID!
        category : ID
        description: String
        single: Boolean
        fromAbroad: Boolean
        sizes: [String]
        variant: String
        images: [String]
    ): Product

    createCustomer(
        name: String
        photo: String      
        email: String
        password: String
        phoneNumber: String     
    ): Customer

    createCategory(
        topLevel: String
        midLevel: String
        lowLevel: String
    ) : Category

    addToCart(
        product: String
        quantity: Int
        variantIndex: Int
        price: Int      
        customer: String  
    ): Boolean

    removeFromCart(
        customer: String
        order: String
    ) : Boolean

    changeQuantity(
        order: String
        quantity: Int
    ): Order

    checkout(
        orders: [String]
        transactionCode: String
        paymentMode: String
        amount: Int
        timestamp: String
        customer: String
    ) : Transaction

    writeReview(
        text: String
        rating: Int
        customer: String
        product: String
        image: String
    ) : Product

    changeOrderStatus(
        status: String
        id: ID
    ) : Order

}

`;

export default typeDefs;
