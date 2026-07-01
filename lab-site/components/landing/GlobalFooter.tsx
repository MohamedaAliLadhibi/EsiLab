import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { company, solutions } from '@/lib/site-data';

const companyLinks = [
  { href: '/about', label: 'Presentation de l entreprise' },
  { href: '/about', label: 'Qualite et accompagnement' },
  { href: '/contact', label: 'Demande de devis' },
];

const practicalLinks = [
  { href: '/products', label: 'Catalogue produits' },
  { href: '/solutions', label: 'Solutions et applications' },
  { href: '/contact', label: 'Support commercial' },
];

export function GlobalFooter() {
  return (
    <footer className="bg-[#0f47b4] text-white">
      <div className="site-shell grid gap-12 py-16 lg:grid-cols-[1.05fr_0.8fr_0.8fr_0.95fr]">
        <div>
          <p className="text-4xl font-semibold">EsiLab</p>
          <p className="mt-3 text-lg text-white/80">Expert du laboratoire</p>

          <div className="mt-6 flex items-center gap-3">
            {[Facebook, Linkedin, Instagram, Youtube].map((Icon, index) => (
              <span key={index} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue">
                <Icon size={20} />
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-3 text-white/80">
            <p className="inline-flex items-start gap-3">
              <Phone size={18} className="mt-0.5 text-cyan" />
              {company.phone}
            </p>
            <p className="inline-flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-cyan" />
              {company.email}
            </p>
            <p className="inline-flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-cyan" />
              {company.address}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-xl font-semibold">S'abonner a la newsletter</p>
            <p className="mt-2 text-sm text-white/75">Actualites, promotions et nouveautes EsiLab.</p>
            <form
              action="https://mail.google.com/mail/"
              method="get"
              target="_blank"
              className="mt-4 flex items-center overflow-hidden rounded-full bg-white"
            >
              <input type="hidden" name="view" value="cm" />
              <input type="hidden" name="fs" value="1" />
              <input type="hidden" name="to" value={company.email} />
              <input type="hidden" name="su" value="Inscription newsletter EsiLab" />
              <input
                type="email"
                name="body"
                required
                className="flex-1 border-0 bg-transparent px-5 py-4 text-sm text-ink outline-none"
                placeholder="Votre email professionnel"
              />
              <button type="submit" className="m-1 rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-white">
                Envoyer
              </button>
            </form>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Qui sommes-nous ?</h3>
          <div className="mt-6 space-y-4 text-white/78">
            {companyLinks.map((item) => (
              <Link key={item.label} href={item.href} className="block transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Infos pratiques</h3>
          <div className="mt-6 space-y-4 text-white/78">
            {practicalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="block transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Nos services</h3>
          <div className="mt-6 space-y-4 text-white/78">
            {solutions.map((item) => (
              <Link key={item.slug} href={`/solutions#${item.slug}`} className="block transition hover:text-white">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/14">
        <div className="site-shell py-8 text-center text-sm leading-7 text-white/72">
          Depuis plus de 85 ans dans l'esprit des grandes maisons du laboratoire, EsiLab accompagne les equipes avec
          des equipements, des reactifs, des services et un support technique centre sur la qualite, la precision et la
          performance.
        </div>
      </div>
    </footer>
  );
}
