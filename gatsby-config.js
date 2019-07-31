const mdxPageTermsResolver = require('./mdx-page-terms-resolver')

module.exports = themeOptions => {

    const {
        taxonomyOptions
    } = themeOptions;

    const plugins = [];

    plugins.push({
        resolve: '@arrempee/gatsby-theme-mdx-collections',
        options: themeOptions,
    })

    if(taxonomyOptions !== false){
        plugins.push({
            resolve: '@arrempee/gatsby-plugin-taxonomies',
            options: {
                termsResolvers: {
                    MdxPage: mdxPageTermsResolver,
                },
                taxonomies: {
                    tags: {
                        label: 'Tags',
                    },
                    categories: {
                        label: 'Categories',
                    },
                },
                ...themeOptions.taxonomyOptions,
            },
        })
    }

    return({ plugins });
}
