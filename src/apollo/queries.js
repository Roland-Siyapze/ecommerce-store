import { gql } from '@apollo/client';
import { CHANNEL_ID } from '../config/constants';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int!
    $channel: String!
    $filter: ProductFilterInput
  ) {
    products(first: $first, channel: $channel, filter: $filter) {
      edges {
        node {
          id
          name
          slug
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
            discount {
              gross {
                amount
                currency
              }
            }
          }
          category {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_PRODUCT_DETAIL = gql`
  query GetProductDetail($slug: String!, $channel: String!) {
    product(slug: $slug, channel: $channel) {
      id
      name
      slug
      description
      thumbnail {
        url
      }
      images {
        url
      }
      category {
        name
        slug
      }
      variants {
        id
        name
        sku
        quantityAvailable
        pricing {
          price {
            gross {
              amount
              currency
            }
          }
          priceUndiscounted {
            gross {
              amount
              currency
            }
          }
        }
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
        discount {
          gross {
            amount
            currency
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories($first: Int!, $level: Int) {
    categories(first: $first, level: $level) {
      edges {
        node {
          id
          name
          slug
          level
          backgroundImage {
            url
          }
          children(first: 20) {
            edges {
              node {
                id
                name
                slug
                children(first: 20) {
                  edges {
                    node {
                      id
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!, $channel: String!, $first: Int!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      backgroundImage {
        url
      }
      ancestors(first: 5) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      children(first: 20) {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      products(first: $first, channel: $channel) {
        edges {
          node {
            id
            name
            slug
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
              discount {
                gross {
                  amount
                  currency
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!, $channel: String!, $first: Int!) {
    products(first: $first, channel: $channel, filter: { search: $query }) {
      edges {
        node {
          id
          name
          slug
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
            }
          }
          category {
            name
            slug
          }
        }
      }
    }
  }
`;

export const CREATE_CHECKOUT = gql`
  mutation CreateCheckout($lines: [CheckoutLineInput!]!, $channel: String!) {
    checkoutCreate(input: { channel: $channel, lines: $lines }) {
      checkout {
        id
        token
        lines {
          id
          quantity
          variant {
            id
            name
            product {
              name
              thumbnail {
                url
              }
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

export const ADD_TO_CART = gql`
  mutation AddToCart($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(id: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
            product {
              name
              thumbnail {
                url
              }
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

export const UPDATE_CART_LINE = gql`
  mutation UpdateCartLine($checkoutId: ID!, $lines: [CheckoutLineInput!]!) {
    checkoutLinesUpdate(id: $checkoutId, lines: $lines) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
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

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($checkoutId: ID!, $lineIds: [ID!]!) {
    checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {
      checkout {
        id
        lines {
          id
          quantity
          variant {
            id
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
