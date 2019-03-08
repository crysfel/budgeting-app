import React, { Fragment, useCallback } from 'react';
import classNames from 'classnames';
import TextField from 'components/TextField';

export default function TagContainer({ name, value, tags, onChange }) {
  const addOrRemoveTag = useCallback((tag) => {
    const hasTag = !!(value && (value.toLowerCase().indexOf(tag.toLowerCase()) > -1));
    const currentTags = value.split(',').filter(tg => tg !== '');

    if (hasTag) {
      // Remove tag
      if (onChange) {
        onChange({
          target: {
            name,
            value: currentTags.filter(tg => tg.trim().toLowerCase() !== tag.trim().toLowerCase()).join(','),
          },
        });
      }
    } else {
      // Add Tag
      currentTags.push(tag);
      if (onChange) {
        onChange({
          target: {
            name,
            value: currentTags.join(','),
          }
        });
      }
    }
  });

  return (
    <Fragment>
      <TextField label="Tags" placeholder="Tags" name={name} value={value} onChange={onChange} />
      <div className="mb-4 overflow-auto" style={{ maxHeight: '90px' }}>
        {
          tags.map(tag => <Tag key={tag.slug} tag={tag} selections={value} onPress={addOrRemoveTag} />)
        }
      </div>
    </Fragment>
  );
}

function Tag({ tag, selections, onPress }) {
  const selected = !!(selections && (selections.toLowerCase().indexOf(tag.name.toLowerCase()) > -1));

  return (
    <button
      className={
        classNames(
          'px-3 py-1 mb-1 mr-1 rounded-lg capitalize overflow-auto', {
            'bg-grey-light text-grey-darkest': !selected,
            'bg-orange text-white': selected,
          })
      }
      style={{ maxHeight: '90px' }}
      onClick={() => onPress(tag.name)}
    >
      {tag.name}
    </button>
  );
}
