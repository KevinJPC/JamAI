export function formatZodIssues (issues) {
  const rootIssues = []
  const fieldIssuesByKey = {}

  for (const issue of issues) {
    if (issue.path.length === 0) {
      rootIssues.push({
        message: issue.message,
        code: issue.code
      })
      continue
    }
    const issueKey = issue.path.join('.')
    if (!fieldIssuesByKey[issueKey]) fieldIssuesByKey[issueKey] = []
    fieldIssuesByKey[issueKey].push({
      message: issue.message,
      code: issue.code
    })
  }

  return {
    root: rootIssues,
    fields: Object.entries(fieldIssuesByKey)
  }
}
