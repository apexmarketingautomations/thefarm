import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-marketing' },
    update: {},
    create: {
      name: 'Apex Marketing Automations',
      slug: 'apex-marketing',
      plan: 'GROWTH',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'apexmarketingautomations@gmail.com' },
    update: {},
    create: {
      email: 'apexmarketingautomations@gmail.com',
      name: 'Apex Marketing',
      role: 'ADMIN',
    },
  })

  await prisma.orgMember.upsert({
    where: { userId_orgId: { userId: user.id, orgId: org.id } },
    update: {},
    create: { userId: user.id, orgId: org.id, role: 'OWNER' },
  })

  console.log('Seed complete:', { org: org.name, user: user.email })
}

main().catch(console.error).finally(() => prisma.$disconnect())
