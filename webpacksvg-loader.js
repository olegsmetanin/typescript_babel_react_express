module.exports = function(content) {
    return (
        'module.exports = require("react").createElement("span", {' +
            'dangerouslySetInnerHTML: {' +
                '__html: ' + JSON.stringify(content) +
            '}' +
        '});'
    );
};
