export const UNDER_REVIEW_MAIL = `
Thank you for your report.

We would like to inform you that we have initiated an investigation into the matter.
If you would like to share additional details or evidence, please contact us at:
gridesync@abusereport.org

We appreciate your cooperation and will take appropriate action as necessary.
`;

export const RESOLVED_MAIL = `
As per your request, we conducted a thorough investigation into the matter.
Based on our findings, appropriate legal and corrective actions have been taken.

Thank you for bringing this to our attention.
`;

export const getStatusBasedMsg = (status: string): string | false => {
  if (status === "Under Review") return UNDER_REVIEW_MAIL;
  if (status === "Resolved") return RESOLVED_MAIL;
  return false;
};
