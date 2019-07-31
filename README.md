# Gatsby Theme: MDX Blog

If you're looking for a nice, batteries-included setup to create an MDX-based
blog in Gatsby, you've come to the right theme repo! This theme takes great
inspiration from the [Hugo](https://gohugo.io/) static site generator, aiming to
implement the Taxonomy and Collection features, as well as the robust template
resolution of pages.

## Sub-themes

For the purpose of maximum reusability, `gatsby-theme-mdx-blog` is composed from
a few smaller themes and plugins that aim to be usable in their own right.

- **`@arrempee/gatsby-theme-mdx-collections`** provides the logic for grouping
  MDX files into collections and generating pages from them. This theme uses and
  extends the page creation logic from `@arrempee/gatsby-theme-mdx-pages`.

- **`@arrempee/gatsby-plugin-taxonomies`** is a scaffold for adding arbitrary
  taxonomies to arbitrary nodes, but trades ease of use for modularity.
  `-theme-mdx-blog` mitigates this by shipping with a terms resolver for the
  `MdxPage` nodes provided by `-theme-mdx-pages` as well as defaults for
  providing the tag and category taxonomies that are standard in most blogs.

## Configuration

While all of this configuration is inherited from this theme's constituent parts
and can be found in their READMEs, but all relevant configuration should be
shown here as well.

That said, checking out the READMEs and source of these parts will likely give
better context.

### contentDir: string

The directory where content files are located, relative to the site's root.

Defaults to "content".

### mdxOptions: object

The contents of this object are used as the options for `gatsby-plugin-mdx`.

### mdx: boolean

When set to false, disables the instance of `gatsby-plugin-mdx` that's normally
added to the site's gatsby-config.

### templateDirectory: string

The directory where template components are stored, relative to the root
directory of the site using the theme.

Defaults to "src/templates"

### indexPageName: string

Normally, any `MdxPage` node with a filename matching this string will have the
path of the folder that contains it instead. Defaults to "index".

### createPages: boolean

If set to false, aborts the default createPages callback in the plugin.

Useful for sites or themes that want to use the nodes created by this plugin with more
complex page creation logic.

### getTemplate: function({node, getNode})

A function passed here will override the default one used to determine the
template "key" from each `Mdx` node, which then in stored in the `template`
field of the `MdxPage` node and later passed to `getTemplateComponent` during
page creation.

The function receives an `Mdx` node, and is provided the `getNode` function to
allow it to reach into other nodes, like the parent `File` node.

### defaultTemplate: string

The template key that pages made from `MdxPage` nodes will use when no other
components can be resolved.

Defaults to "default", which when paired with the default `templateDirectory`
means the default file will be "src/templates/default.js". In collection pages
like those is `content/posts`, the default `getTemplate` will first check for a
collection-specific template like "src/templates/posts/default.js", falling back
on the normal one if that doesn't exist.
    
### getPagePath: function({node, getNode, indexPageName})

A function passed here will override the default one used to determine the path
of the page that results from each `MdxPage` node.

The function receives an `Mdx` node and `getNode`, as well as the
`indexPageName` setting. The default function uses `indexPageName` to intercept
pages with a configurable specific filename ("index" by default) to have the
path of their parent folder instead of literally "index".

### getTemplateComponent: function({node, defaultTemplate, templateDirectory})

A function passed here will override the default one used to find the absolute
path of a component that will be used in the `createPage` action.

The function receives the `MdxPage` node, the templateDirectory setting, and the
path of the default template relative to that directory.

As an example, the default function attempts to resolve the a path made from the
template directory and the node's template key, then falls back to the default
template key should the first resolved path not exist.

### taxonomyOptions

All options related to taxonomies- more accurately, those passed to
`-plugin-taxonomies`, are stored in this object.

### taxonomyOptions.taxonomies: object

This object defines the taxonomies themselves. If no taxonomies are defined, the
plugin won't do anything.

As an example, the standard case for a blog might look something like this:

``` javascript
taxonomies: {
    tags: {
        indexSlug: 'tags',
        termSlug: 'tag'
    },
    categories: {
        indexSlug: 'categories',
        termSlug: 'category'
    },
}
```

The keys each config object is listed under are very important, as they are the
primary way taxonomies are accessed as well as the name of the field name used
to pull terms from taxonomized nodes.

With the example config, the site will then have a page with an index of all the
categories under "/categories", and pages with the "general" category will have
be indexed under "/category/general".

Any additional fields in the config objects will also be added to the resulting
`Taxonomy` nodes, which could be useful for their index pages.

### taxonomyOptions.termsResolvers: object

This object stores the resolver functions that are used to pull terms from
arbitrary parent nodes. Terms will only be read from nodes that have a resolver
here, and as such is the plugin will do nothing if this option isn't specified.

The keys are the names of the types of nodes to pull from (e.g. `Mdx`,
`MdxPage`, `MarkdownRemark`), and the value is a function much like a standard
field resolver but using a destructured object and an extra `parentNode` field
containing the node the terms are to be pulled from, as the source is the
`TaxonomyTermSet` node. These resolver functions are expected to return an array
of strings.

As an example, this is the default function used by this theme to pull terms
from `MdxPage` nodes.

``` javascript
const resolveMdxPageTaxonomyTerms = ({source, args, context, info, parentNode}) => {
    const type = info.schema.getType('MdxPage');
    const resolver = type.getFields().frontmatter.resolve;
    const frontmatter = resolver(parentNode, {}, context, {fieldName: 'frontmatter'});
    return frontmatter[source.taxonomy]
}
```

### taxonomyOptions.processTerm: function(term)

Every term string will be run through this function before being added to the
`TaxonomyTermSet`.  
By default, this is lodash's `kebabCase`, but it can also be
set to `false` to disable the behavior and pass terms through unchanged.

### taxonomyOptions.processTermSlug: function(term)

Much like `processTerm`, each term will be run through this function *only* for
the purposes of creating path slugs.  
Much like `processTerm`, this is also `kebabCase` by default. Yes, it's run
twice by default, but this also means it's simpler to disable `processTerm` while
also keeping sane path slugs for generated pages.

Be warned that if this results in something different from `processTerm`, you'll
have to be careful that two Terms don't result in the same slug or one's page
will overwrite the other. This is nothing to worry about with default behavior.

### taxonomyOptions.taxonomyTemplate: string

The path of the template to be used for Taxonomy index pages, relative to the
site's root.

Defaults to `src/templates/taxonomy`.

### taxonomyOptions.termTemplate: string

The path of the template to be used for Term pages, relative to the site's root.

Defaults to `src/templates/term`.

### taxonomyOptions.createPages: boolean

If set to false, this `-plugin-taxonomies`'s `createPages` callback will be aborted. Useful
for cases where you want to handle the page creation for different Taxonomies in
different ways, as the plugin treats them the same.
