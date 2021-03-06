// @flow

import shortid from 'shortid';

export function addProject(entry: { parent: string | null, name: string }) {
  return {
    type: 'ADD_PROJECT',
    id: shortid.generate(),
    ...entry,
  };
}

export function updateProject(entry: projectType) {
  return {
    type: 'UPDATE_PROJECT',
    ...entry,
  };
}

export function removeProject(id: string) {
  return {
    type: 'REMOVE_PROJECT',
    id,
  };
}

export function truncateProjects() {
  return { type: 'TRUNCATE_PROJECTS' };
}
