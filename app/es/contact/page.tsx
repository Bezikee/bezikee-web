import { Contact } from '../../../src/views/Contact'
import { pageMetadata } from '../../../src/seo'
import { getDictionary } from '../../../src/i18n'

export const metadata = pageMetadata('contact', 'es')

export default function Page() {
  return <Contact locale="es" t={getDictionary('es').contact} />
}
