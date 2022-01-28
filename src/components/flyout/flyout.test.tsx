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

import React from 'react';
import { render, mount } from 'enzyme';
import { requiredProps, takeMountedSnapshot } from '../../test';

import { WuiFlyout, WuiFlyoutSize } from './flyout';

jest.mock('../overlay_mask', () => ({
  WuiOverlayMask: ({ headerZindexLocation, ...props }: any) => (
    <div {...props} />
  ),
}));

const SIZES: WuiFlyoutSize[] = ['s', 'm', 'l'];

describe('WuiFlyout', () => {
  test('is rendered', () => {
    const component = mount(
      <WuiFlyout {...requiredProps} onClose={() => {}} />
    );

    expect(takeMountedSnapshot(component)).toMatchSnapshot();
  });

  describe('props', () => {
    test('close button is not rendered', () => {
      const component = mount(<WuiFlyout onClose={() => {}} hideCloseButton />);

      expect(takeMountedSnapshot(component)).toMatchSnapshot();
    });

    describe('closeButtonLabel', () => {
      test('has a default label for the close button', () => {
        const component = render(<WuiFlyout onClose={() => {}} />);
        const label = component
          .find('[data-test-subj="wuiFlyoutCloseButton"]')
          .prop('aria-label');
        expect(label).toBe('Close this dialog');
      });

      test('sets a custom label for the close button', () => {
        const component = render(
          <WuiFlyout
            onClose={() => {}}
            closeButtonAriaLabel="Closes specific flyout"
          />
        );
        const label = component
          .find('[data-test-subj="wuiFlyoutCloseButton"]')
          .prop('aria-label');
        expect(label).toBe('Closes specific flyout');
      });
    });

    test('accepts div props', () => {
      const component = mount(<WuiFlyout onClose={() => {}} id="imaflyout" />);

      expect(takeMountedSnapshot(component)).toMatchSnapshot();
    });

    describe('size', () => {
      SIZES.forEach(size => {
        it(`${size} is rendered`, () => {
          const component = mount(<WuiFlyout onClose={() => {}} size={size} />);

          expect(takeMountedSnapshot(component)).toMatchSnapshot();
        });
      });
    });

    describe('max width', () => {
      test('can be set to a default', () => {
        const component = mount(
          <WuiFlyout onClose={() => {}} maxWidth={true} />
        );

        expect(takeMountedSnapshot(component)).toMatchSnapshot();
      });

      test('can be set to a custom number', () => {
        const component = mount(
          <WuiFlyout onClose={() => {}} maxWidth={1024} />
        );

        expect(takeMountedSnapshot(component)).toMatchSnapshot();
      });

      test('can be set to a custom value and measurement', () => {
        const component = mount(
          <WuiFlyout onClose={() => {}} maxWidth="24rem" />
        );

        expect(takeMountedSnapshot(component)).toMatchSnapshot();
      });
    });

    describe('ownFocus', () => {
      test('is rendered', () => {
        const component = mount(
          <WuiFlyout onClose={() => {}} ownFocus={true} />
        );

        expect(
          takeMountedSnapshot(component, { hasArrayOutput: true })
        ).toMatchSnapshot();
      });

      test('can alter mask props with maskProps without throwing error', () => {
        const component = mount(
          <WuiFlyout
            onClose={() => {}}
            ownFocus={true}
            maskProps={{ headerZindexLocation: 'above' }}
          />
        );

        expect(
          takeMountedSnapshot(component, { hasArrayOutput: true })
        ).toMatchSnapshot();
      });
    });
  });
});
