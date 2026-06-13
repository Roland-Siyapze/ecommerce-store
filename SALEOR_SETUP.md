# Saleor Integration Setup Guide

## Products Not Showing? Troubleshooting Steps

### Step 1: Verify Products Are Published to Channel
1. Go to your Saleor Dashboard
2. Navigate to **Products**
3. Select any product
4. Look for **"Publish"** section (usually on the right sidebar)
5. **IMPORTANT**: Ensure the product is "Published" to the **"Flash Shop"** channel
   - If you only see "Default channel", you need to add the product to "Flash Shop"
   - Click "Add to channel" if needed

### Step 2: Verify Product Has Pricing in Channel
1. In the same product page, scroll to **"Pricing"** section
2. Look for pricing entry for **"Flash Shop"** channel
3. **IMPORTANT**: Set a price (Cost price & Sales price)
4. Save changes

### Step 3: Verify API Endpoint Configuration
1. Check `.env` file exists in project root:
   ```
   REACT_APP_SALEOR_API_URL=http://localhost:8000/graphql/
   REACT_APP_CHANNEL_ID=Q2hhbm5lbDo0
   REACT_APP_CHANNEL_SLUG=flash-shop
   ```
2. If endpoint is different, update `REACT_APP_SALEOR_API_URL`
3. Restart the React development server after changing .env

### Step 4: Check Browser Console for Errors
1. Open browser DevTools: **F12** or **Ctrl+Shift+I**
2. Go to **Console** tab
3. Look for any red error messages
4. Look for GraphQL error messages

### Step 5: Check Network Requests
1. In DevTools, go to **Network** tab
2. Reload the page
3. Filter for "graphql" requests
4. Click on GraphQL requests and check the response
5. Look for error messages in the response JSON

### Step 6: Verify Channel ID
- Channel ID: `Q2hhbm5lbDo0` decodes to `Channel:4`
- This is the correct format for the Flash Shop channel
- If unsure, check Saleor Dashboard → Settings → Channels → Copy the ID shown

## Key Files Changed
- `src/config/constants.js` - Channel configuration
- `src/apollo/client.js` - Apollo client setup with API URL
- All page components - Now use CHANNEL_ID constant
- `.env` - Environment variables (copy from `.env.example`)

## Quick Checklist
- [ ] Products are Published to "Flash Shop" channel
- [ ] Products have Pricing set for "Flash Shop" channel  
- [ ] `.env` file exists with correct API URL
- [ ] React dev server restarted after .env changes
- [ ] No errors in browser Console tab
- [ ] Network tab shows successful GraphQL responses
