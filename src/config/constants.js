/**
 * Application Constants
 * Contains configuration values used throughout the application
 */

// Channel SLUG for "Flash Shop"
// Note: Saleor expects the channel *slug* (e.g. 'flash-shop'), NOT the base64 ID ('Q2hhbm5lbDo0')
export const CHANNEL_ID = process.env.REACT_APP_CHANNEL_SLUG || 'flash-shop';
export const DEFAULT_FIRST = 24;

// ⚠️ TROUBLESHOOTING - If products still don't show:
// 1. CHANNEL SLUG MUST BE CORRECT
//    → The slug is usually the channel name in lowercase with hyphens (e.g. 'flash-shop')
//    → It is NOT the base64 ID 'Q2hhbm5lbDo0'
// 1. PRODUCTS MUST BE PUBLISHED TO THE "FLASH SHOP" CHANNEL
//    → Go to Saleor Dashboard → Products → Select a product
//    → Check "Publish" section and ensure it's published to "Flash Shop" channel
// 2. PRODUCTS NEED PRICING FOR THE CHANNEL
//    → Still in the product → Scroll to "Pricing" section
//    → Set a price for the "Flash Shop" channel
// 3. CHECK BROWSER CONSOLE & NETWORK TAB
//    → Open DevTools (F12) → Console tab → Look for errors
//    → Network tab → Look for graphql requests and their responses
// 4. VERIFY SALEOR API URL IS CORRECT
//    → Check that http://localhost:8000/graphql/ is accessible
//    → Or update REACT_APP_SALEOR_API_URL in .env file
