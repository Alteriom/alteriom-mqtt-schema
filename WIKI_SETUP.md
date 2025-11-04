# GitHub Wiki Setup Guide

## The Problem

The "API Monitor" you're referring to is the **GitHub Wiki** for this repository. While the Wiki Sync workflow has been successfully generating and pushing wiki content, the Wiki feature may not be enabled in the GitHub repository settings.

## Current Status

✅ **Wiki Sync Workflow** - Active and running successfully  
✅ **Wiki Content Generation** - Working correctly (7 pages generated)  
✅ **Automated Updates** - Triggered on every push to main branch  
⚠️ **Wiki Feature** - May need to be enabled in repository settings

## Wiki Pages Available

The following wiki pages are automatically generated:

1. **Home** - Overview and navigation
2. **Schemas** - List of all MQTT schemas with descriptions
3. **Classification** - Message type classification logic
4. **Validation Rules** - Schema validation constraints
5. **Changelog** - Version history and changes
6. **Release Process** - Publishing workflow
7. **Development** - Setup and contribution guide

## How to Enable the GitHub Wiki

If the wiki appears empty or inaccessible:

### Step 1: Enable Wiki Feature

1. Go to the repository on GitHub: https://github.com/Alteriom/alteriom-mqtt-schema
2. Click on **Settings** tab
3. Scroll down to the **Features** section
4. Check the box next to **✓ Wikis**
5. Click **Save** if there's a save button

### Step 2: Initialize the Wiki (if needed)

If the Wiki feature was just enabled:

1. Click on the **Wiki** tab in the repository
2. If prompted to create the first page, click **Create the first page**
3. You can add any temporary content (it will be overwritten by the automated sync)
4. Click **Save Page**

### Step 3: Trigger Wiki Sync

Once the Wiki is enabled and initialized:

**Option A: Automatic (Recommended)**
- The wiki will automatically sync on the next push to the main branch

**Option B: Manual Trigger**
1. Go to **Actions** tab
2. Click on **Wiki Sync** workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

### Step 4: Access the Wiki

After the sync completes:

1. Click on the **Wiki** tab in the repository
2. You should see the Home page with links to all wiki pages
3. The wiki is automatically updated whenever:
   - README.md changes
   - docs/mqtt_schema/** files change
   - PUBLISH_CHECKLIST.md changes
   - scripts/generate-wiki.cjs changes

## Alternative: View Wiki Content Locally

If you need to view the wiki content without enabling the GitHub Wiki:

```bash
# Generate wiki pages locally
npm run wiki:generate

# View the generated pages
ls -la wiki_build/
cat wiki_build/Home.md
cat wiki_build/Schemas.md
# etc.
```

All wiki pages are also available as markdown files in the `wiki_build/` directory.

## Wiki URLs

Once enabled, the wiki will be accessible at:

- **Wiki Home**: https://github.com/Alteriom/alteriom-mqtt-schema/wiki
- **Individual Pages**: https://github.com/Alteriom/alteriom-mqtt-schema/wiki/PageName

For example:
- https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Schemas
- https://github.com/Alteriom/alteriom-mqtt-schema/wiki/Changelog

## Troubleshooting

### "Wiki repository not found" Error

This error appears in the Wiki Sync workflow when the Wiki feature is disabled. To fix:
1. Enable the Wiki feature in repository settings (see Step 1 above)
2. Initialize the wiki by creating the first page (see Step 2 above)
3. Re-run the Wiki Sync workflow (see Step 3 above)

### Wiki Content is Empty or Old

If the wiki exists but shows old or empty content:
1. Go to **Actions** tab
2. Check the **Wiki Sync** workflow status
3. Look for any failed runs
4. Manually trigger the workflow to force a sync

### Permission Issues

If you get permission errors when trying to enable the Wiki:
- You need **Admin** or **Write** permissions on the repository
- Contact the repository owner (@sparck75) if you don't have access

## Maintenance

The wiki is fully automated and requires no manual maintenance. Content is:

- ✅ Automatically generated from source files
- ✅ Automatically synced to GitHub on every relevant change
- ✅ Version-stamped with generation timestamp

**Do not edit wiki pages directly in GitHub** - all changes will be overwritten by the next automated sync. Instead, update the source files in the repository.

## Quick Reference

| Action | Command/Location |
|--------|-----------------|
| Generate wiki locally | `npm run wiki:generate` |
| View generated files | `wiki_build/*.md` |
| Workflow location | `.github/workflows/wiki-sync.yml` |
| Generation script | `scripts/generate-wiki.cjs` |
| Enable wiki | Settings → Features → ✓ Wikis |
| View wiki | https://github.com/Alteriom/alteriom-mqtt-schema/wiki |

---

**Need Help?**

If you've followed these steps and the wiki is still not working, please:
1. Check the Wiki Sync workflow logs in the Actions tab
2. Verify you have the necessary repository permissions
3. Contact @sparck75 for repository admin assistance
