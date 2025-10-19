/**
 * Stakeholder PDF Generator
 * Inputs: executive summary, highlights, selected imagery.
 * Output: PDF generated from HTML template via external service.
 */
import type { ArtifactGenerator } from '@/artifacts/registry';

export const stakeholderPdfGenerator: ArtifactGenerator = {
  id: 'stakeholder-pdf',
  name: 'Stakeholder PDF',
  output: 'pdf',
  async generate(env, args) {
    // TODO(Jules): render HTML, convert to PDF using service binding, and upload to R2.
    env;
    args;
    throw new Error('stakeholderPdfGenerator.generate not implemented');
  },
};
