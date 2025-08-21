# 🚀 Pipeline Setup & Configuration Guide

## Overview
The pipeline system connects to LeadConnector API to manage leads through different stages of your sales process.

## 🔧 Environment Configuration

### 1. Create Environment File
Create a `.env` file in the `my-dashboard` directory with the following variables:

```env
# LeadConnector API Configuration
VITE_LEAD_CONNECTOR_TOKEN=your_lead_connector_token_here
VITE_LEAD_CONNECTOR_LOCATION_ID=your_location_id_here

# Development Settings
VITE_APP_ENV=development
```

### 2. Get Your API Credentials
1. Log into your LeadConnector account
2. Go to Settings → API
3. Generate a new API token
4. Copy your Location ID from the dashboard

## 🏗️ Pipeline Stages

The pipeline includes these default stages:
- **New Lead** 👤 - Initial contact
- **Contacted** 📞 - First communication made
- **Application Started** 📝 - Application process begun
- **Pre-Approved** ✅ - Initial approval given
- **In Underwriting** 🔍 - Under review
- **Closed** 🎯 - Deal completed

### Multi-Stage Support
Leads can now appear in multiple stages simultaneously based on their tags:
- A lead with tags "New Lead" and "Contacted" will appear in both stages
- Each stage shows unique lead count vs total instances
- Multi-stage leads are visually marked with a "Multi-Stage" badge
- The "Also in:" indicator shows other stages where the lead appears

## 🔍 Troubleshooting

### Common Issues

#### 1. API Connection Failed
**Symptoms:** "API Connection Failed" error
**Solutions:**
- Verify your API token is correct
- Check your Location ID
- Ensure your LeadConnector account is active
- Check network connectivity

#### 2. No Leads Showing
**Symptoms:** Pipeline appears empty
**Solutions:**
- Verify you have contacts in LeadConnector
- Check if contacts have proper tags
- Ensure contacts have required fields (name, email)

#### 3. Leads Not Categorizing Correctly
**Symptoms:** Leads appear in wrong stages
**Solutions:**
- Add proper tags to your contacts in LeadConnector
- Use these exact tag names:
  - "New Lead"
  - "Contacted"
  - "Application Started"
  - "Pre-Approved"
  - "In Underwriting"
  - "Closed"

#### 4. Only Partial Data Loading
**Symptoms:** Only seeing first 100 contacts or limited data
**Solutions:**
- The pipeline now automatically fetches ALL contacts across multiple pages
- Check the loading progress indicator to see pagination status
- Verify your API has access to all contacts
- Check browser console for pagination logs

#### 5. Multi-Stage Lead Display
**Symptoms:** Leads not appearing in multiple stages as expected
**Solutions:**
- Ensure leads have the correct tags in GoHighLevel
- Check that tags match exactly: "New Lead", "Contacted", "Application Started", etc.
- Multi-stage leads will show a blue "Multi-Stage" badge
- Look for "Also in:" indicators showing other stages
- Verify unique vs total lead counts in each stage

### Error Recovery

The pipeline includes several error recovery mechanisms:

1. **Automatic Retries** - Failed API calls retry up to 3 times with exponential backoff
2. **Error Boundaries** - Component-level error handling with retry options
3. **Manual Refresh** - Users can manually refresh data
4. **Fallback States** - Graceful degradation when data is unavailable

## 🛠️ Development

### Feature Flags
Control pipeline behavior with environment variables:

```env
VITE_ENABLE_CONSOLE_LOGGING=true    # Enable debug logging
VITE_ENABLE_REAL_TIME_UPDATES=true  # Enable real-time updates
VITE_ENABLE_AUTO_REFRESH=false      # Disable auto-refresh
```

### API Endpoints
The pipeline uses these LeadConnector endpoints:
- `GET /contacts/` - Fetch all contacts
- `PUT /contacts/{id}` - Update contact
- `POST /contacts/` - Create new contact

### Logging
Pipeline activities are logged with different levels:
- **Debug** - Detailed API calls and data processing
- **Info** - General pipeline operations
- **Warn** - Non-critical issues
- **Error** - Critical failures

## 📊 Performance Optimization

### Best Practices
1. **Limit API Calls** - Use manual refresh instead of auto-refresh
2. **Optimize Data** - Only fetch necessary fields
3. **Error Handling** - Implement proper retry logic
4. **Caching** - Consider implementing data caching
5. **Pagination** - Automatically fetches all records across multiple pages

### Pagination Features
- **Automatic Page Fetching** - Fetches all contacts across multiple pages
- **Progress Tracking** - Shows loading progress during data fetch
- **Rate Limiting Protection** - Includes delays between API calls
- **Safety Limits** - Prevents infinite loops with maximum page limits
- **Multiple Response Formats** - Handles various GoHighLevel API response structures

### Monitoring
Monitor these metrics:
- API response times
- Error rates
- Data refresh frequency
- User interaction patterns

## 🔒 Security

### API Token Security
- Never commit API tokens to version control
- Use environment variables for sensitive data
- Rotate tokens regularly
- Use least-privilege access

### Data Protection
- All API calls use HTTPS
- Sensitive data is not logged
- Error messages don't expose internal details

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API credentials
3. Test API connection manually
4. Review LeadConnector documentation
5. Contact support with specific error details 