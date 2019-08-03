const getMdxPageCollection = ({ node, getNode }) => {
    const mdxNode = getNode(node.parent);
    const fileNode = getNode(mdxNode.parent);

    const firstSubdir = fileNode.relativeDirectory.split('/')[0];
    return firstSubdir === '' ? null : firstSubdir;
};

module.exports = getMdxPageCollection;
