const path = require('path');
const { getFirstResolvableComponent } = require('@arrempee/gatsby-helpers');

/* Use a collection-aware variant of getTemplateComponent for template resolution.
 */
const getTemplateComponentWithCollection = ({ node, defaultTemplate, templateDirectory, collection }, options) => {
    const template = node && node.template;
    let pathsToTry = [];

    if(template) pathsToTry.push(template);
    if(defaultTemplate) pathsToTry.push(defaultTemplate);

    // If a collection is specified, try collection-specific templates first
    if(collection) {
        pathsToTry = pathsToTry
            .map((standardPath) => (path.join(collection.key, standardPath)))
            .concat(pathsToTry);
    }

    return getFirstResolvableComponent(pathsToTry.map(
        relativePath => path.join(process.cwd(), templateDirectory, relativePath)
    ));
};

module.exports = getTemplateComponentWithCollection;
