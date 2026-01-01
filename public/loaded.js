const initialLoadingEl = document.querySelector('.initial-loading');


const makeContentVisible = () => {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = `
.initial-loading {
    opacity: 1;
}
`
  document.head.appendChild(styleEl)
}

const timeoutId = setTimeout(()=> {
  makeContentVisible()
}, 1000)

document.fonts.ready.then(() => {
  clearTimeout(timeoutId)

  makeContentVisible()
});


