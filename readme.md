# Contentful Hugo

This is a simple Node.js CLI tool that pulls data from Contentful and turns it into Markdown or YAML files for use with a static site generator. It can be used with any static site generator that uses Markdown with YAML frontmatter, but it has some features that are specific to [Hugo](https://gohugo.io).

**Table of Contents**

- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
- [Configuration](#Configuration)
- [Field Compatibility](#Field-Compatibility)


# Prerequisites

Install [Node.js](https://nodejs.org)

# Installation
```
npm install contentful-hugo
```

# Usage

Complete [configuration](#configuration) then run the following command in the terminal

```
contentful-hugo
```
Failure to complete configuration will return an error in the console

![Environment Variables not set](https://raw.githubusercontent.com/ModiiMedia/contentful-hugo/master/images/environment-variables-missing.jpg)

![Config file not found](https://raw.githubusercontent.com/ModiiMedia/contentful-hugo/master/images/config-file-not-found.jpg)

# Configuration

## Environment Variables

Before using you must first set the following environment variables. CONTENTFUL_SPACE, and CONTENTFUL_TOKEN.

This can be done with a .env file in the root directory of your project.
```
CONTENTFUL_SPACE = '<your-space-id>`
CONTENTFUL_TOKEN = '<content-api-access-token>`
```
You can also declare the environment variables in the command line

## Config File

In order to pull the data you want you will need to create a **contentful-settings.yaml** file in the root of your repository.

Example **contentful-settings.yaml** file (see below for complete configuration options)

```yaml
singleTypes: # fetches only the most recently updated entry in a particular content type
  - id: homepage
    directory: /content/
    fileName: _index
    fileExtension: md 

  - id: siteSettings
    directory: /data/
    fileName: settings
    fileExtension: yaml

repeatableTypes: # feteches all the entrys of a content type and places them in a directory
  - id: posts
    directory: /content/posts/
    fileExtension: md
    mainContent: content
  
  - id: seoFields
    isHeadless: true 
    directory: /content/seo-fields/

  - id: reviews
    directory: /content/reviews/
    mainContent: reviewBody

  - id: staff
    isHeadless: true
    directory: /content/staff/
```

**Configuration Options**

| field | required | description |
| ------ | -------- | ------------ | 
| id | required | contentful content type ID goes here |
| directory | required | directory where you want the file(s) to be generated (leading and trailing slashes required for the time being) |
| fileName | required (single types only) | name of the file generated | 
| fileExtension | optional (repeatable types only) | can be "md", "yml", or "yaml" (defaults to "md") |
| isHeadless | optional (repeated instances only) | turns all entries in a content type into headless leaf bundles (see [hugo docs](https://gohugo.io/content-management/page-bundles/#headless-bundle)) |
| mainContent | optional | field ID for field you want to be the main Markdown content. (Does not work with rich text fields)

# Compatibility Issues

These are know compatibility issues.

- Hugo cannot parse date field if field is set to "date and time without timezone"
- Rich Text Fields give errors when using "inline-entry" "link-to-asset" "link-to-entry". Please disable these for the time being.