import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'evergreen-hollow-farm' },
    update: {},
    create: {
      name: 'Evergreen Hollow Farm',
      slug: 'evergreen-hollow-farm',
      plan: 'GROWTH',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'apexmarketingautomations@gmail.com' },
    update: {},
    create: {
      email: 'apexmarketingautomations@gmail.com',
      name: 'Evergreen Hollow',
      role: 'ADMIN',
    },
  })

  await prisma.orgMember.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id, role: 'OWNER' },
  })

  // Seed sample breeds
  const breedData = [
    { name: 'Silkie', species: 'CHICKEN', description: 'Fluffy, gentle birds with unique silk-like feathers', eggColor: 'Cream/Tinted', temperament: 'Docile, friendly', isRare: false },
    { name: 'Black Silkie', species: 'CHICKEN', description: 'Black-feathered Silkies with striking blue-black skin', eggColor: 'Cream/Tinted', temperament: 'Docile, friendly', isRare: false },
    { name: 'Silver Laced Wyandotte', species: 'CHICKEN', description: 'Beautiful silver and black laced plumage, cold-hardy dual-purpose breed', eggColor: 'Brown', temperament: 'Calm, friendly', isRare: false },
    { name: "Mille Fleur d'Uccle", species: 'CHICKEN', description: 'Bantam breed with gorgeous spangled feathering and feathered feet', eggColor: 'White/Cream', temperament: 'Friendly, talkative', isRare: true },
    { name: 'Black Java', species: 'CHICKEN', description: 'Large, stately heritage breed with iridescent black plumage. One of America\'s oldest breeds.', eggColor: 'Brown', temperament: 'Calm', isRare: true },
    { name: 'Embden Goose', species: 'GOOSE', description: 'Large white geese, excellent for a farm setting. Known for their alertness and gentle nature.', eggColor: 'White (large)', temperament: 'Alert, protective', isRare: false },
    { name: 'Sebastopol Goose', species: 'GOOSE', description: 'Distinctive curly-feathered ornamental goose with a gentle disposition', eggColor: 'White (large)', temperament: 'Gentle, calm', isRare: true },
    { name: 'Mandarin Duck', species: 'DUCK', description: 'Stunning ornamental waterfowl with brilliant plumage. Males display vivid colors.', eggColor: 'Cream', temperament: 'Shy, active', isRare: true },
  ]

  for (const breed of breedData) {
    await prisma.breed.upsert({
      where: { orgId_name: { orgId: org.id, name: breed.name } },
      update: {},
      create: { ...breed, species: breed.species as any, orgId: org.id },
    })
  }

  console.log('Seed complete:', { org: org.name, user: user.email, breeds: breedData.length })
}

main().catch(console.error).finally(() => prisma.$disconnect())
