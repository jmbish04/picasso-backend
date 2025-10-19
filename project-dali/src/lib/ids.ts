import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 12);

export const ids = {
  project: () => `proj_${nanoid()}`,
  job: () => `job_${nanoid()}`,
  progression: () => `prog_${nanoid()}`,
  artifact: () => `art_${nanoid()}`,
  slug: () => `slug-${nanoid().toLowerCase()}`,
};

// TODO(Jules): align slug generation with public artifact routing strategy if additional constraints emerge.
