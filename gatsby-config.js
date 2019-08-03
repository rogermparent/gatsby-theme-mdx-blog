const mdxPageTermsResolver = require('./mdx-page-terms-resolver')
const mdxPageCollectionResolver = require('./mdx-page-collection-resolver')

module.exports = themeOptions => {

    const {
        taxonomyOptions
    } = themeOptions;

    const plugins = [];

    plugins.push({
        resolve: '@arrempee/gatsby-theme-mdx-pages',
        options: {
            ...themeOptions,
            createPages: false,
        }
    })

    plugins.push({
        resolve: `@arrempee/gatsby-plugin-collections`,
        options: {
            ...themeOptions,
            collectionResolvers: {
                'MdxPage': mdxPageCollectionResolver,
                ...themeOptions.collectionResolvers,
            },
        }
    })

    if(taxonomyOptions !== false){
        plugins.push({
            resolve: '@arrempee/gatsby-plugin-taxonomies',
            options: {
                taxonomies: {
                    tags: {
                        label: 'Tags',
                    },
                    categories: {
                        label: 'Categories',
                    },
                },
                ...themeOptions.taxonomyOptions,
                termsResolvers: {
                    MdxPage: mdxPageTermsResolver,
                    ...themeOptions.termsResolvers,
                },
            },
        })
    }

    return({ plugins });
}
