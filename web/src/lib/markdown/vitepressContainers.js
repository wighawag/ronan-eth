// VitePress-style custom containers: ::: info [Title], ::: tip, ::: warning,
// ::: danger. An optional title after the type becomes a styled paragraph.
//
//   ::: info Note
//   body...
//   :::
//
// renders as:
//
//   <div class="custom-block info">
//     <p class="custom-block-title">Note</p>
//     ...body block-level HTML...
//   </div>
//
// `::: info` (no title) is also supported and omits the title paragraph.
//
// Why this is hand-rolled instead of using `remark-containers`:
//
// mdsvex 0.12.x runs unified 9 with `remark-parse@8` and freezes the processor
// before applying `remarkPlugins`. `remark-containers@1.2.0` mutates
// `Parser.prototype.blockTokenizers` at plugin-install time, which requires
// a non-frozen Parser (`this.Parser.prototype`) - so it throws
// "Cannot read properties of undefined (reading 'prototype')" under mdsvex.
// `remark-directive` would be the modern fix, but it needs remark-parse 9+
// (micromark) to tokenize `:::` directives, which mdsvex 0.12.x does not use.
//
// So we run as a plain AST transformer on the already-parsed mdast. With no
// tokenizer claiming `:::`, those lines land in the tree as plain paragraphs,
// and we splice the container ranges back together here.

const TYPES = ['info', 'tip', 'warning', 'danger'];
const TYPE_SET = new Set(TYPES);
const OPEN_RE = /^:::[\t\f ]*(noparse)?[\t\f ]*([A-Za-z][\w-]*)[\t\f ]*(.*)$/;
const CLOSE_RE = /^:::$/;

/**
 * Minimal mdast node shape we touch.
 * @typedef {{ type?: string, value?: string, children?: Node[] }} Node
 */

/**
 * Get the plain text content of a mdast node (joined text nodes).
 * @param {Node | null | undefined} node
 * @returns {string}
 */
function nodeText(node) {
	if (!node) return '';
	if (node.type === 'text' || node.type === 'inlineCode')
		return node.value || '';
	if (node.type === 'code') return node.value || '';
	if (Array.isArray(node.children)) return node.children.map(nodeText).join('');
	if (typeof node.value === 'string') return node.value;
	return '';
}

/**
 * A container node we build.
 * @typedef {{ type: string, data: { hName: string, hProperties: Record<string, unknown> }, children: Node[] }} ContainerNode
 */

/**
 * A title paragraph we prepend.
 * @typedef {{ type: string, data: { hName: string, hProperties: Record<string, unknown> }, children: Node[] }} TitleParagraph
 */

/**
 * Recursively rewrite containers inside `parent.children`.
 * Mutates parent.children in place. Returns true if anything changed.
 * @param {{ children: Node[] } | null | undefined} parent
 */
function rewriteContainers(parent) {
	if (!parent || !Array.isArray(parent.children)) return false;
	let changed = false;
	let i = 0;
	while (i < parent.children.length) {
		const child = parent.children[i];
		const text = nodeText(child).trim();
		if (child.type === 'paragraph' && text.startsWith(':::')) {
			const open = OPEN_RE.exec(text);
			if (open && TYPE_SET.has(open[2])) {
				const type = open[2];
				const title = (open[3] || '').trim();
				// Find the matching closer with depth tracking.
				let depth = 1;
				let j = i + 1;
				for (; j < parent.children.length; j++) {
					const inner = parent.children[j];
					const innerText = nodeText(inner).trim();
					if (
						inner.type === 'paragraph' &&
						(innerText.startsWith('::: ') || innerText === ':::')
					) {
						const innerOpen = OPEN_RE.exec(innerText);
						if (innerOpen && TYPE_SET.has(innerOpen[2])) {
							depth++;
						} else if (CLOSE_RE.test(innerText)) {
							depth--;
							if (depth === 0) break;
						}
					}
				}
				if (depth !== 0) {
					// No matching closer; treat as a plain paragraph and move on.
					i++;
					continue;
				}
				// body = children between open (i) and close (j), exclusive.
				/** @type {Node[]} */
				const body = parent.children.slice(i + 1, j);
				// Recurse into body so nested containers are also rewritten.
				rewriteContainers({children: body});
				// Build the container node.
				/** @type {ContainerNode} */
				const containerNode = {
					type,
					data: {
						hName: 'div',
						hProperties: {className: ['custom-block', type]},
					},
					children: body,
				};
				if (title) {
					/** @type {TitleParagraph} */
					const titleNode = {
						type: 'paragraph',
						data: {
							hName: 'p',
							hProperties: {className: 'custom-block-title'},
						},
						children: [{type: 'text', value: title}],
					};
					containerNode.children = [titleNode, ...body];
				}
				parent.children.splice(i, j - i + 1, containerNode);
				changed = true;
				// Continue scanning after the inserted container.
				i++;
				continue;
			}
		}
		i++;
	}
	return changed;
}

/**
 * @returns {(tree: { children: Node[] }) => void}
 */
export default function vitepressContainers() {
	return (tree) => {
		rewriteContainers(/** @type {{ children: Node[] }} */ (tree));
	};
}
