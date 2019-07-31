const getTemplateComponentWithCollection = require('./get-component-with-collection')

exports.createPages = async ({
    actions: {
        createPage
    },
    graphql
},  themeOptions) => {
    const {
        createPages = true,

        templateDirectory = `src/templates`,
        defaultTemplate = `default`,
        getTemplateComponent = getTemplateComponentWithCollection,
    } = themeOptions;

    // Don't create pages if the options specify not to.
    // A user or plugin may want to handle this while still using our nodes.
    if(!createPages) return;

    const query = await graphql(
        `
{
  collections: allCollection {
    nodes {
      key
    }
  }
  pages: allCollectionEntry(filter: {collection: {key: {eq: null}}}) {
    nodes {
      page {
        id
        template
        pagePath
      }
    }
  }
  entries: allCollectionEntry(sort: {fields: [page___frontmatter___date], order: DESC}) {
    group(field: collection___key) {
      fieldValue
      nodes {
        page {
          id
          template
          pagePath
        }
      }
    }
  }
}
`
    );

    if(query.error) throw query.error;

    const data = query.data;

    // Reorganize our Collection nodes into a hash for easier access
    const collectionNodes = {};
    for( const collection of data.collections.nodes ) {
        collectionNodes[collection.key] = collection;
    }

    for( const entryNode of data.pages.nodes ) {
        const component = getTemplateComponent({
            node: entryNode.page,
            templateDirectory,
            defaultTemplate
        });
        createPage({
            path: entryNode.page.pagePath,
            component,
            context: {
                id: entryNode.page.id
            }
        });
    }

    for( const entryGroup of data.entries.group ) {
        const nodes = entryGroup.nodes;

        for( let i = 0; i < nodes.length; i++ ) {

            const entryNode = nodes[i];
            const next = i === nodes.length - 1 ? null : nodes[i+1].page.id;
            const prev = i === 0 ? null : nodes[i-1].page.id;

            const component = getTemplateComponent({
                node: entryNode,
                collection: collectionNodes[entryGroup.fieldValue],
                templateDirectory,
                defaultTemplate
            });

            createPage({
                path: entryNode.page.pagePath,
                component,
                context: {
                    id: entryNode.page.id,
                    next, prev,
                }
            });

        }
    }
};
