import gql from "graphql-tag";

export default gql`
    directive @cacheControl(maxAge: Int) on FIELD_DEFINITION | OBJECT
    
    type Location @cacheControl(maxAge: 86400) {
        location_id: String!
        name: String
        cuisine: String
        borough: String
        street: String
        address: String
        zipcode: String
        grade: String
    }
`
