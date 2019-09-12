import React from 'react';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import classnames from 'classnames';
import styles from './grid.styl';

const GridContainer = ({ children, gap, minWidth, className, style }) => (
  <ul
    className={classnames(styles.grid, className)}
    style={{
      ...style,
      '--row-gap': (gap && gap.row) || gap,
      '--column-gap': (gap && gap.column) || gap,
      '--min-width': minWidth,
    }}
  >
    {children}
  </ul>
);

const GridItem = ({ children, className, ...props }) => (
  <li className={classnames(styles.item, className)} {...props}>
    {children}
  </li>
);

const SortableGridContainer = SortableContainer(GridContainer);
const SortableGridItem = SortableElement(GridItem);

const Grid = ({ items, itemClassName, children, sortable, onReorder, ...props }) => {
  const [sortingItems, setSortingItems] = React.useState(null);
  if (sortable) {
    const onDragStart = (event) => {
      event.preventDefault();
    };
    const onSortStart = () => setSortingItems(items);
    const onSortOver = ({ oldIndex, newIndex, isKeySorting }) => {
      if (isKeySorting) onReorder(items[oldIndex], newIndex);
    };
    const onSortEnd = ({ oldIndex, newIndex }) => {
      onReorder(sortingItems[oldIndex], newIndex);
      setSortingItems(null);
    };
    return (
      <SortableGridContainer
        {...props}
        axis="xy"
        distance={15}
        onSortStart={onSortStart}
        onSortOver={onSortOver}
        onSortEnd={onSortEnd}
        helperClass={styles.dragStyle}
      >
        {(sortingItems || items).map((item, index) => (
          <SortableGridItem key={item.id} className={itemClassName} index={index} tabIndex={0} onDragStart={onDragStart}>
            {children(item)}
          </SortableGridItem>
        ))}
      </SortableGridContainer>
    );
  }
  return (
    <GridContainer {...props}>
      {items.map((item) => (
        <GridItem key={item.id} className={itemClassName}>
          {children(item)}
        </GridItem>
      ))}
    </GridContainer>
  );
};

Grid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  sortable: (props) => props.sortable && !props.onReorder && new Error('If a container is sortable, it needs onReorder defined'),
  onReorder: PropTypes.func,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  style: PropTypes.object,
  gap: PropTypes.oneOfType([
    PropTypes.shape({ row: PropTypes.node.isRequired, column: PropTypes.node.isRequired }).isRequired,
    PropTypes.node.isRequired,
  ]),
  minWidth: PropTypes.node,
};

Grid.defaultProps = {
  sortable: false,
  onReorder: null,
  className: '',
  itemClassName: '',
  style: {},
  gap: undefined,
  minWidth: undefined,
};

export default Grid;
