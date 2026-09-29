import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks'

export function NotFoundPage() {
  useDocumentTitle('Page introuvable | FLASHORA')

  return (
    <section className="page section flex flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="section-title mt-3">Page introuvable</h1>
      <p className="lede mx-auto mt-4 max-w-md text-ink-mute">
        La page que vous cherchez a bougé, a expiré ou n’a jamais existé. Les soldes, eux,
        continuent.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-ink">
          Retour à l’accueil
        </Link>
        <Link to="/shop" className="btn btn-light">
          Parcourir les soldes
        </Link>
      </div>
    </section>
  )
}
