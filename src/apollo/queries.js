import { gql } from '@apollo/client';

// Fetch products for flash sales, clearance, etc.
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $channel: String!) {
    products(first: $first, channel: $channel) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Fetch categories for the sidebar menu
export const GET_CATEGORIES = gql`
  query GetCategories($first: Int!) {
    categories(first: $first) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;

// Create a cart (checkout)
export const CREATE_CHECKOUT = gql`
  mutation CreateCheckout($lines: [CheckoutLineInput!]!) {
    checkoutCreate(input: { channel: "default-channel", lines: $lines }) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant {
            product {
              name
            }
            pricing {
              price {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

// Add item to existing cart
export const ADD_TO_CART = gql`
  mutation AddToCart($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(id: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            product {
              name
            }
          }
        }
        totalPrice {
          gross {
            amount
            currency
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
