/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getDefaultOptions } from './property.js';

const prop = 'prop';

describe('@property decorator defaults', () => {
  it('should ignore unmatched types', () => {
    const config = { type: 'unknown' };
    expect(getDefaultOptions(prop, config)).toBe(config);
  });

  it('should allow defaults to be overridden', () => {
    expect(getDefaultOptions(prop, { type: String, reflect: false }).reflect).toBe(false);
  });

  it('should reflect properties into attributes for only primitive types', () => {
    expect(getDefaultOptions(prop, { type: String }).reflect).toBe(true);
    expect(getDefaultOptions(prop, { type: Number }).reflect).toBe(true);
    expect(getDefaultOptions(prop, { type: Boolean }).reflect).toBe(true);

    expect(getDefaultOptions(prop, { type: Object }).reflect).toBe(false);
    expect(getDefaultOptions(prop, { type: Array }).reflect).toBe(false);
    expect(getDefaultOptions(prop, { type: Date }).reflect).toBe(false);
  });

  it('should accept boolean attributes with the value of "false"', () => {
    const booleanConverter: any = getDefaultOptions(prop, { type: Boolean }).converter;
    expect(booleanConverter.fromAttribute('false')).toBe(false);
    expect(booleanConverter.fromAttribute('true')).toBe(true);
    expect(booleanConverter.fromAttribute('')).toBe(true);
  });

  it('should parse dates from attributes', () => {
    const dateConverter: any = getDefaultOptions(prop, { type: Date }).converter;
    const date: Date = dateConverter.fromAttribute('2020-01-02');
    expect(date.toISOString()).toBe('2020-01-02T00:00:00.000Z');
  });

  it('should auto format property names to appropriate attribute name', () => {
    expect(getDefaultOptions('propName', { type: Number }).attribute).toBe('prop-name');
  });

  it('should remove attributes when string type is set to null or undefined', () => {
    const stringConverter: any = getDefaultOptions(prop, { type: String }).converter;
    expect(stringConverter.toAttribute(null)).toBe(null);
    expect(stringConverter.toAttribute(undefined)).toBe(null);
    expect(stringConverter.toAttribute('test')).toBe('test');
  });
});
