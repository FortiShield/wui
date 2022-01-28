/*
 * Copyright 2022 Wazuh Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * NOTICE: THIS FILE HAS BEEN MODIFIED BY WAZUH INC UNDER COMPLIANCE WITH THE APACHE 2.0 LICENSE FROM THE ORIGINAL WORK
 * OF THE COMPANY Elasticsearch B.V.
 *
 * THE FOLLOWING IS THE COPYRIGHT OF THE ORIGINAL DOCUMENT:
 *
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { Component, MouseEventHandler, HTMLAttributes } from 'react';
import classNames from 'classnames';

import range from 'lodash/range';

import { isEvenlyDivisibleBy } from '../../../services';
import { WuiRangeLevels, WuiRangeLevel, LEVEL_COLORS } from './range_levels';
import { WuiRangeTicks, WuiRangeTick } from './range_ticks';

export { LEVEL_COLORS };

export interface WuiRangeTrackProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min: number;
  max: number;
  step?: number;
  value?: number | string | Array<string | number>;
  compressed?: boolean;
  disabled?: boolean;
  showTicks?: boolean;
  tickInterval?: number;
  ticks?: WuiRangeTick[];
  onChange?: MouseEventHandler<HTMLButtonElement>;
  levels?: WuiRangeLevel[];
}

export class WuiRangeTrack extends Component<WuiRangeTrackProps> {
  validateValueIsInStep = (value: number) => {
    if (value < this.props.min) {
      throw new Error(
        `The value of ${value} is lower than the min value of ${this.props.min}.`
      );
    }
    if (value > this.props.max) {
      throw new Error(
        `The value of ${value} is higher than the max value of ${this.props.max}.`
      );
    }
    // Error out if the value doesn't line up with the sequence of steps
    if (
      !isEvenlyDivisibleBy(
        value - this.props.min,
        this.props.step !== undefined ? this.props.step : 1
      )
    ) {
      throw new Error(
        `The value of ${value} is not included in the possible sequence provided by the step of ${this.props.step}.`
      );
    }
    // Return the value if nothing fails
    return value;
  };

  calculateSequence = (
    min: WuiRangeTrackProps['min'],
    max: WuiRangeTrackProps['max'],
    interval?: WuiRangeTrackProps['tickInterval']
  ) => {
    // Loop from min to max, creating adding values at each interval
    // (adds a very small number to the max since `range` is not inclusive of the max value)
    const toBeInclusive = 0.000000001;
    return range(min, max + toBeInclusive, interval);
  };

  calculateTicks = (
    min: WuiRangeTrackProps['min'],
    max: WuiRangeTrackProps['max'],
    step?: WuiRangeTrackProps['step'],
    tickInterval?: WuiRangeTrackProps['tickInterval'],
    customTicks?: WuiRangeTick[]
  ) => {
    let ticks;

    if (customTicks) {
      // If custom values were passed, use those for the sequence
      // But make sure they align with the possible sequence
      ticks = customTicks.map(tick => {
        return this.validateValueIsInStep(tick.value);
      });
    } else {
      // If a custom interval was passed, use those for the sequence
      // But make sure they align with the possible sequence
      const interval = tickInterval || step;
      const tickSequence = this.calculateSequence(min, max, interval);

      ticks = tickSequence.map(tick => {
        return this.validateValueIsInStep(tick);
      });
    }

    // Error out if there are too many ticks to render
    if (ticks.length > 20) {
      throw new Error(
        `The number of ticks to render is too high (${ticks.length}), reduce the interval.`
      );
    }

    return ticks;
  };

  render() {
    const {
      children,
      disabled,
      max,
      min,
      step,
      showTicks,
      tickInterval,
      ticks,
      levels,
      onChange,
      value,
      compressed,
      ...rest
    } = this.props;

    // TODO: Move these to only re-calculate if no-value props have changed
    this.validateValueIsInStep(max);

    let tickSequence;
    const inputWrapperStyle: { marginLeft?: string; marginRight?: string } = {};
    if (showTicks) {
      tickSequence = this.calculateTicks(min, max, step, tickInterval, ticks);

      // Calculate if any extra margin should be added to the inputWrapper
      // because of longer tick labels on the ends
      const lengthOfMinLabel = String(tickSequence[0]).length;
      const lenghtOfMaxLabel = String(tickSequence[tickSequence.length - 1])
        .length;
      const isLastTickTheMax = tickSequence[tickSequence.length - 1] === max;
      if (lengthOfMinLabel > 2) {
        inputWrapperStyle.marginLeft = `${lengthOfMinLabel / 5}em`;
      }
      if (isLastTickTheMax && lenghtOfMaxLabel > 2) {
        inputWrapperStyle.marginRight = `${lenghtOfMaxLabel / 5}em`;
      }
    }

    const trackClasses = classNames('wuiRangeTrack', {
      'wuiRangeTrack--disabled': disabled,
    });

    return (
      <div className={trackClasses} style={inputWrapperStyle} {...rest}>
        {levels && !!levels.length && (
          <WuiRangeLevels
            compressed={compressed}
            levels={levels}
            max={max}
            min={min}
            showTicks={showTicks}
          />
        )}
        {tickSequence && (
          <WuiRangeTicks
            disabled={disabled}
            compressed={compressed}
            onChange={onChange}
            ticks={ticks}
            tickSequence={tickSequence}
            value={value}
            min={min}
            max={max}
            interval={tickInterval || step}
          />
        )}
        {children}
      </div>
    );
  }
}
