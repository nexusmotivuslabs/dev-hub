import Link from 'next/link'

export default function Home() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
        <SectionCard
          title="00. Principles"
          description="Core development principles and values"
          href="/00-principles"
          items={[
            'Ownership & Responsibility',
            'Safety Over Speed',
            'Promotion, Not Deployment'
          ]}
        />
        
        <SectionCard
          title="10. Developer Contracts"
          description="Agreements and responsibilities"
          href="/10-developer-contracts"
          items={[
            'Local Testing Contract',
            'CI Responsibility Contract',
            'Staging Promotion Contract'
          ]}
        />
        
        <SectionCard
          title="20. Workflows"
          description="Development workflows and processes"
          href="/20-workflows"
          items={[
            'Branching Strategy',
            'Release Flow',
            'Hotfix Process'
          ]}
        />
        
        <SectionCard
          title="30. Tooling"
          description="Development tools and setup"
          href="/30-tooling"
          items={[
            'Local Setup',
            'Test Commands',
            'CI Overview'
          ]}
        />
        
        <SectionCard
          title="40. Reference"
          description="Architecture and technical reference"
          href="/40-reference"
          items={[
            'Architecture',
            'ADRs',
            'Runbooks'
          ]}
        />
        
        <SectionCard
          title="Domains"
          description="Domain-specific documentation"
          href="/domains"
          items={[
            'Platform Engineering',
            'Security',
            'More domains...'
          ]}
        />
      </div>
    </div>
  )
}

function SectionCard({ 
  title, 
  description, 
  href, 
  items 
}: { 
  title: string
  description: string
  href: string
  items: string[]
}) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 hover:shadow-md transition-shadow cursor-pointer h-full min-h-[200px] flex flex-col">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{description}</p>
        <ul className="space-y-1.5 sm:space-y-2">
          {items.map((item, index) => (
            <li key={index} className="text-xs sm:text-sm text-gray-700 flex items-center">
              <span className="mr-2">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  )
}
