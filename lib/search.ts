import Fuse from 'fuse.js'

export interface SearchItem {
  title: string
  path: string
  content: string
  category?: string
}

// Build search index from content structure
export const searchItems: SearchItem[] = [
  {
    title: 'Home',
    path: '/',
    content: 'Developer Hub - Centralized knowledge base for all development teams',
    category: 'Main',
  },
  {
    title: '00. Principles',
    path: '/00-principles',
    content: 'Core development principles and values. Ownership & Responsibility, Safety Over Speed, Promotion Not Deployment',
    category: 'Principles',
  },
  {
    title: '10. Developer Contracts',
    path: '/10-developer-contracts',
    content: 'Agreements and responsibilities. Local Testing Contract, CI Responsibility Contract, Staging Promotion Contract',
    category: 'Contracts',
  },
  {
    title: '20. Workflows',
    path: '/20-workflows',
    content: 'Development workflows and processes. Branching Strategy, Release Flow, Hotfix Process',
    category: 'Workflows',
  },
  {
    title: '30. Tooling',
    path: '/30-tooling',
    content: 'Development tools and setup. Local Setup, Test Commands, CI Overview',
    category: 'Tooling',
  },
  {
    title: '40. Reference',
    path: '/40-reference',
    content: 'Architecture and technical reference. Architecture, ADRs, Runbooks',
    category: 'Reference',
  },
  {
    title: 'Domains Overview',
    path: '/domains',
    content: 'Domain-specific documentation. API Integration, Integration Services, Security, Platform Engineering',
    category: 'Domains',
  },
  {
    title: 'API Integration',
    path: '/domains/api-integration',
    content: 'API integration patterns, Java backend + React frontend patterns, and best practices',
    category: 'API Integration',
  },
  {
    title: 'Java + React Patterns',
    path: '/domains/api-integration/java-react-patterns',
    content: 'Common patterns for integrating Java Spring Boot backend with React frontend. REST APIs, authentication, error handling',
    category: 'API Integration',
  },
  {
    title: 'Database Notes',
    path: '/30-tooling/database',
    content: 'Database setup, configuration, and best practices. PostgreSQL, connection pooling, migrations',
    category: 'Tooling',
  },
  {
    title: 'Integration Services',
    path: '/domains/integration-services',
    content: 'Third-party integrations and services. Email, Payments, CI/CD tools',
    category: 'Domains',
  },
  {
    title: 'Email Services',
    path: '/domains/integration-services/implementation/email-services',
    content: 'Email integration with Resend. Transactional emails, templates, SMTP',
    category: 'Integration Services',
  },
  {
    title: 'Payment Services',
    path: '/domains/integration-services/implementation/payment-services',
    content: 'Payment processing with Stripe. Checkout sessions, subscriptions, webhooks',
    category: 'Integration Services',
  },
  {
    title: 'CI/CD Tools',
    path: '/domains/integration-services/implementation/ci-cd-tools',
    content: 'Continuous Integration and Deployment. Vercel, GitHub Actions, deployment strategies',
    category: 'Integration Services',
  },
  {
    title: 'Capabilities Matrix',
    path: '/domains/integration-services/implementation/capabilities-matrix',
    content: 'Build vs buy decisions. Integration capabilities and recommendations',
    category: 'Integration Services',
  },
  {
    title: 'Security Overview',
    path: '/domains/security',
    content: 'Security practices and procedures. Authentication, encryption, OWASP',
    category: 'Security',
  },
  {
    title: 'Security Architecture',
    path: '/domains/security/architecture/overview',
    content: 'Security architecture and design. System security, threat modeling',
    category: 'Security',
  },
  {
    title: 'Security Procedures',
    path: '/domains/security/implementation/security-procedures',
    content: 'Security implementation procedures. Best practices, guidelines',
    category: 'Security',
  },
  {
    title: 'Product Security',
    path: '/domains/security/implementation/product-security',
    content: 'Product security practices. Secure development lifecycle',
    category: 'Security',
  },
  {
    title: 'Security Endpoints',
    path: '/domains/security/api/security-endpoints',
    content: 'API security endpoints. Authentication, authorization, secure APIs',
    category: 'Security',
  },
  {
    title: 'Platform Engineering',
    path: '/domains/platform-engineering',
    content: 'Infrastructure and deployment. Platform concerns, deployment strategies',
    category: 'Platform Engineering',
  },
  {
    title: 'Deployment Strategy',
    path: '/domains/platform-engineering/implementation/deployment-strategy',
    content: 'Deployment strategies and practices. CI/CD, infrastructure as code',
    category: 'Platform Engineering',
  },
]

// Configure Fuse.js for optimal search
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'category', weight: 0.2 },
    { name: 'path', weight: 0.1 },
  ],
  threshold: 0.3, // Lower = more strict, higher = more fuzzy
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
  findAllMatches: true,
}

let fuseInstance: Fuse<SearchItem> | null = null

export function getSearchInstance(): Fuse<SearchItem> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(searchItems, fuseOptions)
  }
  return fuseInstance
}

export function search(query: string, limit: number = 10): SearchItem[] {
  if (!query || query.length < 2) {
    return []
  }

  const fuse = getSearchInstance()
  const results = fuse.search(query, { limit })
  return results.map((result) => result.item)
}

