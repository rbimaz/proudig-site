import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

/**
 * Einheitlicher Markdown-Renderer für CMS-Inhalte.
 *
 * Erweitert das Standard-Rendering um eine Autoren-Konvention:
 * - Ein Link mit dem Title `button` (`[Text](/ziel "button")`) wird als
 *   Call-to-Action-Button (`btn btn-cta`) dargestellt statt als Text-Link.
 * - Interne Ziele (Pfad beginnt mit `/`, nicht `//`) navigieren clientseitig
 *   über den React-Router (`Link`) statt per Full-Page-Reload.
 * - Externe Ziele (`http(s)://`, `//`) bleiben Standard-`<a>` mit
 *   `target="_blank"` + `rel="noopener noreferrer"`.
 */
function MarkdownLink({ href = '', title, children }) {
  const isButton = title === 'button';
  const className = isButton ? 'btn btn-cta' : undefined;
  const isInternal = href.startsWith('/') && !href.startsWith('//');
  const isExternalHttp = /^https?:\/\//.test(href) || href.startsWith('//');

  if (isInternal) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      title={isButton ? undefined : title}
      {...(isExternalHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

export default function MarkdownContent({ children }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
      {children}
    </ReactMarkdown>
  );
}
