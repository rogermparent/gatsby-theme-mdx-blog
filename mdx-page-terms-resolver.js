const resolveMdxPageTaxonomyTerms = ({source, args, context, info, parentNode}) => {
    const type = info.schema.getType('MdxPage');
    const resolver = type.getFields().frontmatter.resolve;
    const frontmatter = resolver(parentNode, {}, context, {fieldName: 'frontmatter'});
    return frontmatter[source.taxonomy]
}

module.exports = resolveMdxPageTaxonomyTerms
