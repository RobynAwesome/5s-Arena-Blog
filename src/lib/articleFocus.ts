export type FocusFrameKind = 'title' | 'heading' | 'paragraph' | 'quote';

export type FocusFrame = {
  id: string;
  text: string;
  kind: FocusFrameKind;
};

const MAX_FRAMES = 24;
const MAX_FRAME_LENGTH = 260;

function cleanText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function splitLongText(value: string) {
  const clean = cleanText(value);
  if (clean.length <= MAX_FRAME_LENGTH) return [clean];

  const sentences = clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(cleanText).filter(Boolean) || [clean];
  const groups: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (!current) {
      current = sentence;
      continue;
    }

    if (`${current} ${sentence}`.length <= MAX_FRAME_LENGTH) {
      current = `${current} ${sentence}`;
      continue;
    }

    groups.push(current);
    current = sentence;
  }

  if (current) groups.push(current);
  return groups;
}

export function extractFocusFrames(
  html: string,
  title: string,
  excerpt?: string,
): FocusFrame[] {
  const frames: FocusFrame[] = [
    {
      id: 'title',
      text: cleanText(title),
      kind: 'title',
    },
  ];

  if (typeof DOMParser === 'undefined') {
    const fallback = cleanText(excerpt || '');
    if (fallback) {
      frames.push({ id: 'excerpt', text: fallback, kind: 'paragraph' });
    }
    return frames;
  }

  const document = new DOMParser().parseFromString(html || '', 'text/html');
  const nodes = Array.from(document.body.querySelectorAll('h1, h2, h3, p, blockquote, li'));
  let sequence = 0;

  for (const node of nodes) {
    const text = cleanText(node.textContent || '');
    if (!text) continue;

    const tagName = node.tagName.toLowerCase();
    const kind: FocusFrameKind = tagName === 'blockquote'
      ? 'quote'
      : tagName.startsWith('h')
        ? 'heading'
        : 'paragraph';

    if (kind === 'paragraph' && text.length < 24) continue;

    for (const piece of splitLongText(text)) {
      if (piece.length < 12) continue;
      frames.push({
        id: `frame-${sequence}`,
        text: piece,
        kind,
      });
      sequence += 1;
      if (frames.length >= MAX_FRAMES) return frames;
    }
  }

  if (frames.length === 1) {
    const fallback = cleanText(excerpt || '');
    if (fallback) {
      frames.push({ id: 'excerpt', text: fallback, kind: 'paragraph' });
    }
  }

  return frames;
}
