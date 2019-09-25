export function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    const first = a[property];
    const second = b[property];

    const result = (first < second) ? -1 : (first > second) ? 1 : 0;
    return result * sortOrder;
  };
}

export function dynamicSortMultiple() {
  /*
   * save the arguments object as it will be overwritten
   * note that arguments object is an array-like object
   * consisting of the names of the properties to sort by
   */
  const props = arguments;
  return function (obj1, obj2) {
    let i = 0, result = 0;
    const numberOfProperties = props.length;
    /* try getting a different result from 0 (equal)
     * as long as we have extra properties to compare
     */
    while (result === 0 && i < numberOfProperties) {
      result = dynamicSort(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
}

export class SortableArray extends Array {
  constructor(...args) {
    super(...args);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SortableArray.prototype);
  }

  sortBy(...args) {
    return this.sort(dynamicSortMultiple.apply(null, args));
  }
}
