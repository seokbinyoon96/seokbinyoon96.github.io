/* Kramdown emits math/tex script nodes; expose them to MathJax 3. */
document.querySelectorAll('.blog-content script[type^="math/tex"]').forEach((source) => {
  const display = source.type.includes('mode=display');
  const target = document.createElement(display ? 'div' : 'span');
  target.textContent = (display ? '\\[' : '\\(') + source.textContent + (display ? '\\]' : '\\)');
  source.replaceWith(target);
});
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]'], ['$$', '$$']],
    processEscapes: true
  },
  svg: { fontCache: 'global' }
};
