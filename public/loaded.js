const initialLoadingEl = document.querySelector('.initial-loading');


document.fonts.ready.then(() => {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = `
.initial-loading {
    opacity: 1;
}
`
  document.head.appendChild(styleEl)
});
