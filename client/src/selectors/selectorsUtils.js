import {
    createSelectorWithDependencies,
    registerSelectors
} from 'reselect-tools';
import {makeSafe} from '../utils';

// Catch error here so stack trace can be shown properly.
// Because it would otherwise be caught in aync action, which
// is confusing.
export const createSelector = makeSafe(createSelectorWithDependencies);
export {registerSelectors};
