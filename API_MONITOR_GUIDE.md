# API Monitor (GitHub Wiki) - Quick Access Guide

## ✨ Your API Monitor is Ready!

The "API Monitor" you're looking for is the **GitHub Wiki** - a comprehensive documentation site automatically generated from the repository.

## 🔗 Direct Access

**Click here to access the API Monitor**: https://github.com/Alteriom/alteriom-mqtt-schema/wiki

Or navigate to it by clicking the **Wiki** tab at the top of the GitHub repository page.

## 📚 What's Available

Your API Monitor contains complete documentation with 7 pages:

### 1. [Home](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Home)
Overview and navigation hub for all wiki content

### 2. [Schemas](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Schemas)
Complete reference of all 21 MQTT message types:
- Sensor schemas (data, heartbeat, status, info, metrics)
- Gateway schemas (info, metrics, data, heartbeat, status)
- Firmware status and OTA management
- Command/control messages
- Mesh network schemas
- Device configuration

### 3. [Classification](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Classification)
How messages are automatically classified and validated:
- Message type code system (200, 202, 300, etc.)
- Heuristic classification fallback
- Performance optimization tips

### 4. [Validation Rules](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Validation-Rules)
Schema validation constraints and requirements:
- Numeric ranges
- String patterns
- Field requirements
- Deprecated aliases

### 5. [Changelog](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Changelog)
Complete version history from v0.1.0 to v0.7.2:
- New features by version
- Breaking changes
- Migration guides
- Release dates

### 6. [Release Process](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Release-Process)
How the package is published and versioned:
- Pre-release checklist
- Publishing workflow
- Version numbering

### 7. [Development](https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Development)
Setup and contribution guidelines:
- Installation steps
- Quick start examples
- Embedded schemas explanation
- Versioning policy

## 🚀 Key Features

The API Monitor (Wiki) provides:

✅ **Always Up-to-Date** - Automatically synced from repository on every change  
✅ **Complete Schema Coverage** - All 21 message types documented  
✅ **Version History** - Full changelog with migration notes  
✅ **Quick Navigation** - Linked pages for easy browsing  
✅ **Code Examples** - TypeScript usage patterns  
✅ **Search Function** - GitHub wiki has built-in search  

## 🔄 Automatic Updates

The wiki updates automatically whenever these files change:
- `README.md`
- `docs/mqtt_schema/**` (any schema or doc files)
- `PUBLISH_CHECKLIST.md`
- `scripts/generate-wiki.cjs`

You don't need to do anything - it's fully automated!

## 💡 How to Use

### From GitHub Web Interface:
1. Go to https://github.com/Alteriom/alteriom-mqtt-schema
2. Click the **Wiki** tab (top navigation)
3. Browse pages using the sidebar or links

### From Search:
- Use GitHub's wiki search box to find specific schemas or topics
- Search for message types, field names, or versions

### For API Integration:
- Reference schema URLs from the Schemas page
- Copy TypeScript examples from Quick Start
- Check validation rules for field constraints

## 📱 Mobile Access

The wiki works great on mobile devices:
- Responsive design
- Touch-friendly navigation
- Full content available

## 🆘 Still Can't See Content?

If the wiki appears empty:

### Try These Steps:

1. **Hard Refresh**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache**
   - Or try an incognito/private window

3. **Check Direct URLs**
   - Home: https://github.com/Alteriom/alteriom-mqtt-schema/wiki
   - Schemas: https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Schemas

4. **Verify Access**
   - Make sure you're logged into GitHub
   - Check if your organization/network blocks github.com

5. **Alternative Access**
   - View wiki files locally in `wiki_build/` directory
   - Generate fresh content with `npm run wiki:generate`

## 🎯 What You Can Find

### For Developers:
- TypeScript type definitions
- Validation examples
- Message classification logic
- Integration patterns

### For Firmware Engineers:
- Message format specifications
- Required vs. optional fields
- Field constraints and ranges
- OTA management details

### For Project Managers:
- Version history and roadmap
- Feature additions by release
- Breaking change notices
- Migration requirements

## 📞 Need Help?

If you've tried everything and still can't access the wiki:

1. **Check Wiki Status**: See [WIKI_SETUP.md](./WIKI_SETUP.md) for troubleshooting
2. **Verify Workflow**: Check Actions → Wiki Sync for any failures
3. **Contact Maintainer**: @sparck75 for repository-specific issues

## 🎉 Quick Links

| Resource | URL |
|----------|-----|
| **Wiki Home** | https://github.com/Alteriom/alteriom-mqtt-schema/wiki |
| **Schemas Reference** | https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Schemas |
| **Changelog** | https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Changelog |
| **Repository** | https://github.com/Alteriom/alteriom-mqtt-schema |
| **npm Package** | https://www.npmjs.com/package/@alteriom/mqtt-schema |

---

**Last Updated**: This document is part of the repository and stays current with every commit.

**Automated**: The wiki syncs automatically - no manual updates needed!

**Comprehensive**: All 21 message types, 7 versions, complete API reference.
