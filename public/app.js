// output DIV element
const div = document.createElement('div')
div.setAttribute('id', 'feature-area')
document.body.appendChild(div)

div.appendChild(document.createTextNode('Initializing...'))

function render() {
  const shouldShow = flagsmith.hasFeature('feature_a')
  const label = (shouldShow ? 'Showing' : 'Not showing') + ' feature A'
  div.replaceChild(document.createTextNode(label), div.firstChild)
}

// https://docs.flagsmith.com/clients/javascript/
flagsmith.init({
  // comes from the Flagsmith project settings
  environmentID: 'gxzgHaQ84gijocUvctHJFb',
  onChange: render,
})
