import { gql } from '@apollo/client';

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

export const GET_PRODUCTS_BY_COLLECTION = gql`
  query GetProductsByCollection(
    $slug: String!
    $channel: String!
    $first: Int!
  ) {
    collection(slug: $slug, channel: $channel) {
      id
      name
      products(first: $first) {
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
      }
    }
  }
`;

export const ACCOUNT_REGISTER = gql`
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

export const TOKEN_CREATE = gql`
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
      }
      errors {
        field
        message
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

export const CHECKOUT_EMAIL_UPDATE = gql`
  mutation CheckoutEmailUpdate($id: ID!, $email: String!) {
    checkoutEmailUpdate(id: $id, email: $email) {
      checkout {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_SHIPPING_ADDRESS_UPDATE = gql`
  mutation CheckoutShippingAddressUpdate(
    $id: ID!
    $shippingAddress: AddressInput!
  ) {
    checkoutShippingAddressUpdate(id: $id, shippingAddress: $shippingAddress) {
      checkout {
        id
        shippingMethods {
          id
          name
          price {
            gross {
              amount
              currency
            }
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

export const CHECKOUT_BILLING_ADDRESS_UPDATE = gql`
  mutation CheckoutBillingAddressUpdate(
    $id: ID!
    $billingAddress: AddressInput!
  ) {
    checkoutBillingAddressUpdate(id: $id, billingAddress: $billingAddress) {
      checkout {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_DELIVERY_METHOD_UPDATE = gql`
  mutation CheckoutDeliveryMethodUpdate($id: ID!, $deliveryMethodId: ID!) {
    checkoutDeliveryMethodUpdate(id: $id, deliveryMethodId: $deliveryMethodId) {
      checkout {
        id
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

export const CHECKOUT_PAYMENT_CREATE = gql`
  mutation CheckoutPaymentCreate($id: ID!, $input: PaymentInput!) {
    checkoutPaymentCreate(id: $id, input: $input) {
      checkout {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CHECKOUT_COMPLETE = gql`
  mutation CheckoutComplete($id: ID!) {
    checkoutComplete(id: $id) {
      order {
        id
        number
      }
      errors {
        field
        message
      }
    }
  }
`;
