import PublicLayout from '@/components/public-layout'
import Link from 'next/link'

const BREEDS = [
  {
    icon: '🐓',
    name: 'Silkie',
    species: 'Chicken',
    description: 'The most docile chicken breed in the world. Known for their fluffy, silk-like plumage, black skin and bones, five toes, and exceptional mothering instincts. Perfect for families and therapy animals. Exceptional brooders.',
    tags: ['Family Friendly', 'Broody', 'Bantam', 'Show Quality'],
  },
  {
    icon: '🖤',
    name: 'Black Silkie',
    species: 'Chicken',
    description: 'Same calm, gentle temperament as the white Silkie with stunning jet-black plumage. Highly sought after and limited in availability. Exceptional as mothers, pets, and show birds.',
    tags: ['Rare', 'Show Quality', 'Bantam', 'Limited'],
  },
  {
    icon: '🐔',
    name: 'Silver Laced Wyandotte',
    species: 'Chicken',
    description: 'A quintessential American heritage breed with breathtaking silver and black laced feathers. Cold-hardy, excellent brown egg layer (~200/year), and a wonderful dual-purpose farm bird.',
    tags: ['Heritage', 'Egg Layer', 'Cold Hardy', 'Large Fowl'],
  },
  {
    icon: '🌺',
    name: 'Mille Fleur d\'Uccle',
    species: 'Chicken',
    description: 'Belgian Bearded d\'Uccle with feathered feet and a gorgeous "thousand flowers" tri-color pattern. One of the friendliest bantam breeds — excellent pets and show birds.',
    tags: ['Bantam', 'Show Quality', 'Pet Friendly', 'Feathered Feet'],
  },
  {
    icon: '🦅',
    name: 'Black Java',
    species: 'Chicken',
    description: 'One of America\'s oldest heritage breeds, listed on the Livestock Conservancy\'s threatened list. Large fowl with excellent foraging ability and steady brown egg production. Buying a Java supports American breed conservation.',
    tags: ['Heritage', 'Conservation', 'Large Fowl', 'Rare'],
  },
  {
    icon: '🪿',
    name: 'Embden Goose',
    species: 'Goose',
    description: 'Large, regal white geese known for their loyal personalities and impressive size. Excellent guardians for homesteads, devoted parents, and stunning to look at.',
    tags: ['Guardian', 'Large', 'White', 'Homestead'],
  },
  {
    icon: '✨',
    name: 'Sebastopol Goose',
    species: 'Goose',
    description: 'The most ornamental goose breed in existence. Uniquely curled and frizzled feathers give them an ethereal, almost fairy-tale appearance. Gentle temperament, show-stopping looks.',
    tags: ['Ornamental', 'Show Quality', 'Rare', 'Gentle'],
  },
  {
    icon: '🦆',
    name: 'Mandarin Duck',
    species: 'Duck',
    description: 'Widely considered among the most beautiful birds in the world. Brilliantly colored males with extraordinary plumage. Note: regulated under the Migratory Bird Treaty Act in some states — we guide buyers through the permit process.',
    tags: ['Ornamental', 'Rare', 'Regulated', 'World\'s Most Beautiful'],
  },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Header */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, var(--farm-green-dark), var(--farm-green))' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Flock</h1>
        <p className="text-green-200 text-lg max-w-2xl mx-auto">
          Eight rare and heritage breeds raised with passion, patience, and decades of knowledge.
        </p>
      </section>

      {/* Farm story */}
      <section className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--farm-green-dark)' }}>About the Farm</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Evergreen Hollow Farm is a small, dedicated heritage poultry and waterfowl operation. We believe rare breeds deserve exceptional care — not factory conditions. Every bird here is pasture-raised, antibiotic-free, and handled with intention.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We specialize in breeds that are hard to find, high in quality, and meaningful to preserve. From Silkies to Sebastopol Geese to Mandarin Ducks, each species on the farm has been carefully selected for temperament, breed conformance, and genetic health.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We are NPIP-certified, which means our flock is tested and monitored for disease — required for interstate shipment of poultry and eggs. When you buy from us, you get documentation you can trust.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: '✅', label: 'NPIP Certified', desc: 'Required for interstate shipping. Our flock is tested and clean.' },
              { icon: '🌿', label: 'No Antibiotics', desc: 'Ever. Our birds eat non-medicated feed and live on pasture.' },
              { icon: '🏡', label: 'Pasture Raised', desc: 'Open air, fresh grass, and natural behaviors — every day.' },
              { icon: '🧬', label: 'Show-Quality Genetics', desc: 'Selected for breed conformance, health, and temperament.' },
            ].map(item => (
              <div key={item.label} className="flex gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--farm-cream)', border: '1px solid #e8dfc8' }}>
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--farm-green-dark)' }}>{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breeds */}
      <section style={{ backgroundColor: 'var(--farm-straw)' }} className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--farm-green-dark)' }}>Meet the Breeds</h2>
          <p className="text-center text-gray-500 mb-10">Click any breed to inquire about availability</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BREEDS.map(b => (
              <div
                key={b.name}
                className="bg-white rounded-2xl p-5 border hover:shadow-md transition-shadow"
                style={{ borderColor: '#e8dfc8' }}
              >
                <div className="flex gap-4">
                  <span className="text-4xl flex-shrink-0">{b.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-bold text-base" style={{ color: 'var(--farm-green-dark)' }}>{b.name}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{b.species}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{b.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {b.tags.map(t => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: 'var(--farm-straw)', color: 'var(--farm-brown)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandarin duck note */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl p-6 border-l-4" style={{ backgroundColor: 'var(--farm-cream)', borderLeftColor: 'var(--farm-amber)' }}>
          <h3 className="font-bold text-base mb-2" style={{ color: 'var(--farm-brown)' }}>📋 A Note on Mandarin Ducks</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Mandarin Ducks are regulated under the Migratory Bird Treaty Act (MBTA) as migratory waterfowl. They are legal to own in most U.S. states with the appropriate permit. We work with buyers to understand their state's requirements and guide them through the process. Don't let the paperwork scare you — we've done this many times and make it straightforward.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-16 text-center">
        <Link
          href="/shop"
          style={{ backgroundColor: 'var(--farm-green)' }}
          className="inline-block text-white font-bold px-8 py-4 rounded-xl hover:brightness-110 transition text-base mr-3"
        >
          Shop Available Birds
        </Link>
        <Link
          href="/contact"
          className="inline-block font-bold px-8 py-4 rounded-xl border-2 transition text-base"
          style={{ borderColor: 'var(--farm-green)', color: 'var(--farm-green)' }}
        >
          Ask a Question
        </Link>
      </section>
    </PublicLayout>
  )
}
