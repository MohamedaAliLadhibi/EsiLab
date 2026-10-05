import Image from 'next/image';

export function ThisIsUs() {
  return (
    <>
      {/* === THIS IS US — INTRO === */}
      <section className="bg-white py-24">
        <div className="site-shell">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            {/* Big photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-line">
              <Image
                src="/Us/us-2.jpg"
                alt="L'équipe EsiLab sur le terrain"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            {/* Paragraph + 2 stacked photos */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-blue">
                  This is us
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight text-ink md:text-4xl">
                  Une équipe tunisienne, proche de vos laboratoires.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Depuis notre création, EsiLab accompagne les laboratoires
                  d’analyses, de recherche et d’enseignement partout en Tunisie.
                  Nous combinons expertise technique, réactivité et proximité
                  pour équiper et faire durer vos instruments.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
                  <Image
                    src="/Us/us-3.jpg"
                    alt="Stand EsiLab lors d'un salon professionnel"
                    fill
                    sizes="30vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
                  <Image
                    src="/Us/us-4.jpg"
                    alt="Démonstration produit sur notre stand"
                    fill
                    sizes="30vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SUR LE TERRAIN — MOSAIC === */}
      <section className="bg-cloud/60 py-24">
        <div className="site-shell">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Tall photo */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line md:row-span-2">
              <Image
                src="/Us/us-5.jpg"
                alt="EsiLab lors d'un salon professionnel en Tunisie"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            {/* Paragraph card */}
            <div className="rounded-[2rem] border border-line bg-white p-8 md:col-span-2">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan">
                Sur le terrain
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-ink">
                Nous rencontrons nos clients là où ils exercent.
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Salons professionnels, journées techniques, formations sur site :
                nous cultivons le contact direct pour comprendre vos contraintes
                réelles et vous proposer les bonnes solutions.
              </p>
            </div>

            {/* Two small photos */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-line">
              <Image
                src="/Us/us-6.jpg"
                alt="Échanges avec les visiteurs sur le stand EsiLab"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-line">
              <Image
                src="/Us/us-7.jpg"
                alt="Présentation d'équipements de laboratoire"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}