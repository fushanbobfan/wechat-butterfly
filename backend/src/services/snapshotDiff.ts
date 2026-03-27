import { ProfileSnapshot } from '../types/profile';

export type ChangedField = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
};

export type DiffSummary = {
  changedTextFields: ChangedField[];
  changedTags: ChangedField[];
  changedImages: ChangedField[];
  changedLinks: ChangedField[];
};

export function buildDiffSummary(oldSnapshot: ProfileSnapshot | undefined, newSnapshot: ProfileSnapshot): DiffSummary {
  if (!oldSnapshot) {
    return {
      changedTextFields: [{ field: 'all', oldValue: null, newValue: newSnapshot }],
      changedTags: [{ field: 'tags', oldValue: [], newValue: newSnapshot.tags }],
      changedImages: [{ field: 'mainImage', oldValue: null, newValue: newSnapshot.mainImage }],
      changedLinks: [{ field: 'externalLinks', oldValue: [], newValue: newSnapshot.externalLinks }],
    };
  }

  return {
    changedTextFields: diffFields(oldSnapshot, newSnapshot, ['title', 'description', 'source', 'authorization']),
    changedTags: diffFields(oldSnapshot, newSnapshot, ['tags']),
    changedImages: diffFields(oldSnapshot, newSnapshot, ['mainImage']),
    changedLinks: diffFields(oldSnapshot, newSnapshot, ['externalLinks']),
  };
}

function diffFields(oldSnapshot: ProfileSnapshot, newSnapshot: ProfileSnapshot, fields: Array<keyof ProfileSnapshot>): ChangedField[] {
  return fields.flatMap((field) => {
    const oldValue = oldSnapshot[field];
    const newValue = newSnapshot[field];
    return JSON.stringify(oldValue) === JSON.stringify(newValue)
      ? []
      : [{ field: String(field), oldValue, newValue }];
  });
}
