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

import React, {
  ButtonHTMLAttributes,
  FunctionComponent,
  HTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import classNames from 'classnames';

import { CommonProps, ExclusiveUnion } from '../common';
import { WuiBetaBadge } from '../badge/beta_badge';

export type PanelPaddingSize = 'none' | 's' | 'm' | 'l';

interface Props extends CommonProps {
  /**
   * If active, adds a deeper shadow to the panel
   */
  hasShadow?: boolean;
  /**
   * Padding applied to the panel
   */
  paddingSize?: PanelPaddingSize;
  /**
   * When true the panel will grow to match `WuiFlexItem`
   */
  grow?: boolean;

  panelRef?: Ref<HTMLDivElement>;

  /**
   * Add a badge to the panel to label it as "Beta" or other non-GA state
   */
  betaBadgeLabel?: string;

  /**
   * Add a description to the beta badge (will appear in a tooltip)
   */
  betaBadgeTooltipContent?: ReactNode;

  /**
   * Optional title will be supplied as tooltip title or title attribute otherwise the label will be used
   */
  betaBadgeTitle?: string;
}

interface Divlike
  extends Props,
    Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {}

interface Buttonlike extends Props, ButtonHTMLAttributes<HTMLButtonElement> {}

export type WuiPanelProps = ExclusiveUnion<Divlike, Buttonlike>;

const paddingSizeToClassNameMap = {
  none: null,
  s: 'wuiPanel--paddingSmall',
  m: 'wuiPanel--paddingMedium',
  l: 'wuiPanel--paddingLarge',
};

export const SIZES = Object.keys(paddingSizeToClassNameMap);

export const WuiPanel: FunctionComponent<WuiPanelProps> = ({
  children,
  className,
  paddingSize = 'm',
  hasShadow = false,
  grow = true,
  panelRef,
  onClick,
  betaBadgeLabel,
  betaBadgeTooltipContent,
  betaBadgeTitle,
  ...rest
}) => {
  const classes = classNames(
    'wuiPanel',
    paddingSize ? paddingSizeToClassNameMap[paddingSize] : null,
    {
      'wuiPanel--shadow': hasShadow,
      'wuiPanel--flexGrowZero': !grow,
      'wuiPanel--isClickable': onClick,
      'wuiPanel--hasBetaBadge': betaBadgeLabel,
    },
    className
  );

  let optionalBetaBadge;
  if (betaBadgeLabel) {
    optionalBetaBadge = (
      <span className="wuiPanel__betaBadgeWrapper">
        <WuiBetaBadge
          label={betaBadgeLabel}
          title={betaBadgeTitle}
          tooltipContent={betaBadgeTooltipContent}
          className="wuiPanel__betaBadge"
        />
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        ref={panelRef as Ref<HTMLButtonElement>}
        className={classes}
        onClick={onClick}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {optionalBetaBadge}
        {children}
      </button>
    );
  }

  return (
    <div
      ref={panelRef as Ref<HTMLDivElement>}
      className={classes}
      {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {optionalBetaBadge}
      {children}
    </div>
  );
};
