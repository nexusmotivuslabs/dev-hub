# 20. Workflows

Development workflows and processes we follow.

## Branching Strategy

We use a simplified Git Flow:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: Feature branches
- **hotfix/***: Critical production fixes
- **release/***: Release preparation branches

### Branch Rules

- Always branch from `develop` for features
- Always branch from `main` for hotfixes
- Keep branches small and focused
- Delete branches after merging

## Release Flow

1. **Development**: Work happens on feature branches
2. **Integration**: Merge to `develop` after review
3. **Testing**: Test in staging environment
4. **Release**: Create release branch from `develop`
5. **Promotion**: Merge release branch to `main`
6. **Deployment**: Deploy `main` to production

## Hotfix Process

For critical production issues:

1. Create `hotfix/issue-description` from `main`
2. Fix the issue
3. Test locally and in staging
4. Get code review
5. Merge to `main` and `develop`
6. Deploy immediately

## Related

- [Developer Contracts](/10-developer-contracts)
- [Tooling](/30-tooling)
- [Reference](/40-reference)

